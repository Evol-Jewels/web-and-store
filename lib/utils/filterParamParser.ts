/**
 * Parse URL search parameters into filter updates
 */

import { ReadonlyURLSearchParams } from "next/navigation";
import { FILTER_PARAM_MAPPING } from "@/lib/types/filterConfig";

export interface FilterParamUpdates {
  categories?: string[];
  shape?: string[];
  priceRange?: [number, number];
  forWhom?: string[];
  size?: string[];
  occasion?: string[];
  grossWeight?: string[];
}

/**
 * Parse URL search parameters and return filter updates
 * Only returns filters that are present in the URL
 */
export function parseFilterParams(
  searchParams: ReadonlyURLSearchParams
): FilterParamUpdates {
  const updates: FilterParamUpdates = {};

  Object.entries(FILTER_PARAM_MAPPING).forEach(([filterKey, paramKey]) => {
    const paramValue = searchParams.get(paramKey);
    if (!paramValue) return;

    if (filterKey === "priceRange") {
      // Parse price range from "min-max" format
      const [min, max] = paramValue.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        (updates as any)[filterKey] = [min, max];
      }
    } else {
      // Parse array filters by splitting on comma
      const values = paramValue.split(",").filter(Boolean);
      if (values.length > 0) {
        (updates as any)[filterKey] = values;
      }
    }
  });

  return updates;
}
