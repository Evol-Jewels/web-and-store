import type { ProductCardData } from "@/types/product";

export type FilterKey = "shape" | "metal" | "style";
export type FilterOptionData = { value: string; count: number; image?: string };
export type CatalogFilters = Record<FilterKey, string[]> & {
  readyToShip: boolean;
};

export const emptyFilters: CatalogFilters = {
  shape: [],
  metal: [],
  style: [],
  readyToShip: false,
};

const shapes = [
  "Round", "Oval", "Pear", "Emerald", "Marquise", "Cushion",
  "Princess", "Heart", "Radiant", "Baguette", "Trillion", "Asscher",
];
const metals = ["Yellow gold", "White gold", "Rose gold"];
const styles = ["Solitaire", "Eternity", "Studs", "Hoops", "Tennis", "Toi et Moi"];

export const filterLabels: Record<FilterKey, string> = {
  shape: "Shape",
  metal: "Metal",
  style: "Style",
};

export const filterOrder: FilterKey[] = ["shape", "metal", "style"];

function normalizedTags(product: ProductCardData) {
  return product.tags.map((tag) => tag.toLowerCase().replaceAll(/[^a-z0-9]/g, ""));
}

export function productFacets(product: ProductCardData): Record<FilterKey, string[]> {
  const tags = normalizedTags(product);
  const shapeTags = tags.filter((tag) => tag.startsWith("stoneshape"));
  const metalTags = tags.filter((tag) => tag.startsWith("metaltype"));
  const styleTags = tags.filter((tag) => tag.startsWith("subcategory") || tag.startsWith("filters"));

  return {
    shape: shapes.filter((shape) => shapeTags.some((tag) => tag.includes(shape.toLowerCase()))),
    metal: metals.filter((metal) => metalTags.some((tag) => tag.includes(metal.split(" ")[0].toLowerCase()))),
    style: styles.filter((style) => styleTags.some((tag) => tag.includes(style.toLowerCase().replaceAll(" ", "")))),
  };
}

export function availableFacets(products: ProductCardData[]) {
  const counts: Record<FilterKey, Map<string, FilterOptionData>> = {
    shape: new Map(), metal: new Map(), style: new Map(),
  };

  for (const product of products) {
    const facets = productFacets(product);
    for (const key of filterOrder) {
      for (const value of facets[key]) {
        const previous = counts[key].get(value);
        counts[key].set(value, {
          value,
          count: (previous?.count ?? 0) + 1,
          image: previous?.image ?? (key === "style" ? product.featuredImage?.url : undefined),
        });
      }
    }
  }

  return Object.fromEntries(filterOrder.map((key) => [
    key,
    [...counts[key].values()],
  ])) as Record<FilterKey, FilterOptionData[]>;
}

export function matchesFilters(
  product: ProductCardData,
  filters: CatalogFilters,
  readyProductIds: Set<string>,
) {
  if (filters.readyToShip && !readyProductIds.has(product.id)) return false;
  const facets = productFacets(product);
  return filterOrder.every((key) =>
    filters[key].length === 0 || filters[key].some((value) => facets[key].includes(value)),
  );
}

export function activeFilterCount(filters: CatalogFilters) {
  return filterOrder.reduce((count, key) => count + filters[key].length, Number(filters.readyToShip));
}
