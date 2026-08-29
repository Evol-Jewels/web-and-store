import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { CART_COOKIE } from "@/lib/shopify/cart/cookie";
import { getCart } from "@/lib/shopify/cart/server";
import { hasCustomerSession } from "@/lib/shopify/customer-account";

function siteUrl(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
}

export async function GET(request: Request) {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  const fallback = new URL("/products", siteUrl(request));

  if (!cartId) return NextResponse.redirect(fallback);

  try {
    const buyerIp = request.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim();
    const cart = await getCart(cartId, buyerIp);

    if (!cart || cart.totalQuantity < 1) return NextResponse.redirect(fallback);

    const checkoutUrl = new URL(cart.checkoutUrl);
    if (checkoutUrl.protocol !== "https:") {
      return NextResponse.redirect(fallback);
    }
    if (await hasCustomerSession()) checkoutUrl.searchParams.set("sso", "silent");

    return NextResponse.redirect(checkoutUrl);
  } catch {
    return NextResponse.redirect(fallback);
  }
}
