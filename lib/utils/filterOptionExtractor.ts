import type { ShopifyProduct, FilterOptions } from "../types";
import { FOR_WHOM_MAPPING } from "../constants";
import { RING_SIZES, NECKLACE_LENGTHS, BRACELET_SIZES, METAL_COLORS } from "../types";

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
  if (
    category === "earrings" ||
    category === "pendants" ||
    category === "necklaces"
  ) {
    return [];
  }

  const sizes = new Set<string>();
  const categoryLower = category?.toLowerCase();

  products.forEach((p) => {
    (p.tags || []).forEach((tag) => {
      const sizeMatch = tag.match(/(?:size|ring_size|chain_length|bracelet_.*?size)_(.+)/i);
      if (!sizeMatch) return;

      let sizeValue = sizeMatch[1];
      const isWeightOrRegional = sizeValue.match(/gram|anna|g\b|kt|carat|ct/i);
      if (isWeightOrRegional) return;

      if (categoryLower === "rings" || !category || categoryLower === "shop") {
        const numMatch = sizeValue.match(/^(\d+(?:\.\d+)?)/);
        if (numMatch) {
          const num = numMatch[1];
          if (RING_SIZES.includes(num)) {
            sizes.add(num);
          }
        }
      }

      if (categoryLower === "necklaces" || !category || categoryLower === "shop") {
        const numMatch = sizeValue.match(/^(\d+)/);
        if (numMatch) {
          const num = numMatch[1];
          const normalized = `${num}"`;
          if (NECKLACE_LENGTHS.includes(normalized)) {
            sizes.add(normalized);
          }
        }
      }

      if (categoryLower === "bracelets" || !category || categoryLower === "shop") {
        if (/^\d+(\.\d+)?$/.test(sizeValue)) {
          const normalized = sizeValue.includes('.') ? sizeValue : `${sizeValue}.0`;
          sizes.add(normalized);
        } else {
          const normalized = BRACELET_SIZES.find(
            (bs) => bs.toLowerCase() === sizeValue.toLowerCase()
          );
          if (normalized) {
            sizes.add(normalized);
          }
        }
      }
    });

    (p.variants || []).forEach((variant) => {
      if (!variant.title) return;
      const variantTitle = variant.title;
      const variantLower = variantTitle.toLowerCase();

      if (categoryLower === "rings" || (!category || categoryLower === "shop")) {
        const ringPatterns = [
          /\/\s*(\d+)\s*$/,
          /\/\s*(\d+)\s*,/,
          /(?:ring\s+)?size[:\s-]*(\d+)/i,
          /\b(\d+)\s*(?:us\s+)?(?:ring|size)\b/i,
        ];
        for (const pattern of ringPatterns) {
          const match = variantLower.match(pattern);
          if (match) {
            const sizeValue = match[1];
            if (RING_SIZES.includes(sizeValue)) {
              sizes.add(sizeValue);
              break;
            }
          }
        }
      }

      if (categoryLower === "necklaces" || (!category || categoryLower === "shop")) {
        const necklacePatterns = [
          /\/\s*(\d+)\s*["|"|"]?\s*$/,
          /\/\s*(\d+)\s*["|"|"]?\s*(?:inch|$)/i,
          /(?:chain\s+)?(?:length\s+)?(\d+)\s*(?:inch|"|"|inches)?/i,
          /(\d+)\s*(?:inch|"|"|inches)\s*(?:chain|necklace)?/i,
          /^(\d+)\s/,
        ];
        for (const pattern of necklacePatterns) {
          const match = variantLower.match(pattern);
          if (match) {
            const value = match[1];
            const withQuote = `${value}"`;
            if (NECKLACE_LENGTHS.includes(withQuote)) {
              sizes.add(withQuote);
              break;
            }
          }
        }
      }

      if (categoryLower === "bracelets" || (!category || categoryLower === "shop")) {
        const parts = variantTitle.split("/");
        if (parts.length > 1) {
          const lastPart = parts[parts.length - 1]?.trim();
          const isMetalColor = lastPart && METAL_COLORS.some(color => lastPart.toLowerCase().includes(color));

          if (lastPart && lastPart.length > 0 && !isMetalColor) {
            let sizeValue = lastPart;
            const lowerValue = sizeValue.toLowerCase();
            if (lowerValue === 's') sizeValue = 'Small';
            else if (lowerValue === 'm') sizeValue = 'Medium';
            else if (lowerValue === 'l') sizeValue = 'Large';
            else if (BRACELET_SIZES.some(bs => bs.toLowerCase() === lowerValue)) {
              sizeValue = sizeValue.charAt(0).toUpperCase() + sizeValue.slice(1);
            }

            const numericMatch = sizeValue.match(/^(\d+)(?:\.\d+)?/);
            if (numericMatch && !sizeValue.includes("anna") && !sizeValue.toLowerCase().includes("small") && !sizeValue.toLowerCase().includes("medium") && !sizeValue.toLowerCase().includes("large")) {
              const normalized = sizeValue.includes('.') ? sizeValue.split(/\s/)[0] : `${numericMatch[1]}.0`;
              sizes.add(normalized);
            } else if (BRACELET_SIZES.includes(sizeValue)) {
              sizes.add(sizeValue);
            } else {
              sizes.add(sizeValue);
            }
          }
        }
      }
    });
  });

  const finalSizes = Array.from(sizes).sort((a, b) => {
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a.localeCompare(b);
  });

  return finalSizes;
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
 * Get default sizes for a category if extraction fails
 */
function getDefaultSizesForCategory(category?: string): string[] {
  const categoryLower = category?.toLowerCase();

  if (categoryLower === "rings") return RING_SIZES;
  // Necklaces don't have size filters - no defaults needed
  if (categoryLower === "necklaces") return [];
  // Bracelets use numeric sizes from actual data, not text defaults
  if (categoryLower === "bracelets") return [];

  // For shop and other categories, don't show default sizes
  return [];
}

/**
 * Extract all filter options from products
 */
export function extractFilterOptions(
  products: ShopifyProduct[],
  category?: string,
): FilterOptions {
  const sizes = extractSizes(products, category);

  // If no sizes found and category is specific, use defaults as fallback
  // This ensures the filter UI shows even if data extraction fails
  const finalSizes = sizes.length === 0 && category && category !== "shop"
    ? getDefaultSizesForCategory(category)
    : sizes;

  return {
    shape: extractShapes(products),
    occasion: extractOccasions(products),
    forWhom: extractForWhom(products),
    size: finalSizes,
    priceRange: extractPriceRange(products),
    grossWeight: extractGrossWeightOptions(products),
  };
}
