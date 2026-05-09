/**
 * Utility to extract dynamic filter options from product data
 */

interface ShopifyProduct {
  id: string;
  title: string;
  tags?: string[];
  variants?: Array<{
    price: string;
  }>;
}

// Normalize "For Whom" tags to user-friendly values
const FOR_WHOM_MAPPING: Record<string, string> = {
  "for_her": "For Her",
  "for_him": "For Him",
  "gender_for everyone": "For Everyone",
  "gender_for_everyone": "For Everyone",
  "mother": "Mother",
  "father": "Father",
  "wife": "Wife",
  "sister": "Sister",
  "brother": "Brother",
  "friend": "Friend",
  "daughter": "Daughter",
};

// Normalize Size tags based on category
const RING_SIZES = ["5", "6", "7", "8", "9", "10"];
const NECKLACE_LENGTHS = ['16"', '18"', '20"', '22"'];
const BRACELET_SIZES = ["Small", "Medium", "Large"];

interface FilterOptions {
  shape: string[];
  occasion: string[];
  forWhom: string[];
  size: string[];
  priceRange: Array<{ label: string; value: string }>;
  grossWeight: Array<{ label: string; value: string }>;
}

/**
 * Extract all unique shape values from product tags
 */
function extractShapes(products: ShopifyProduct[]): string[] {
  const shapes = new Set<string>();
  products.forEach((p) => {
    (p.tags || []).forEach((tag) => {
      const match = tag.match(/stone_shape_(.+)/i);
      if (match) {
        shapes.add(match[1]);
      }
    });
  });
  return Array.from(shapes).sort();
}

/**
 * Extract all unique occasion values from product tags
 */
function extractOccasions(products: ShopifyProduct[]): string[] {
  const occasions = new Set<string>();
  products.forEach((p) => {
    (p.tags || []).forEach((tag) => {
      const match = tag.match(/ocassion_(.+)/i);
      if (match) {
        occasions.add(match[1]);
      }
    });
  });
  return Array.from(occasions).sort();
}

/**
 * Extract all unique "For Whom" values from product tags
 */
function extractForWhom(products: ShopifyProduct[]): string[] {
  const forWhom = new Set<string>();
  products.forEach((p) => {
    (p.tags || []).forEach((tag) => {
      const tagLower = tag.toLowerCase();
      // Match Gender_* tags and direct for_* tags
      if (tagLower.startsWith("gender_")) {
        const value = tagLower.substring(7); // Remove "gender_" prefix
        const normalized = FOR_WHOM_MAPPING[`gender_${value}`] || FOR_WHOM_MAPPING[value];
        if (normalized) forWhom.add(normalized);
      } else if (tagLower.startsWith("for_")) {
        const value = tagLower.substring(4); // Remove "for_" prefix
        const normalized = FOR_WHOM_MAPPING[`for_${value}`] || FOR_WHOM_MAPPING[value];
        if (normalized) forWhom.add(normalized);
      } else {
        // Check for direct matches like "Mother", "Father", etc.
        const normalized = FOR_WHOM_MAPPING[tagLower];
        if (normalized) forWhom.add(normalized);
      }
    });
  });
  return Array.from(forWhom).sort();
}

/**
 * Extract category-specific sizes from product tags and variant titles
 */
function extractSizes(
  products: ShopifyProduct[],
  category?: string,
): string[] {
  const sizes = new Set<string>();

  products.forEach((p) => {
    // Extract from tags
    (p.tags || []).forEach((tag) => {
      const tagLower = tag.toLowerCase();
      if (tagLower.includes("size_")) {
        const match = tag.match(/size_(.+)/i);
        if (match) {
          const sizeValue = match[1];
          if (category === "rings" && RING_SIZES.includes(sizeValue)) {
            sizes.add(sizeValue);
          } else if (category === "necklaces" && NECKLACE_LENGTHS.includes(sizeValue)) {
            sizes.add(sizeValue);
          } else if (!category) {
            sizes.add(sizeValue);
          }
        }
      }
    });

    // Extract from variant titles (for ring sizes like "Size 5", "Size 7", etc.)
    (p.variants || []).forEach((variant) => {
      if (!variant.title) return;
      const variantLower = variant.title.toLowerCase();

      if (category === "rings" || !category) {
        // Match "Size X" patterns in variant titles
        const sizeMatch = variantLower.match(/size\s+(\d+(?:\.\d+)?)/);
        if (sizeMatch) {
          const sizeValue = sizeMatch[1];
          if (category === "rings" && RING_SIZES.some(rs => rs.toString() === sizeValue)) {
            sizes.add(sizeValue);
          } else if (!category) {
            sizes.add(sizeValue);
          }
        }
      }

      if (category === "necklaces" || !category) {
        // Match chain length patterns like "18"", "20 inch", etc.
        const lengthMatch = variantLower.match(/(\d+(?:\.\d+)?)\s*(?:"|inch|")/);
        if (lengthMatch) {
          const value = lengthMatch[1];
          const withQuote = `${value}"`;
          if (NECKLACE_LENGTHS.includes(withQuote)) {
            sizes.add(withQuote);
          }
        }
      }
    });
  });

  return Array.from(sizes).sort((a, b) => {
    // Sort numerically if both are numbers
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    // Otherwise sort alphabetically
    return a.localeCompare(b);
  });
}

/**
 * Extract price range from product variants
 */
function extractPriceRange(
  products: ShopifyProduct[],
): Array<{ label: string; value: string }> {
  const prices = products
    .flatMap((p) => p.variants || [])
    .map((v) => {
      const price = parseInt(String(v.price).replace(/[^\d]/g, ""));
      return isNaN(price) ? 0 : price;
    })
    .filter((p) => p > 0)
    .sort((a, b) => a - b);

  if (prices.length === 0) {
    // Return default ranges if no prices found
    return [
      { label: "₹0 - ₹50K", value: "0-50000" },
      { label: "₹50K - ₹100K", value: "50000-100000" },
      { label: "₹100K - ₹200K", value: "100000-200000" },
      { label: "₹200K+", value: "200000-9999999" },
    ];
  }

  const minPrice = prices[0];
  const maxPrice = prices[prices.length - 1];

  // Create 4 price buckets based on actual data
  const ranges: Array<{ label: string; value: string }> = [];
  const quarter = Math.floor((maxPrice - minPrice) / 4);

  if (quarter === 0) {
    // All products have the same price
    ranges.push({
      label: `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`,
      value: `${minPrice}-${maxPrice}`,
    });
  } else {
    ranges.push({
      label: `₹0 - ₹${(minPrice + quarter).toLocaleString()}`,
      value: `0-${minPrice + quarter}`,
    });
    ranges.push({
      label: `₹${(minPrice + quarter).toLocaleString()} - ₹${(minPrice + quarter * 2).toLocaleString()}`,
      value: `${minPrice + quarter}-${minPrice + quarter * 2}`,
    });
    ranges.push({
      label: `₹${(minPrice + quarter * 2).toLocaleString()} - ₹${(minPrice + quarter * 3).toLocaleString()}`,
      value: `${minPrice + quarter * 2}-${minPrice + quarter * 3}`,
    });
    ranges.push({
      label: `₹${(minPrice + quarter * 3).toLocaleString()}+`,
      value: `${minPrice + quarter * 3}-9999999`,
    });
  }

  return ranges;
}

/**
 * Extract gross weight options from product tags
 */
function extractGrossWeightOptions(
  products: ShopifyProduct[],
): Array<{ label: string; value: string }> {
  const weights = new Set<string>();

  products.forEach((p) => {
    (p.tags || []).forEach((tag) => {
      const match = tag.match(/gross_total_weight_range_(.+)/i);
      if (match) {
        const weightStr = match[1];
        weights.add(weightStr);
      }
    });
  });

  if (weights.size === 0) {
    // Return default options if no weights found
    return [
      { label: "1g-3g", value: "1g-3g" },
      { label: "3g-5g", value: "3g-5g" },
      { label: "5g-7g", value: "5g-7g" },
      { label: "7g-10g", value: "7g-10g" },
      { label: "10g-20g", value: "10g-20g" },
      { label: "10g & more", value: "10g & more" },
    ];
  }

  // Convert to array, sort by first number in weight string
  const sortedWeights = Array.from(weights).sort((a, b) => {
    const aNum = parseInt(a.match(/\d+/)?.[0] || "0");
    const bNum = parseInt(b.match(/\d+/)?.[0] || "0");
    return aNum - bNum;
  });

  return sortedWeights.map((weight) => ({
    label: weight.replace(/_/g, " "),
    value: weight,
  }));
}

/**
 * Extract all filter options from products
 */
export function extractFilterOptions(
  products: ShopifyProduct[],
  category?: string,
): FilterOptions {
  return {
    shape: extractShapes(products),
    occasion: extractOccasions(products),
    forWhom: extractForWhom(products),
    size: extractSizes(products, category),
    priceRange: extractPriceRange(products),
    grossWeight: extractGrossWeightOptions(products),
  };
}
