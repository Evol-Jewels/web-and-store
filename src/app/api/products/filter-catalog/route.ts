import type { ProductCardData } from "@/types/product";
import { findProducts } from "@/server/catalog/catalog.repository";
import { getCollectionDetails } from "@/server/catalog/catalog.service";

type CatalogSnapshot = { products: ProductCardData[]; readyProductIds: string[] };
const snapshots = new Map<string, { expires: number; value: Promise<ProductCardData[]> }>();
const cacheDuration = 5 * 60 * 1000;

async function loadProducts(collection?: string) {
  const products: ProductCardData[] = [];
  const seenCursors = new Set<string>();
  let after: string | undefined;

  do {
    const page = collection
      ? await getCollectionDetails(collection, 48, after)
      : await findProducts(48, after);
    if (!page) throw new Error("Collection not found");
    products.push(...page.products);
    const nextCursor = page.pageInfo.hasNextPage
      ? page.pageInfo.endCursor ?? undefined
      : undefined;
    if (!nextCursor || seenCursors.has(nextCursor)) break;
    seenCursors.add(nextCursor);
    after = nextCursor;
  } while (after);

  return products;
}

function cachedProducts(collection?: string) {
  const key = collection ?? "all";
  const existing = snapshots.get(key);
  if (existing && existing.expires > Date.now()) return existing.value;

  const value = loadProducts(collection).catch((error: unknown) => {
    snapshots.delete(key);
    throw error;
  });
  snapshots.set(key, { expires: Date.now() + cacheDuration, value });
  return value;
}

export async function GET(request: Request) {
  const collection = new URL(request.url).searchParams.get("collection") ?? undefined;
  try {
    const [products, readyProducts] = await Promise.all([
      cachedProducts(collection),
      cachedProducts("ready-to-ship"),
    ]);
    const snapshot: CatalogSnapshot = {
      products,
      readyProductIds: readyProducts.map((product) => product.id),
    };
    return Response.json(snapshot);
  } catch {
    return Response.json({ message: "Unable to load filters" }, { status: 503 });
  }
}
