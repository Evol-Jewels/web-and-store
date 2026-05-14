/**
 * Central export for all type definitions
 */

export type {
  ShopifyImage,
  ShopifyVariant,
  ShopifyProduct,
  ShopifyCollection,
  MajorCollectionType,
} from "./shopify";

export type {
  SortOption,
  FilterState,
  FilterKey,
  FilterValue,
  FilterOption,
  FilterOptions,
  FilterBarProps,
  SubCollection,
} from "./filters";

export type {
  CartItem,
  Cart,
} from "./cart";

export type {
  AddToCartStatus,
  CollectionData,
  CollectionPageClientProps,
} from "./ui";

export {
  METAL_COLORS,
  RING_SIZES,
  NECKLACE_LENGTHS,
  BRACELET_SIZES,
  RING_PATTERNS,
  NECKLACE_PATTERNS,
} from "./constants";

export {
  DEFAULT_FILTER_OPTIONS,
  FILTER_PARAM_MAPPING,
} from "./filterConfig";

export type { FilterParamKey } from "./filterConfig";

export {
  COLLECTION_METADATA,
  getCollectionMetadata,
} from "./collectionMetadata";

export type { CollectionDataKey, CollectionDataItem } from "./collectionMetadata";
