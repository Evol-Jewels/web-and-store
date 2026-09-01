import "server-only";

import {
  getCollection,
  getCollections,
  getProduct,
  getProducts,
} from "@/api/catalog.client";

export function findProducts(first = 24, after?: string) {
  return getProducts(first, after);
}

export function findProductByHandle(handle: string) {
  return getProduct(handle);
}

export function findCollections(first = 24, after?: string) {
  return getCollections(first, after);
}

export function findCollectionByHandle(
  handle: string,
  first = 24,
  after?: string,
) {
  return getCollection(handle, first, after);
}
