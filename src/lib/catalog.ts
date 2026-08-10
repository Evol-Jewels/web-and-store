import type { ProductCardData } from "@/types/product";

export const productCategories = [
  {
    slug: "rings",
    label: "Rings",
    image: "/images/home/editorial-rings.jpg",
    description: "Sculptural diamond rings made for everyday significance.",
  },
  {
    slug: "necklaces",
    label: "Necklaces",
    image: "/images/home/editorial-necklace.jpg",
    description: "Diamond necklaces composed to sit close and feel personal.",
  },
  {
    slug: "earrings",
    label: "Earrings",
    image: "/images/home/editorial-earrings.jpg",
    description: "Light-catching forms, balanced for quiet impact.",
  },
  {
    slug: "bracelets",
    label: "Bracelets",
    image: "/images/home/editorial-wrist.jpg",
    description: "Refined lines of brilliance designed to move with you.",
  },
  {
    slug: "pendants",
    label: "Pendants",
    image: "/images/home/editorial-pendants.jpg",
    description: "Personal diamond signatures shaped with modern restraint.",
  },
] as const;

export type ProductCategory = (typeof productCategories)[number];
export type ProductCategorySlug = ProductCategory["slug"];

export function findProductCategory(value: string | undefined) {
  return productCategories.find((category) => category.slug === value);
}

export function productMatchesCategory(
  product: ProductCardData,
  category: ProductCategorySlug,
) {
  const productType = product.productType
    ?.toLocaleLowerCase("en-IN")
    .replace(/[^a-z]/g, "")
    .replace(/s$/, "");
  const categoryType = category.replace(/s$/, "");

  return productType === categoryType;
}
