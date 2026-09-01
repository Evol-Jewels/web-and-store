import "server-only";

import type {
  CollectionConnection,
  CollectionDetail,
} from "@/types/collection";
import type { ProductConnection, ProductDetail } from "@/types/product";

type ProductDetailResponse = Omit<ProductDetail, "inventoryProducts"> & {
  inventoryProducts?: ProductDetail["inventoryProducts"] | null;
};

type ProductConnectionResponse = Omit<
  ProductConnection,
  "pageInfo" | "totalProducts"
> & {
  pageInfo?: Partial<ProductConnection["pageInfo"]> | null;
  totalProducts?: number | null;
  productsCount?: number | null;
};

type CollectionDetailResponse = Omit<
  CollectionDetail,
  "pageInfo" | "productsCount"
> & {
  productsCount?: number | null;
  totalProducts?: number | null;
  pageInfo?: CollectionDetail["pageInfo"] | null;
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

export async function getProducts(
  first = 24,
  after?: string,
): Promise<ProductConnection> {
  const searchParams = new URLSearchParams({ first: String(first) });
  if (after) searchParams.set("after", after);

  const page = await requestCatalog<ProductConnectionResponse>(
    `/api/v1/storefront/products?${searchParams.toString()}`,
  );

  return {
    ...page,
    totalProducts: page.totalProducts ?? page.productsCount ?? null,
    pageInfo: {
      hasNextPage: page.pageInfo?.hasNextPage ?? false,
      endCursor: page.pageInfo?.endCursor ?? null,
      hasPreviousPage: page.pageInfo?.hasPreviousPage ?? false,
      startCursor: page.pageInfo?.startCursor ?? null,
    },
  };
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

export async function getCollection(
  handle: string,
  first = 24,
  after?: string,
): Promise<CollectionDetail> {
  const searchParams = new URLSearchParams({ first: String(first) });
  if (after) searchParams.set("after", after);

  const collection = await requestCatalog<CollectionDetailResponse>(
    `/api/v1/storefront/collections/${encodeURIComponent(handle)}?${searchParams.toString()}`,
  );

  return {
    ...collection,
    productsCount:
      collection.productsCount ??
      collection.totalProducts ??
      collection.products.length,
    pageInfo: collection.pageInfo ?? {
      hasNextPage: false,
      endCursor: null,
      hasPreviousPage: false,
      startCursor: null,
    },
  };
}
