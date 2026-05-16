/**
 * Bidirectional mapping between FilterState and URL parameters
 */

import type { FilterState } from "@/lib/types";
import { FILTER_PARAM_MAPPING } from "@/lib/types/filterConfig";

/**
 * Convert FilterState to URL search parameters
 */
export function filtersToURLParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(FILTER_PARAM_MAPPING).forEach(([filterKey, paramKey]) => {
    const value = filters[filterKey as keyof FilterState];

    // Handle priceRange separately (range format: "min-max")
    if (filterKey === "priceRange" && value) {
      params.set(paramKey, `${value[0]}-${value[1]}`);
    }
    // Handle array filters (join with comma)
    else if (Array.isArray(value) && value.length > 0) {
      params.set(paramKey, value.join(","));
    }
  });

  return params;
}
