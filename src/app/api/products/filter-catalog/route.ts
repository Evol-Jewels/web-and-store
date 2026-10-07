import type { ProductCardData } from "@/types/product";
import type { CollectionCardData } from "@/types/collection";
import { findProducts, findCollectionByHandle } from "@/server/catalog/catalog.repository";
import { listAllCollections } from "@/server/catalog/catalog.service";

type CatalogSnapshot = { products: ProductCardData[]; readyProductIds: string[] };

async function loadProducts(collection?: CollectionCardData) {
  const products: ProductCardData[] = [];
  const seenCursors = new Set<string>();
  let after: string | undefined;

  do {
    const page = collection
      ? await findCollectionByHandle(collection.handle, 48, after)
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

export async function GET(request: Request) {
  const collection = new URL(request.url).searchParams.get("collection") ?? undefined;
  try {
    const collections = await listAllCollections();
    const selected = collections.find((item) => item.handle === collection);
    if (collection && !selected) {
      return Response.json({ message: "Collection not found" }, { status: 404 });
    }
    const readyToShip = collections.find((item) => item.handle === "ready-to-ship");
    const [products, readyProducts] = await Promise.all([
      loadProducts(selected),
      readyToShip ? loadProducts(readyToShip) : Promise.resolve([]),
    ]);
    const snapshot: CatalogSnapshot = {
      products,
      readyProductIds: readyProducts.map((product) => product.id),
    };
    return Response.json(snapshot, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ message: "Unable to load filters" }, { status: 503 });
  }
}
