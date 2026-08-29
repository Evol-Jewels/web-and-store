import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { CART_COOKIE, cartCookieOptions } from "@/lib/shopify/cart/cookie";
import {
  addCartLine,
  createCart,
  getCart,
  removeCartLine,
  updateCartDiscountCodes,
  updateCartLine,
} from "@/lib/shopify/cart/server";
import { ShopifyStorefrontError } from "@/lib/shopify/storefront/client";

function buyerIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")
  );
}

function errorResponse(error: unknown) {
  const message =
    error instanceof ShopifyStorefrontError
      ? error.message
      : "We could not update your shopping bag. Please try again.";

  return NextResponse.json({ error: message }, { status: 400 });
}

function validQuantity(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= 99;
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) return NextResponse.json({ cart: null });

  try {
    const cart = await getCart(cartId, buyerIp(request));

    if (!cart) cookieStore.delete(CART_COOKIE);
    return NextResponse.json({ cart });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      merchandiseId?: unknown;
      quantity?: unknown;
    };

    if (typeof body.merchandiseId !== "string" || !validQuantity(body.quantity)) {
      return NextResponse.json(
        { error: "Choose an available product option before adding it to your bag." },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE)?.value;
    const ip = buyerIp(request);
    const existingCart = cartId ? await getCart(cartId, ip) : null;
    const result = existingCart
      ? await addCartLine(existingCart.id, body.merchandiseId, body.quantity as number, ip)
      : await createCart(body.merchandiseId, body.quantity as number, ip);

    cookieStore.set(CART_COOKIE, result.cart.id, cartCookieOptions);
    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      lineId?: unknown;
      quantity?: unknown;
    };
    const cartId = (await cookies()).get(CART_COOKIE)?.value;

    if (!cartId || typeof body.lineId !== "string" || !validQuantity(body.quantity)) {
      return NextResponse.json({ error: "The shopping bag update is invalid." }, { status: 400 });
    }

    const result = await updateCartLine(
      cartId,
      body.lineId,
      body.quantity as number,
      buyerIp(request),
    );
    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as { lineId?: unknown };
    const cartId = (await cookies()).get(CART_COOKIE)?.value;

    if (!cartId || typeof body.lineId !== "string") {
      return NextResponse.json({ error: "The shopping bag update is invalid." }, { status: 400 });
    }

    const result = await removeCartLine(cartId, body.lineId, buyerIp(request));
    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { discountCode?: unknown };
    const cartId = (await cookies()).get(CART_COOKIE)?.value;

    if (!cartId || typeof body.discountCode !== "string") {
      return NextResponse.json({ error: "Enter a valid discount code." }, { status: 400 });
    }

    const code = body.discountCode.trim();
    const result = await updateCartDiscountCodes(
      cartId,
      code ? [code] : [],
      buyerIp(request),
    );
    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
