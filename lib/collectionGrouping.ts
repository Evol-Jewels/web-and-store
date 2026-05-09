// Mapping of Shopify collections to major jewelry categories
export type MajorCollectionType = "Rings" | "Earrings" | "Necklaces" | "Pendants" | "Bracelets";

export interface MajorCollection {
  id: string;
  title: MajorCollectionType;
  description: string;
  handle: string;
}

// Keywords to match collection names to major categories
// Order matters: test more specific patterns (Earrings) before broader ones (Rings)
const COLLECTION_KEYWORDS_ORDERED: Array<[MajorCollectionType, RegExp]> = [
  ["Earrings", /earring|stud|dangle|hook|hoop|drop/i],
  ["Necklaces", /necklace/i],
  ["Pendants", /pendant|drop.?pendant/i],
  ["Bracelets", /bracelet|bangle|tennis/i],
  ["Rings", /ring|solitaire|eternity|halo|stackable|three.?stone|mangalsutra|infinity|engagement/i],
];

// Collections to exclude (irrelevant or system collections)
const EXCLUDED_COLLECTIONS_PATTERNS = [
  /smart.?products.?filter/i,
  /^shop$/i,
  /tryon|try.?on/i,
  /ready.?to.?ship/i,
  /made.?to.?order/i,
  /baguette.?rts|cushion.?rts|classic.?ready.?to.?ship/i,
];

/**
 * Determine the major collection type based on collection name
 */
export function getMajorCollectionType(collectionName: string): MajorCollectionType | null {
  // Check if collection should be excluded
  for (const pattern of EXCLUDED_COLLECTIONS_PATTERNS) {
    if (pattern.test(collectionName)) {
      return null;
    }
  }

  // Match against keywords in order (Earrings first to avoid "ring" substring matches)
  for (const [majorType, regex] of COLLECTION_KEYWORDS_ORDERED) {
    if (regex.test(collectionName)) {
      return majorType;
    }
  }

  return null;
}

/**
 * Group collections by major category
 */
export function groupCollectionsByType(
  collections: Array<{ id: string; title: string; handle: string; description: string }>,
): Record<MajorCollectionType, typeof collections> {
  const grouped: Record<MajorCollectionType, typeof collections> = {
    Rings: [],
    Earrings: [],
    Necklaces: [],
    Pendants: [],
    Bracelets: [],
  };

  for (const collection of collections) {
    const majorType = getMajorCollectionType(collection.title);
    if (majorType) {
      grouped[majorType].push(collection);
    }
  }

  return grouped;
}

/**
 * Get major collections with their sub-collections
 */
export function getMajorCollectionsWithSubcollections(
  collections: Array<{ id: string; title: string; handle: string; description: string }>,
): MajorCollection[] {
  const grouped = groupCollectionsByType(collections);

  // Log grouping results for debugging
  console.log("[Collection Grouping] Detailed Breakdown:");
  for (const [majorType, subcollections] of Object.entries(grouped)) {
    console.log(
      `  ${majorType}: ${subcollections.length} sub-collections`,
      subcollections.length > 0
        ? `(${subcollections.map((s) => s.title).join(", ")})`
        : "",
    );
  }

  const majorCollections: MajorCollection[] = [];

  for (const [majorType, subcollections] of Object.entries(grouped)) {
    if (subcollections.length > 0) {
      majorCollections.push({
        id: majorType.toLowerCase(),
        title: majorType as MajorCollectionType,
        description: `Discover Our Curated Collection Of Lab-Grown Diamond ${majorType}`,
        handle: majorType.toLowerCase(),
      });
    }
  }

  console.log(
    `[Collection Grouping] Total Major Collections: ${majorCollections.length}`,
  );
  return majorCollections;
}

/**
 * Get sub-collections for a major collection type
 */
export function getSubCollectionsForMajor(
  majorType: MajorCollectionType,
  collections: Array<{ id: string; title: string; handle: string; description: string }>,
): typeof collections {
  const grouped = groupCollectionsByType(collections);
  return grouped[majorType] || [];
}
