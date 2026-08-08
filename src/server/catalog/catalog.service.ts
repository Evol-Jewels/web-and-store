import "server-only";

import type { CollectionCardData, CollectionDetail } from "@/types/collection";
import type { ProductCardData } from "@/types/product";

import {
  findCollectionByHandle,
  findCollections,
  findProducts,
  findProductByHandle,
} from "./catalog.repository";

export async function listFeaturedProducts() {
  return findProducts();
}

export async function listAllProducts() {
  const products: ProductCardData[] = [];
  const seenCursors = new Set<string>();
  let after: string | undefined;

  do {
    const page = await findProducts(48, after);
    products.push(...page.products);

    const nextCursor = page.pageInfo.hasNextPage
      ? page.pageInfo.endCursor ?? undefined
      : undefined;

    if (!nextCursor || seenCursors.has(nextCursor)) break;
    seenCursors.add(nextCursor);
    after = nextCursor;
  } while (after);

  return products;
}

export async function getProductDetails(handle: string) {
  return findProductByHandle(handle);
}

export async function listFeaturedCollections(
  limit = 12,
): Promise<CollectionCardData[]> {
  try {
    const { collections } = await findCollections(limit);
    return collections;
  } catch {
    return [];
  }
}

export async function getCollectionDetails(
  handle: string,
): Promise<CollectionDetail | null> {
  try {
    return await findCollectionByHandle(handle);
  } catch {
    return null;
  }
}
