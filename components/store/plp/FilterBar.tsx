"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useFilterStore } from "@/lib/stores/filterStore";
import { X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_FILTER_OPTIONS = {
  shape: [
    "Round",
    "Oval",
    "Emerald",
    "Pear",
    "Marquise",
    "Cushion",
    "Heart",
    "Radiant",
    "Asscher",
    "Trillion",
    "Solitaire",
  ],
  occasion: [
    "Dailywear",
    "Engagement",
    "Wedding",
    "Anniversary",
    "Fancy",
    "Birthday",
    "Festival",
  ],
  forWhom: ["Women", "Men", "Couples", "Unisex"],
  size: ["Small", "Medium", "Large"],
  priceRange: [
    { label: "₹0 - ₹50K", value: "0-50000" },
    { label: "₹50K - ₹100K", value: "50000-100000" },
    { label: "₹100K - ₹200K", value: "100000-200000" },
    { label: "₹200K+", value: "200000-9999999" },
  ],
  grossWeight: [
    { label: "Below 5g", value: "0-5" },
    { label: "5g - 10g", value: "5-10" },
    { label: "10g - 20g", value: "10-20" },
    { label: "Above 20g", value: "20-999" },
  ],
};

interface SubCollection {
  id: string;
  title: string;
  handle: string;
}

interface FilterBarProps {
  resultCount: number;
  subCollections?: SubCollection[];
  filterOptions?: {
    shape: string[];
    occasion: string[];
    forWhom: string[];
    size: string[];
    priceRange: Array<{ label: string; value: string }>;
    grossWeight: Array<{ label: string; value: string }>;
  };
}

export function FilterBar({
  resultCount,
  subCollections,
  filterOptions,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters, setFilter, clearAll, hasActiveFilters } = useFilterStore();

  // Use provided filter options or defaults
  const options = filterOptions || DEFAULT_FILTER_OPTIONS;

  // Sync URL with filters
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.categories.length > 0)
      params.set("categories", filters.categories.join(","));
    if (filters.shape.length > 0) params.set("shape", filters.shape.join(","));
    if (filters.priceRange)
      params.set("price", `${filters.priceRange[0]}-${filters.priceRange[1]}`);
    if (filters.forWhom.length > 0)
      params.set("forWhom", filters.forWhom.join(","));
    if (filters.size.length > 0) params.set("size", filters.size.join(","));
    if (filters.occasion.length > 0)
      params.set("occasion", filters.occasion.join(","));
    if (filters.grossWeight.length > 0)
      params.set("weight", filters.grossWeight.join(","));

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl);
  }, [filters, router]);

  // Load filters from URL on mount
  useEffect(() => {
    const categories =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const shape = searchParams.get("shape")?.split(",").filter(Boolean) || [];
    const price = searchParams.get("price");
    const forWhom =
      searchParams.get("forWhom")?.split(",").filter(Boolean) || [];
    const size = searchParams.get("size")?.split(",").filter(Boolean) || [];
    const occasion =
      searchParams.get("occasion")?.split(",").filter(Boolean) || [];
    const weight =
      searchParams.get("weight")?.split(",").filter(Boolean) || [];

    if (categories.length > 0) setFilter("categories", categories);
    if (shape.length > 0) setFilter("shape", shape);
    if (price) {
      const [min, max] = price.split("-").map(Number);
      setFilter("priceRange", [min, max]);
    }
    if (forWhom.length > 0) setFilter("forWhom", forWhom);
    if (size.length > 0) setFilter("size", size);
    if (occasion.length > 0) setFilter("occasion", occasion);
    if (weight.length > 0) setFilter("grossWeight", weight);
  }, []);

  const handleFilterChange = useCallback(
    (key: string, value: string, checked: boolean) => {
      if (key === "priceRange") {
        const [min, max] = value.split("-").map(Number);
        setFilter("priceRange" as any, checked ? [min, max] : null);
      } else {
        const currentValues = (filters as any)[key] || [];
        if (checked) {
          setFilter(key as any, [...currentValues, value]);
        } else {
          setFilter(
            key as any,
            currentValues.filter((v: string) => v !== value),
          );
        }
      }
    },
    [filters, setFilter],
  );

  const handleClearFilter = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (key === "priceRange") {
      setFilter("priceRange" as any, null);
    } else {
      setFilter(key as any, []);
    }
  };

  // Determine categories based on sub-collections or defaults
  const categoryOptions = subCollections
    ? subCollections.map((sc) => ({ label: sc.title, value: sc.handle }))
    : ["Rings", "Earrings", "Necklaces", "Bracelets", "Pendants"].map((v) => ({
        label: v,
        value: v,
      }));

  const getActivePillLabel = (key: string, value: any) => {
    if (key === "priceRange") {
      const range = DEFAULT_FILTER_OPTIONS.priceRange.find(
        (r: any) => r.value === `${value[0]}-${value[1]}`,
      );
      return range?.label || `₹${value[0]}-${value[1]}`;
    }
    if (key === "availability") {
      return value ? "In Stock" : "Out of Stock";
    }
    return value;
  };

  const filterPills = [
    ...(subCollections && subCollections.length > 0
      ? [
          {
            key: "categories",
            label: "Categories",
            options: categoryOptions,
            isActive: filters.categories.length > 0,
            values: filters.categories,
          },
        ]
      : []),
    {
      key: "shape",
      label: "Stone Shape",
      options: options.shape.map((v: string) => ({
        label: v,
        value: v,
      })),
      isActive: filters.shape.length > 0,
      values: filters.shape,
    },
    {
      key: "occasion",
      label: "Occasion",
      options: options.occasion.map((v: string) => ({
        label: v,
        value: v,
      })),
      isActive: filters.occasion.length > 0,
      values: filters.occasion,
    },
    {
      key: "forWhom",
      label: "For Whom?",
      options: options.forWhom.map((v: string) => ({
        label: v,
        value: v,
      })),
      isActive: filters.forWhom.length > 0,
      values: filters.forWhom,
    },
    {
      key: "size",
      label: "Size",
      options: options.size.map((v: string) => ({
        label: v,
        value: v,
      })),
      isActive: filters.size.length > 0,
      values: filters.size,
    },
    {
      key: "priceRange",
      label: "Price",
      options: options.priceRange,
      isActive: filters.priceRange !== null,
      values: filters.priceRange
        ? [`${filters.priceRange[0]}-${filters.priceRange[1]}`]
        : [],
    },
    {
      key: "grossWeight",
      label: "Gross Weight",
      options: options.grossWeight,
      isActive: filters.grossWeight.length > 0,
      values: filters.grossWeight,
    },
  ];

  return (
    <div className="w-full bg-white border-b border-evol-grey">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 flex-wrap">
          {/* Filter pills */}
          {filterPills.map((pill) => (
            <div key={pill.key} className="relative">
              {pill.isActive ? (
                <button
                  onClick={(e) => handleClearFilter(pill.key, e)}
                  className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-md whitespace-nowrap text-sm md:text-base font-medium bg-evolRed text-white border border-evolRed shadow-md hover:shadow-lg hover:bg-red-700 transition-all duration-200"
                >
                  <span className="font-sans font-medium">{pill.label}</span>
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-md whitespace-nowrap text-sm md:text-base font-medium bg-white border border-evol-grey text-evol-dark-grey hover:border-evolRed hover:shadow-sm transition-all duration-200"
                    >
                      <span className="font-sans font-medium">{pill.label}</span>
                      <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-56 md:w-64 bg-white border border-evol-grey"
                  >
                    <DropdownMenuLabel className="font-serif text-sm md:text-base px-3 py-2.5">
                      {pill.label}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2" />
                    {pill.options.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={pill.values.includes(option.value)}
                        onCheckedChange={(checked) =>
                          handleFilterChange(pill.key, option.value, checked)
                        }
                        className="px-3 py-2.5 text-sm md:text-base cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-body text-sm md:text-base">
                          {option.label}
                        </span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}

          {/* Clear all link */}
          {hasActiveFilters() && (
            <button
              onClick={() => clearAll()}
              className="text-sm md:text-sm text-evolRed font-medium hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              Clear All
            </button>
          )}

          {/* Results count */}
          <div className="text-sm md:text-sm text-evol-dark-grey font-body whitespace-nowrap">
            {resultCount} Pieces
          </div>
        </div>
      </div>
    </div>
  );
}
