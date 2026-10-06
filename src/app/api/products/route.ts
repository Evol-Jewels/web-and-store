import { findProducts } from "@/server/catalog/catalog.repository";
import { getCollectionDetails } from "@/server/catalog/catalog.service";

export async function GET(request: Request) {
  try {
    return await loadProducts(request);
  } catch {
    return Response.json({ message: "Unable to load products" }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}

async function loadProducts(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const after = searchParams.get("after") ?? undefined;
  const collectionHandle = searchParams.get("collection");

  if (collectionHandle) {
    const collection = await getCollectionDetails(collectionHandle, 24, after);
    if (!collection) {
      return Response.json({ message: "Collection not found" }, { status: 404 });
    }

    return Response.json({
      products: collection.products,
      pageInfo: collection.pageInfo,
    });
  }

  return Response.json(await findProducts(24, after));
}
