import "server-only";

import type { Cart, CartNotice } from "./types";
import {
  CART_BUYER_IDENTITY_UPDATE,
  CART_CREATE,
  CART_DISCOUNT_CODES_UPDATE,
  CART_LINES_ADD,
  CART_LINES_REMOVE,
  CART_LINES_UPDATE,
  CART_QUERY,
} from "./queries";
import { ShopifyStorefrontError, storefrontRequest } from "../storefront/client";

type MutationPayload = {
  cart: Cart | null;
  userErrors: CartNotice[];
  warnings: CartNotice[];
};

type MutationResult<TKey extends string> = Record<TKey, MutationPayload>;

export function normalizeVariantId(id: string) {
  const value = id.trim();

  if (/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(value)) return value;
  if (/^\d+$/.test(value)) return `gid://shopify/ProductVariant/${value}`;

  throw new ShopifyStorefrontError("The selected product variant is invalid.");
}

function unwrapMutation(payload: MutationPayload) {
  if (payload.userErrors.length) {
    throw new ShopifyStorefrontError(
      payload.userErrors.map(({ message }) => message).join(" "),
    );
  }

  if (!payload.cart) {
    throw new ShopifyStorefrontError("Shopify did not return a shopping bag.");
  }

  return { cart: payload.cart, warnings: payload.warnings };
}

export async function getCart(cartId: string, buyerIp?: string | null) {
  const data = await storefrontRequest<{ cart: Cart | null }>({
    query: CART_QUERY,
    variables: { id: cartId },
    buyerIp,
  });
  return data.cart;
}

export async function createCart(
  merchandiseId: string,
  quantity: number,
  buyerIp?: string | null,
) {
  const data = await storefrontRequest<MutationResult<"cartCreate">>({
    query: CART_CREATE,
    variables: {
      input: {
        lines: [{ merchandiseId: normalizeVariantId(merchandiseId), quantity }],
      },
    },
    buyerIp,
  });
  return unwrapMutation(data.cartCreate);
}

export async function addCartLine(
  cartId: string,
  merchandiseId: string,
  quantity: number,
  buyerIp?: string | null,
) {
  const data = await storefrontRequest<MutationResult<"cartLinesAdd">>({
    query: CART_LINES_ADD,
    variables: {
      cartId,
      lines: [{ merchandiseId: normalizeVariantId(merchandiseId), quantity }],
    },
    buyerIp,
  });
  return unwrapMutation(data.cartLinesAdd);
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
  buyerIp?: string | null,
) {
  const data = await storefrontRequest<MutationResult<"cartLinesUpdate">>({
    query: CART_LINES_UPDATE,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
    buyerIp,
  });
  return unwrapMutation(data.cartLinesUpdate);
}

export async function removeCartLine(
  cartId: string,
  lineId: string,
  buyerIp?: string | null,
) {
  const data = await storefrontRequest<MutationResult<"cartLinesRemove">>({
    query: CART_LINES_REMOVE,
    variables: { cartId, lineIds: [lineId] },
    buyerIp,
  });
  return unwrapMutation(data.cartLinesRemove);
}

export async function updateCartDiscountCodes(
  cartId: string,
  discountCodes: string[],
  buyerIp?: string | null,
) {
  const data = await storefrontRequest<
    MutationResult<"cartDiscountCodesUpdate">
  >({
    query: CART_DISCOUNT_CODES_UPDATE,
    variables: { cartId, discountCodes },
    buyerIp,
  });
  return unwrapMutation(data.cartDiscountCodesUpdate);
}

export async function updateCartBuyerIdentity(
  cartId: string,
  customerAccessToken: string | null,
  buyerIp?: string | null,
) {
  const data = await storefrontRequest<
    MutationResult<"cartBuyerIdentityUpdate">
  >({
    query: CART_BUYER_IDENTITY_UPDATE,
    variables: {
      cartId,
      buyerIdentity: { customerAccessToken },
    },
    buyerIp,
  });
  return unwrapMutation(data.cartBuyerIdentityUpdate);
}
