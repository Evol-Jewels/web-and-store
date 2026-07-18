import type { Product } from "@/types/product";

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch("/api/products", { signal });

  if (!response.ok) throw new Error("Unable to load products");
  return response.json() as Promise<Product[]>;
}
