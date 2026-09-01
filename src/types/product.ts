export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductImage = {
  id: string;
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type ProductVideo = {
  id: string;
  mediaContentType: "VIDEO";
  altText: string;
  previewImage: ProductImage | null;
  sources: Array<{
    url: string;
    mimeType: string;
    format: string;
    width: number;
    height: number;
  }>;
};

export type ProductMedia = ProductImage | ProductVideo;

export type ProductCardData = {
  id: string;
  handle: string;
  title: string;
  vendor: string | null;
  productType: string | null;
  tags: string[];
  featuredImage: ProductImage | null;
  secondaryImage: ProductImage | null;
  priceRange: {
    min: Money;
    max: Money;
  };
  availableForSale: boolean;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
};

export type InventoryProduct = {
  productCode: string;
  status: "AVAILABLE" | "NOT_AVAILABLE";
  purity: number | null;
  color: "YELLOW" | "ROSE" | "WHITE" | "OTHERS";
  size: number | null;
  location: {
    id: string;
    name: string;
    city: string;
    type: "STORE" | "WAREHOUSE";
  } | null;
};

export type ProductDetail = ProductCardData & {
  descriptionHtml: string;
  seo: {
    title: string | null;
    description: string | null;
  };
  media: ProductMedia[];
  showcaseVideo: ProductVideo | null;
  options: ProductOption[];
  variants: ProductVariant[];
  inventoryProducts: InventoryProduct[];
  collections: Array<{
    id: string;
    title: string;
    handle: string;
  }>;
};

export type ProductConnection = {
  products: ProductCardData[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
};
