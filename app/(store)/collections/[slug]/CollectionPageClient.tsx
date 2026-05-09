"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useFilterStore } from "@/lib/stores/filterStore";
import { extractFilterOptions } from "@/lib/filterOptionExtractor";
import { CollectionHeroBanner } from "@/components/store/plp/CollectionHeroBanner";
import { FilterBar } from "@/components/store/plp/FilterBar";
import { SearchBar } from "@/components/store/plp/SearchBar";
import { SortBar } from "@/components/store/plp/SortBar";
import { ShopifyProductGrid } from "@/components/store/plp/ShopifyProductGrid";
import { EmptyState } from "@/components/store/plp/EmptyState";
import { Pagination } from "@/components/store/plp/Pagination";

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
  productType?: string;
  images: Array<{
    url: string;
    alt?: string;
  }>;
  variants: Array<{
    id: string;
    price: string;
    title: string;
  }>;
  tags?: string[];
  description?: string;
  __subCollectionHandle?: string;
}

interface CollectionData {
  title: string;
  descriptor: string;
  breadcrumb: string;
}

interface SubCollection {
  id: string;
  title: string;
  handle: string;
}

interface CollectionPageClientProps {
  slug: string;
  products: ShopifyProduct[];
  collectionData: CollectionData;
  subCollections?: SubCollection[];
}

const ITEMS_PER_PAGE = 12;

export function CollectionPageClient({
  slug,
  products,
  collectionData,
  subCollections,
}: CollectionPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { filters } = useFilterStore();
  const searchParams = useSearchParams();

  // Extract dynamic filter options from products
  const filterOptions = useMemo(() => {
    return extractFilterOptions(products, slug);
  }, [products, slug]);

  // Filter products based on search, sub-collections, shape, price, and occasion
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

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
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.__subCollectionHandle || ""),
      );
    } else {
      // If no category is selected, only show primary collection products
      // Primary collection products don't have __subCollectionHandle set
      filtered = filtered.filter((p) => !p.__subCollectionHandle);
    }

    // Filter by shape (if any shapes are selected)
    if (filters.shape.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        return filters.shape.some((shape) => {
          // Match tags like "stone_shape_Round", "stone_shape_Oval", etc.
          return tags.some((tag) =>
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
          return tags.some((tag) => {
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
          return tags.some((tag) => {
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

    // Filter by size (if any are selected)
    if (filters.size.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        const sizeLower = filters.size.map((s) => s.toLowerCase());

        return tags.some((tag) => {
          const tagLower = tag.toLowerCase();

          // Match Size_* tags
          if (tagLower.includes("size_")) {
            const match = tagLower.match(/size_(.+)/);
            if (match) {
              const sizeValue = match[1];
              // Check if this size value matches any selected size
              return sizeLower.some((selectedSize) => {
                const selectedLower = selectedSize.toLowerCase();
                return (
                  sizeValue.includes(selectedLower) ||
                  sizeValue === selectedLower
                );
              });
            }
          }

          return false;
        });
      });
    }

    // Filter by gross weight (if any are selected)
    if (filters.grossWeight.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        // Match tags like "Gross_Total_Weight_Range_1g-3g", "Gross_Total_Weight_Range_10g & more"
        return tags.some((tag) => {
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
  }, [filters, products, searchQuery]);

  // Sort products based on selected sort option
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];

    switch (filters.currentSort) {
      case "featured":
        // Show products with "bestseller" or "tag_bestseller" tag first
        sorted.sort((a, b) => {
          const aHasBestseller = (a.tags || []).some((tag) => {
            const tagLower = tag.toLowerCase();
            return tagLower.includes("bestseller");
          });
          const bHasBestseller = (b.tags || []).some((tag) => {
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

  // Paginate products
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIdx, endIdx);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

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
              <ShopifyProductGrid products={paginatedProducts} />

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  totalItems={filteredProducts.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
