/**
 * Shared collection filtering utilities
 */

import type { ShopifyProduct } from "@/lib/types";

/**
 * Filter products by collection type
 * Ensures rings collection only shows rings, bracelets only shows bracelets, etc.
 */
export function filterProductsByType(
  products: ShopifyProduct[],
  slug: string
): ShopifyProduct[] {
  const slugLower = slug.toLowerCase();

  return products.filter((p) => {
    const productType = (p.productType || "").toLowerCase();

    if (slugLower === "rings" || slugLower === "ring") {
      return productType.includes("ring");
    } else if (slugLower === "necklaces" || slugLower === "necklace") {
      return productType.includes("necklace");
    } else if (slugLower === "bracelets" || slugLower === "bracelet") {
      return productType.includes("bracelet");
    } else if (slugLower === "earrings" || slugLower === "earring") {
      return productType.includes("earring");
    } else if (slugLower === "pendants" || slugLower === "pendant") {
      return productType.includes("pendant");
    }

    return true;
  });
}
