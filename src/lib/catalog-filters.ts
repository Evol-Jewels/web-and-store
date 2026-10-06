export type FilterKey = "shape" | "metal" | "style";
export type FilterOptionData = { value: string; image?: string };
export type CatalogFilters = Record<FilterKey, string[]> & {
  readyToShip: boolean;
};

export const emptyFilters: CatalogFilters = {
  shape: [],
  metal: [],
  style: [],
  readyToShip: false,
};

export const stoneShapes = [
  "Baguette", "Cushion", "Emerald", "Kite", "Marquise", "Trillion",
  "Heart", "Oval", "Pear", "Princess", "Round", "Radiant",
] as const;

export const predefinedFacets: Record<FilterKey, FilterOptionData[]> = {
  shape: stoneShapes.map((value) => ({ value })),
  metal: ["Yellow gold", "White gold", "Rose gold"].map((value) => ({ value })),
  style: [
    { value: "Solitaire", image: "/images/styles/solitaire.webp" },
    { value: "Eternity", image: "/images/styles/eternity.webp" },
    { value: "Studs", image: "/images/styles/studs.webp" },
    { value: "Hoops", image: "/images/styles/hoops.jpg" },
    { value: "Tennis", image: "/images/styles/tennis.webp" },
    { value: "Toi et Moi", image: "/images/styles/toi-et-moi.webp" },
  ],
};

export const filterLabels: Record<FilterKey, string> = {
  shape: "Shape",
  metal: "Metal",
  style: "Style",
};

export const filterOrder: FilterKey[] = ["shape", "metal", "style"];

export function activeFilterCount(filters: CatalogFilters) {
  return filterOrder.reduce((count, key) => count + filters[key].length, Number(filters.readyToShip));
}
