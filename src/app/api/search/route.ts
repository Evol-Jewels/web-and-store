import { listAllCollections, listFeaturedProducts } from "@/server/catalog/catalog.service";

export async function GET() {
  try {
    const [collections, page] = await Promise.all([listAllCollections(), listFeaturedProducts()]);
    return Response.json(
      { handles: collections.map((collection) => collection.handle), products: page.products.slice(0, 4) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ message: "Unable to load search" }, { status: 503 });
  }
}
