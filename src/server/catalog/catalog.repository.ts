import "server-only";

import { getProduct, getProducts } from "@/api/catalog.client";

export function findProducts(first = 24, after?: string) {
  return getProducts(first, after);
}

export function findProductByHandle(handle: string) {
  return getProduct(handle);
}
