import "server-only";

import type {
  CollectionConnection,
  CollectionDetail,
} from "@/types/collection";
import type { ProductConnection, ProductDetail } from "@/types/product";

type ProductDetailResponse = Omit<ProductDetail, "inventoryProducts"> & {
  inventoryProducts?: ProductDetail["inventoryProducts"] | null;
};

const backendApiUrl =
  process.env.BACKEND_API_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

export class CatalogApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "CatalogApiError";
  }
}

async function requestCatalog<T>(path: string): Promise<T> {
  const response = await fetch(`${backendApiUrl}${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new CatalogApiError("Unable to load the catalog", response.status);
  }

  return response.json() as Promise<T>;
}

export function getProducts(first = 24, after?: string) {
  const searchParams = new URLSearchParams({ first: String(first) });
  if (after) searchParams.set("after", after);

  return requestCatalog<ProductConnection>(
    `/api/v1/storefront/products?${searchParams.toString()}`,
  );
}

export async function getProduct(handle: string): Promise<ProductDetail> {
  const product = await requestCatalog<ProductDetailResponse>(
    `/api/v1/storefront/products/${encodeURIComponent(handle)}`,
  );

  return {
    ...product,
    inventoryProducts: Array.isArray(product.inventoryProducts)
      ? product.inventoryProducts
      : [],
  };
}

export function getCollections(first = 24, after?: string) {
  const searchParams = new URLSearchParams({ first: String(first) });
  if (after) searchParams.set("after", after);

  return requestCatalog<CollectionConnection>(
    `/api/v1/storefront/collections?${searchParams.toString()}`,
  );
}

export function getCollection(handle: string) {
  return requestCatalog<CollectionDetail>(
    `/api/v1/storefront/collections/${encodeURIComponent(handle)}`,
  );
}
