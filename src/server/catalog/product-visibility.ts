import "server-only";
import { cache } from "react";

import { CatalogApiError } from "@/api/catalog.client";
import type { ProductCardData } from "@/types/product";
import { findProductByHandle } from "./catalog.repository";

export const getPublicProduct = cache(async (handle: string) => {
  try {
    return await findProductByHandle(handle);
  } catch (error) {
    if (error instanceof CatalogApiError && error.status === 404) return null;
    throw error;
  }
});

export async function filterPublicProducts(products: ProductCardData[]) {
  const visible: ProductCardData[] = [];
  for (let index = 0; index < products.length; index += 4) {
    const batch = products.slice(index, index + 4);
    const checked = await Promise.all(
      batch.map(async (product) =>
        (await getPublicProduct(product.handle)) ? product : null,
      ),
    );
    visible.push(...checked.filter((product) => product !== null));
  }
  return visible;
}

export async function getPublicProductCards(handles: string[]) {
  const products: ProductCardData[] = [];
  const uniqueHandles = [...new Set(handles)];
  for (let index = 0; index < uniqueHandles.length; index += 4) {
    const checked = await Promise.all(
      uniqueHandles.slice(index, index + 4).map((handle) => getPublicProduct(handle)),
    );
    for (const product of checked) {
      if (!product) continue;
      const {
        id, handle, title, vendor, productType, tags, featuredImage, secondaryImage,
        priceRange, availableForSale,
      } = product;
      products.push({
        id, handle, title, vendor, productType, tags, featuredImage,
        secondaryImage, priceRange, availableForSale,
      });
    }
  }
  return products;
}
