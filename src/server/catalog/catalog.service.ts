import "server-only";

import { findFeaturedProducts } from "./catalog.repository";

export async function listFeaturedProducts() {
  return findFeaturedProducts();
}
