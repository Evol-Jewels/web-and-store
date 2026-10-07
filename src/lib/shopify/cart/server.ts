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
import { getPublicProduct } from "@/server/catalog/product-visibility";

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

async function publicCart(cart: Cart, buyerIp?: string | null): Promise<Cart> {
  const checked = await Promise.all(cart.lines.nodes.map(async (line) => ({
    line,
    product: await getPublicProduct(line.merchandise.product.handle),
  })));
  const hiddenLineIds = checked
    .filter(({ product }) => !product)
    .map(({ line }) => line.id);
  if (!hiddenLineIds.length) return cart;

  const data = await storefrontRequest<MutationResult<"cartLinesRemove">>({
    query: CART_LINES_REMOVE,
    variables: { cartId: cart.id, lineIds: hiddenLineIds },
    buyerIp,
  });
  return unwrapMutation(data.cartLinesRemove).cart;
}

async function publicMutation(payload: MutationPayload, buyerIp?: string | null) {
  const result = unwrapMutation(payload);
  return { ...result, cart: await publicCart(result.cart, buyerIp) };
}

export async function getCart(cartId: string, buyerIp?: string | null) {
  const data = await storefrontRequest<{ cart: Cart | null }>({
    query: CART_QUERY,
    variables: { id: cartId },
    buyerIp,
  });
  return data.cart ? publicCart(data.cart, buyerIp) : null;
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
  return publicMutation(data.cartCreate, buyerIp);
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
  return publicMutation(data.cartLinesAdd, buyerIp);
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
  return publicMutation(data.cartLinesUpdate, buyerIp);
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
  return publicMutation(data.cartLinesRemove, buyerIp);
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
  return publicMutation(data.cartDiscountCodesUpdate, buyerIp);
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
  return publicMutation(data.cartBuyerIdentityUpdate, buyerIp);
}
