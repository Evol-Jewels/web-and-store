import { NextResponse, type NextRequest } from "next/server";

import {
  createCustomerAuthorizationUrl,
  normalizeCustomerReturnTo,
  refreshCustomerSession,
} from "@/lib/shopify/customer-account/auth";
import { CustomerAccountConfigurationError } from "@/lib/shopify/customer-account/config";
import {
  clearCustomerSession,
  readCustomerSession,
  writeCustomerSession,
} from "@/lib/shopify/customer-account/session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const returnTo = normalizeCustomerReturnTo(
      request.nextUrl.searchParams.get("returnTo"),
    );
    const session = await readCustomerSession();
    if (session?.accessTokenExpiresAt && session.accessTokenExpiresAt > Date.now() + 60_000) {
      return NextResponse.redirect(new URL(returnTo, request.url));
    }
    if (session?.refreshToken) {
      try {
        const refreshed = await refreshCustomerSession(session);
        if (refreshed) {
          await writeCustomerSession(refreshed);
          return NextResponse.redirect(new URL(returnTo, request.url));
        }
      } catch {
        await clearCustomerSession();
      }
    }
    const authorizationUrl = await createCustomerAuthorizationUrl(
      returnTo,
    );
    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    if (error instanceof CustomerAccountConfigurationError) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Customer sign-in is temporarily unavailable.", { status: 502 });
  }
}
