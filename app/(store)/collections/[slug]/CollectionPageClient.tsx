"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFilterStore } from "@/lib/stores/filterStore";
import { extractFilterOptions } from "@/lib/utils/filterOptionExtractor";
import { filterProductsByType } from "@/lib/utils/collectionFilters";
import { METAL_COLORS } from "@/lib/types";
import { CollectionHeroBanner } from "@/components/store/product-listing/CollectionHeroBanner";
import { FilterBar } from "@/components/store/product-listing/FilterBar";
import { SearchBar } from "@/components/store/product-listing/SearchBar";
import { SortBar } from "@/components/store/product-listing/SortBar";
import { ShopifyProductGrid } from "@/components/store/product-listing/ShopifyProductGrid";
import { EmptyState } from "@/components/store/product-listing/EmptyState";
import { InfiniteScroll } from "@/components/store/product-listing/InfiniteScroll";
import type { ShopifyProduct, CollectionPageClientProps } from "@/lib/types";

const ITEMS_PER_PAGE = 12;

export function CollectionPageClient({
  slug,
  products,
  collectionData,
  subCollections,
}: CollectionPageClientProps) {
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const { filters } = useFilterStore();
  const searchParams = useSearchParams();

  const filterOptions = useMemo(() => {
    const collectionProducts = filterProductsByType(products, slug);
    return extractFilterOptions(collectionProducts, slug);
  }, [products, slug]);

  // Reset display count when filters or search changes
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [filters, searchQuery]);

  const filteredProducts = useMemo(() => {
    const uniqueProducts = Array.from(
      new Map(products.map((p) => [p.id, p])).values()
    );
    let filtered = filterProductsByType([...uniqueProducts], slug);

    // Filter by search query (if any)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query),
      );
    }

    // Filter by sub-collection (if any are selected)
    if (filters.categories.length > 0) {
      // User selected specific sub-categories - show only those
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.__subCollectionHandle || ""),
      );
    } else {
      // If no category is selected, prefer showing primary collection products
      // Primary products don't have __subCollectionHandle set
      const hasPrimaryProducts = filtered.some((p) => !p.__subCollectionHandle);
      if (hasPrimaryProducts) {
        // Show only primary collection products
        filtered = filtered.filter((p) => !p.__subCollectionHandle);
      }
      // If no primary products exist, show all sub-collection products
    }

    // Filter by shape (if any shapes are selected)
    if (filters.shape.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        return filters.shape.some((shape) => {
          // Match tags like "stone_shape_Round", "stone_shape_Oval", etc.
          return tags.some((tag: string) =>
            tag.toLowerCase().includes(`stone_shape_${shape.toLowerCase()}`),
          );
        });
      });
    }

    // Filter by price range (if set)
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter((p) => {
        try {
          const priceStr = p.variants?.[0]?.price;
          if (!priceStr) return false;
          const price = parseInt(String(priceStr).replace(/[^\d]/g, ""));
          if (isNaN(price)) return false;
          return price >= min && price <= max;
        } catch (error) {
          return false;
        }
      });
    }

    // Filter by occasion (if any are selected)
    if (filters.occasion.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        return filters.occasion.some((occ) => {
          const occLower = occ.toLowerCase();
          // Match tags like "Ocassion_Engagement", "Ocassion_Wedding", etc. (note: Shopify uses "Ocassion" spelling)
          return tags.some((tag: string) => {
            const tagLower = tag.toLowerCase();
            // Check for Ocassion_* tags (Shopify's spelling)
            if (tagLower.startsWith("ocassion_")) {
              const value = tagLower.substring(9);
              return (
                value === occLower || value.includes(occLower.replace(" ", ""))
              );
            }
            // Also check for collection tags like collection_evol_Dailywear, newcollection_dailywear
            if (
              tagLower.includes("collection_") ||
              tagLower.includes("newcollection_")
            ) {
              return tagLower.includes(occLower.replace(" ", ""));
            }
            return false;
          });
        });
      });
    }

    // Filter by forWhom (if any are selected)
    if (filters.forWhom.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        return filters.forWhom.some((whom) => {
          const whomLower = whom.toLowerCase();
          return tags.some((tag: string) => {
            const tagLower = tag.toLowerCase();
            // Match Gender_* tags and direct for_* tags
            if (tagLower.startsWith("gender_")) {
              const value = tagLower.substring(7);
              return (
                value.includes(whomLower) ||
                value.includes(whomLower.replace(" ", ""))
              );
            } else if (tagLower.startsWith("for_")) {
              const value = tagLower.substring(4);
              return (
                value.includes(whomLower) ||
                value.includes(whomLower.replace(" ", ""))
              );
            } else {
              // Direct tag match (Mother, Father, etc.)
              return (
                tagLower === whomLower ||
                tagLower === whomLower.replace(" ", "")
              );
            }
          });
        });
      });
    }

    if (filters.size.length > 0) {
      const selectedSizes = filters.size;
      const slugLower = slug.toLowerCase();

      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        const variants = p.variants || [];

        // Determine if this product is a bracelet or ring based on its tags and handle
        const productTags = tags.map((t: string) => t.toLowerCase());
        const isBraceletProduct = productTags.some((tag) =>
          tag.includes("bracelet") || tag.includes("subcollection_bracelets")
        );
        const isRingProduct = productTags.some((tag) =>
          tag.includes("ring") || tag.includes("subcollection_rings")
        );
        const isNecklaceProduct = productTags.some((tag) =>
          tag.includes("necklace") || tag.includes("subcollection_necklaces")
        );
        const isEarringProduct = productTags.some((tag) =>
          tag.includes("earring") || tag.includes("subcollection_earrings")
        );
        const isPendantProduct = productTags.some((tag) =>
          tag.includes("pendant") || tag.includes("subcollection_pendants")
        );

        // Skip filtering for products that don't have size variants
        if (isNecklaceProduct || isEarringProduct || isPendantProduct) {
          return false;
        }

        const tagMatch = tags.some((tag: string) => {
          const tagLower = tag.toLowerCase();
          if (!tagLower.includes("size")) return false;

          const match = tagLower.match(/(?:ring_)?size_(.+)/);
          if (!match) return false;

          const sizeValue = match[1];
          return selectedSizes.some((selectedSize) =>
            sizeValue.toLowerCase().includes(selectedSize.toLowerCase()) ||
            sizeValue.toLowerCase() === selectedSize.toLowerCase()
          );
        });

        if (tagMatch) return true;

        const variantMatch = variants.some((variant) => {
          if (!variant.title) return false;

          const title = variant.title;
          const titleLower = title.toLowerCase();

          // For ring products or when on rings page
          if (isRingProduct || slugLower === "rings" || slugLower === "ring") {
            const ringPatterns = [
              /\/\s*(\d+)\s*$/,
              /\/\s*(\d+)\s*,/,
              /(?:ring\s+)?size[:\s-]*(\d+)/i,
              /\b(\d+)\s*(?:us\s+)?(?:ring|size)\b/i,
            ];

            for (const pattern of ringPatterns) {
              const match = titleLower.match(pattern);
              if (match) {
                const sizeValue = match[1];
                if (selectedSizes.includes(sizeValue)) {
                  return true;
                }
              }
            }
            return false;
          }

          // For bracelet products or when on bracelets page
          if (isBraceletProduct || slugLower.includes("bracelet")) {
            const parts = title.split("/");
            if (parts.length < 2) return false;

            let extractedSize = parts[parts.length - 1]?.trim();
            if (!extractedSize) return false;

            if (METAL_COLORS.some(color => extractedSize.toLowerCase().includes(color))) {
              return false;
            }

            const numMatch = extractedSize.match(/^(\d+)(?:\.\d+)?/);
            if (numMatch && !extractedSize.includes("anna")) {
              extractedSize = extractedSize.includes('.') ? extractedSize.split(/\s/)[0] : `${numMatch[1]}.0`;
            }

            const matched = selectedSizes.some(s => s.toLowerCase() === extractedSize.toLowerCase());
            return matched;
          }

          return false;
        });

        return variantMatch;
      });
    }

    // Filter by gross weight (if any are selected)
    if (filters.grossWeight.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        // Match tags like "Gross_Total_Weight_Range_1g-3g", "Gross_Total_Weight_Range_10g & more"
        return tags.some((tag: string) => {
          const tagLower = tag.toLowerCase();
          if (tagLower.startsWith("gross_total_weight_range_")) {
            const weightValue = tag.substring(25); // Remove "Gross_Total_Weight_Range_" prefix
            // Check if this weight value matches any selected weight
            return filters.grossWeight.some((selected) => {
              return (
                weightValue.toLowerCase() === selected.toLowerCase() ||
                weightValue.toLowerCase().replace(/_/g, " ") ===
                  selected.toLowerCase()
              );
            });
          }
          return false;
        });
      });
    }

    return filtered;
  }, [filters, products, searchQuery, subCollections]);

  // Sort products based on selected sort option
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];

    switch (filters.currentSort) {
      case "featured":
        // Show products with "bestseller" or "tag_bestseller" tag first
        sorted.sort((a, b) => {
          const aHasBestseller = (a.tags || []).some((tag: string) => {
            const tagLower = tag.toLowerCase();
            return tagLower.includes("bestseller");
          });
          const bHasBestseller = (b.tags || []).some((tag: string) => {
            const tagLower = tag.toLowerCase();
            return tagLower.includes("bestseller");
          });
          if (aHasBestseller === bHasBestseller) return 0;
          return aHasBestseller ? -1 : 1;
        });
        break;

      case "newest":
        // Products are already ordered by creation time from API (newest first)
        // No additional sorting needed
        break;

      case "price-low-to-high":
        sorted.sort((a, b) => {
          const aPriceStr = a.variants?.[0]?.price;
          const bPriceStr = b.variants?.[0]?.price;
          const aPrice = aPriceStr
            ? parseInt(String(aPriceStr).replace(/[^\d]/g, ""))
            : 0;
          const bPrice = bPriceStr
            ? parseInt(String(bPriceStr).replace(/[^\d]/g, ""))
            : 0;
          return (isNaN(aPrice) ? 0 : aPrice) - (isNaN(bPrice) ? 0 : bPrice);
        });
        break;

      case "price-high-to-low":
        sorted.sort((a, b) => {
          const aPriceStr = a.variants?.[0]?.price;
          const bPriceStr = b.variants?.[0]?.price;
          const aPrice = aPriceStr
            ? parseInt(String(aPriceStr).replace(/[^\d]/g, ""))
            : 0;
          const bPrice = bPriceStr
            ? parseInt(String(bPriceStr).replace(/[^\d]/g, ""))
            : 0;
          return (isNaN(bPrice) ? 0 : bPrice) - (isNaN(aPrice) ? 0 : aPrice);
        });
        break;

      default:
        break;
    }

    return sorted;
  }, [filteredProducts, filters.currentSort]);

  // Display products with infinite scroll
  const displayedProducts = sortedProducts.slice(0, displayCount);
  const hasMore = displayCount < sortedProducts.length;

  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  return (
    <div className="min-h-screen bg-evol-light-grey">
      {/* Hero Banner */}
      <CollectionHeroBanner
        title={collectionData.title}
        descriptor={collectionData.descriptor}
        breadcrumb={collectionData.breadcrumb}
      />

      {/* Search Bar */}
      <SearchBar onSearch={setSearchQuery} placeholder="Search Products..." />

      {/* Filter Bar */}
      <FilterBar
        resultCount={filteredProducts.length}
        subCollections={subCollections}
        filterOptions={filterOptions}
      />

      {/* Main Content */}
      <div className="bg-evol-light-grey px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Sort Bar */}
              <SortBar resultCount={filteredProducts.length} />

              {/* Product Grid */}
              <ShopifyProductGrid products={displayedProducts} />

              {/* Infinite Scroll Trigger */}
              <InfiniteScroll hasMore={hasMore} onLoadMore={handleLoadMore} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
