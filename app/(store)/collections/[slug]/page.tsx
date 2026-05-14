import { CollectionPageClient } from "./CollectionPageClient";
import { getAllCollections, getCollectionProducts } from "@/lib/api/shopify";
import { getSubCollectionsForMajor } from "@/lib/utils/collectionGrouping";
import { getCollectionMetadata } from "@/lib/types/collectionMetadata";
import { logger } from "@/lib/utils/logger";
import type { ShopifyProduct, MajorCollectionType } from "@/lib/types";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CollectionPage({
  params: paramsPromise,
}: CollectionPageProps) {
  const { slug } = await paramsPromise;

  const allCollections = await getAllCollections();
  const majorType = (slug.charAt(0).toUpperCase() +
    slug.slice(1)) as MajorCollectionType;
  const subCollections = getSubCollectionsForMajor(majorType, allCollections);

  // Fetch only primary collection products for fast initial load
  // Subcollection products are loaded on-demand via server action
  let primaryProducts: ShopifyProduct[] = [];
  try {
    primaryProducts = await getCollectionProducts(slug);
  } catch (error) {
    logger.error(`Failed to fetch primary collection "${slug}"`, error);
  }

  const collectionData = getCollectionMetadata(slug);
  const subCollectionHandles = subCollections?.map((sc) => sc.handle) || [];

  return (
    <CollectionPageClient
      slug={slug}
      products={primaryProducts}
      collectionData={collectionData}
      subCollections={subCollections}
      subCollectionHandles={subCollectionHandles}
    />
  );
}
