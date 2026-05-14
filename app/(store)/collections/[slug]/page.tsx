import { CollectionPageClient } from "./CollectionPageClient";
import { getAllCollections, getCollectionProducts } from "@/lib/api/shopify";
import { getSubCollectionsForMajor } from "@/lib/utils/collectionGrouping";
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

  let products: ShopifyProduct[] = [];
  let primaryProducts: ShopifyProduct[] = [];

  // Fetch products from primary collection
  try {
    primaryProducts = await getCollectionProducts(slug);
    products = primaryProducts;
  } catch (error) {
    logger.error(`Failed to Fetch from Primary Collection "${slug}"`, error);
    primaryProducts = [];
    products = [];
  }

  // Fetch products from sub-collections
  if (subCollections && subCollections.length > 0) {
    try {
      const subCollectionProducts = await Promise.all(
        subCollections.map(async (subCollection) => {
          try {
            const subProducts = await getCollectionProducts(
              subCollection.handle,
            );
            return subProducts.map((p) => ({
              ...p,
              __subCollectionHandle: subCollection.handle,
              __subCollectionTitle: subCollection.title,
            }));
          } catch (error) {
            logger.error(
              `Failed to Fetch Sub-Collection "${subCollection.handle}"`,
              error,
            );
            return [];
          }
        }),
      );
      const allSubProducts = subCollectionProducts.flat();
      products = [...primaryProducts, ...allSubProducts];
    } catch (error) {
      logger.error("Failed to Fetch Sub-Collections", error);
      products = primaryProducts;
    }
  }

  const collectionData: Record<
    string,
    { title: string; descriptor: string; breadcrumb: string }
  > = {
    shop: {
      title: "Shop",
      descriptor:
        "Discover Our Curated Collection of Lab-Grown Diamond Jewellery",
      breadcrumb: "Home / Shop",
    },
    rings: {
      title: "Rings",
      descriptor: "Discover Our Curated Collection Of Lab-Grown Diamond Rings",
      breadcrumb: "Home / Shop / Rings",
    },
    earrings: {
      title: "Earrings",
      descriptor:
        "Discover Our Curated Collection Of Lab-Grown Diamond Earrings",
      breadcrumb: "Home / Shop / Earrings",
    },
    necklaces: {
      title: "Necklaces",
      descriptor:
        "Discover Our Curated Collection Of Lab-Grown Diamond Necklaces",
      breadcrumb: "Home / Shop / Necklaces",
    },
    pendants: {
      title: "Pendants",
      descriptor:
        "Discover Our Curated Collection Of Lab-Grown Diamond Pendants",
      breadcrumb: "Home / Shop / Pendants",
    },
    bracelets: {
      title: "Bracelets",
      descriptor:
        "Discover Our Curated Collection Of Lab-Grown Diamond Bracelets",
      breadcrumb: "Home / Shop / Bracelets",
    },
  };

  const currentCollection = collectionData[slug] || collectionData["shop"];

  return (
    <CollectionPageClient
      slug={slug}
      products={products}
      collectionData={currentCollection}
      subCollections={subCollections}
    />
  );
}
