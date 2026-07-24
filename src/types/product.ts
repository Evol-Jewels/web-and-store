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

export type ProductDetail = ProductCardData & {
  descriptionHtml: string;
  seo: {
    title: string | null;
    description: string | null;
  };
  media: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
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
