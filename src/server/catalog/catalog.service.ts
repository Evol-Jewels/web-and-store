import "server-only";

import {
  findFeaturedProducts,
  findProductByHandle,
} from "./catalog.repository";

export async function listFeaturedProducts() {
  return findFeaturedProducts();
}

export async function getProductDetails(handle: string) {
  return findProductByHandle(handle);
}
