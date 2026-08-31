import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { CART_COOKIE } from "@/lib/shopify/cart/cookie";
import { updateCartBuyerIdentity } from "@/lib/shopify/cart/server";
import {
  CustomerAccountConfigurationError,
  getLogoutReturnUrl,
} from "@/lib/shopify/customer-account/config";
import { getOpenIdConfiguration } from "@/lib/shopify/customer-account/discovery";
import {
  clearAuthorizationTransaction,
  clearCustomerSession,
  readCustomerSession,
} from "@/lib/shopify/customer-account/session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await readCustomerSession();
    const cartId = (await cookies()).get(CART_COOKIE)?.value;

    if (cartId) {
      const buyerIp = request.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        ?.trim();
      await updateCartBuyerIdentity(cartId, null, buyerIp).catch(() => undefined);
    }

    await clearCustomerSession();
    await clearAuthorizationTransaction();

    if (!session?.idToken) {
      return NextResponse.redirect(getLogoutReturnUrl());
    }

    const { end_session_endpoint } = await getOpenIdConfiguration();
    const logoutUrl = new URL(end_session_endpoint);
    logoutUrl.searchParams.set("id_token_hint", session.idToken);
    logoutUrl.searchParams.set("post_logout_redirect_uri", getLogoutReturnUrl());
    return NextResponse.redirect(logoutUrl);
  } catch (error) {
    if (error instanceof CustomerAccountConfigurationError) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Customer logout is temporarily unavailable.", {
      status: 502,
    });
  }
}

export const POST = GET;
