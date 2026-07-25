import "server-only";

import { getProduct, getProducts } from "@/api/catalog.client";

export function findFeaturedProducts() {
  return getProducts();
}

export function findProductByHandle(handle: string) {
  return getProduct(handle);
}
