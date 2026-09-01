import type { ProductCardData } from "@/types/product";

export type CollectionImage = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type CollectionCardData = {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  productsCount: number;
  image: CollectionImage | null;
};

export type CollectionDetail = CollectionCardData & {
  descriptionHtml: string;
  seo: {
    title: string | null;
    description: string | null;
  };
  products: ProductCardData[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
    hasPreviousPage: boolean;
    startCursor: string | null;
  };
};

export type CollectionConnection = {
  collections: CollectionCardData[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
};
