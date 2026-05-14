/**
 * Collection metadata with titles, descriptions, and breadcrumbs
 */

export type CollectionDataKey = "shop" | "rings" | "earrings" | "necklaces" | "pendants" | "bracelets";

export interface CollectionDataItem {
  title: string;
  descriptor: string;
  breadcrumb: string;
}

export const COLLECTION_METADATA: Record<CollectionDataKey, CollectionDataItem> = {
  shop: {
    title: "Shop",
    descriptor: "Discover Our Curated Collection of Lab-Grown Diamond Jewellery",
    breadcrumb: "Home / Shop",
  },
  rings: {
    title: "Rings",
    descriptor: "Discover Our Curated Collection Of Lab-Grown Diamond Rings",
    breadcrumb: "Home / Shop / Rings",
  },
  earrings: {
    title: "Earrings",
    descriptor: "Discover Our Curated Collection Of Lab-Grown Diamond Earrings",
    breadcrumb: "Home / Shop / Earrings",
  },
  necklaces: {
    title: "Necklaces",
    descriptor: "Discover Our Curated Collection Of Lab-Grown Diamond Necklaces",
    breadcrumb: "Home / Shop / Necklaces",
  },
  pendants: {
    title: "Pendants",
    descriptor: "Discover Our Curated Collection Of Lab-Grown Diamond Pendants",
    breadcrumb: "Home / Shop / Pendants",
  },
  bracelets: {
    title: "Bracelets",
    descriptor: "Discover Our Curated Collection Of Lab-Grown Diamond Bracelets",
    breadcrumb: "Home / Shop / Bracelets",
  },
};

/**
 * Get collection metadata by slug
 */
export function getCollectionMetadata(slug: string): CollectionDataItem {
  return COLLECTION_METADATA[slug as CollectionDataKey] || COLLECTION_METADATA.shop;
}
