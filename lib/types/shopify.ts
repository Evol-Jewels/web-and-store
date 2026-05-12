/**
 * Shopify-related type definitions
 */

export interface ShopifyImage {
  url: string;
  alt?: string;
}

export interface ShopifyVariant {
  id: string;
  price: string;
  title: string;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
  productType?: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  tags?: string[];
  description?: string;
  __subCollectionHandle?: string;
  __subCollectionTitle?: string;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
}

export type MajorCollectionType =
  | "Rings"
  | "Earrings"
  | "Necklaces"
  | "Pendants"
  | "Bracelets";
