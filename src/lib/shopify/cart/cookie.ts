import "server-only";

export const CART_COOKIE = "evol_shopify_cart";

export const cartCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 14,
  priority: "high",
} as const;
