import "server-only";
import { cache } from "react";
import { CatalogApiError } from "@/api/catalog.client";

import type { CollectionCardData, CollectionDetail } from "@/types/collection";
import { productCategories } from "@/lib/catalog";

import {
  findCollectionByHandle,
  findCollections,
  findProducts,
  findProductByHandle,
} from "./catalog.repository";

const internalCollectionTitle = "Smart Products Filter Index - Do not delete";

function isPublicCollection(collection: CollectionCardData) {
  return (
    collection.handle !== "globofilter-best-selling-products-index" &&
    collection.title.trim() !== internalCollectionTitle
  );
}

export async function listFeaturedProducts() {
  return findProducts();
}

export async function getProductDetails(handle: string) {
  const [product, collections] = await Promise.all([
    findProductByHandle(handle),
    listOptionalCollections(),
  ]);
  const publicIds = new Set(collections.map((collection) => collection.id));

  return {
    ...product,
    collections: product.collections.filter((collection) =>
      publicIds.has(collection.id),
    ),
  };
}

export async function listFeaturedCollections(
  limit = 12,
): Promise<CollectionCardData[]> {
  try {
    const { collections } = await findCollections(limit);
    return collections.filter(isPublicCollection);
  } catch {
    return [];
  }
}

async function loadAllCollections(): Promise<CollectionCardData[]> {
  const collections: CollectionCardData[] = [];
  const seenCursors = new Set<string>();
  let after: string | undefined;

  do {
    const page = await findCollections(48, after);
    collections.push(...page.collections.filter(isPublicCollection));

    const nextCursor = page.pageInfo.hasNextPage
      ? page.pageInfo.endCursor ?? undefined
      : undefined;

    if (!nextCursor || seenCursors.has(nextCursor)) break;
    seenCursors.add(nextCursor);
    after = nextCursor;
  } while (after);

  return collections;
}

let pendingCollections: Promise<CollectionCardData[]> | undefined;

export const listAllCollections = cache(async (): Promise<CollectionCardData[]> => {
  const pending = pendingCollections ??= loadAllCollections();
  try {
    return await pending;
  } finally {
    if (pendingCollections === pending) pendingCollections = undefined;
  }
});

export async function listOptionalCollections(): Promise<CollectionCardData[]> {
  try {
    return await listAllCollections();
  } catch {
    return [];
  }
}

export async function listPublicCategories() {
  const collections = await listOptionalCollections();
  const handles = new Set(collections.map((collection) => collection.handle));
  return productCategories.filter((category) => handles.has(category.slug));
}

export async function getCollectionDetails(
  handle: string,
  first = 24,
  after?: string,
): Promise<CollectionDetail | null> {
  try {
    const collections = await listAllCollections();
    if (!collections.some((collection) => collection.handle === handle)) {
      return null;
    }

    const collection = await findCollectionByHandle(handle, first, after);
    return isPublicCollection(collection) ? collection : null;
  } catch (error) {
    if (error instanceof CatalogApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getSugarRushFeature() {
  const collection = await getCollectionDetails("sugar-rush-collection", 2).catch(() => null);

  if (!collection || collection.products.length < 2) return undefined;

  return {
    handle: collection.handle,
    title: collection.title,
    products: collection.products,
  };
}
