import "server-only";

import type { CollectionCardData, CollectionDetail } from "@/types/collection";

import {
  findCollectionByHandle,
  findCollections,
  findProducts,
  findProductByHandle,
} from "./catalog.repository";

export async function listFeaturedProducts() {
  return findProducts();
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

export async function listAllCollections(): Promise<CollectionCardData[]> {
  const collections: CollectionCardData[] = [];
  const seenCursors = new Set<string>();
  let after: string | undefined;

  do {
    const page = await findCollections(48, after);
    collections.push(...page.collections);

    const nextCursor = page.pageInfo.hasNextPage
      ? page.pageInfo.endCursor ?? undefined
      : undefined;

    if (!nextCursor || seenCursors.has(nextCursor)) break;
    seenCursors.add(nextCursor);
    after = nextCursor;
  } while (after);

  return collections;
}

export async function getCollectionDetails(
  handle: string,
  first = 24,
  after?: string,
): Promise<CollectionDetail | null> {
  try {
    return await findCollectionByHandle(handle, first, after);
  } catch {
    return null;
  }
}
