import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { CART_COOKIE } from "@/lib/shopify/cart/cookie";
import { updateCartBuyerIdentity } from "@/lib/shopify/cart/server";
import { exchangeCustomerAuthorizationCode } from "@/lib/shopify/customer-account/auth";
import { CustomerAccountConfigurationError } from "@/lib/shopify/customer-account/config";
import { secureEqual } from "@/lib/shopify/customer-account/crypto";
import {
  clearAuthorizationTransaction,
  readAuthorizationTransaction,
} from "@/lib/shopify/customer-account/session";

export const runtime = "nodejs";

function failedRedirect(request: NextRequest) {
  return NextResponse.redirect(new URL("/?accountAuth=failed", request.url));
}

export async function GET(request: NextRequest) {
  try {
    const transaction = await readAuthorizationTransaction();
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const oauthError = request.nextUrl.searchParams.get("error");

    if (
      oauthError ||
      !transaction ||
      !code ||
      !state ||
      !secureEqual(transaction.state, state)
    ) {
      await clearAuthorizationTransaction();
      return failedRedirect(request);
    }

    const session = await exchangeCustomerAuthorizationCode(
      code,
      transaction.codeVerifier,
      transaction.nonce,
    );

    const cartId = (await cookies()).get(CART_COOKIE)?.value;
    if (cartId) {
      const buyerIp = request.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        ?.trim();
      await updateCartBuyerIdentity(cartId, session.accessToken, buyerIp).catch(
        () => undefined,
      );
    }

    await clearAuthorizationTransaction();
    return NextResponse.redirect(new URL(transaction.returnTo, request.url));
  } catch (error) {
    await clearAuthorizationTransaction();
    if (error instanceof CustomerAccountConfigurationError) {
      return new Response(error.message, { status: 500 });
    }
    return failedRedirect(request);
  }
}
