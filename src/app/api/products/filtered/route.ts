import { getFilteredProducts } from "@/api/catalog.client";
import { listAllCollections } from "@/server/catalog/catalog.service";
import { filterPublicProducts } from "@/server/catalog/product-visibility";

export async function GET(request: Request) {
  const incoming = new URL(request.url).searchParams;
  const search = new URLSearchParams();
  for (const key of ["collection", "shape", "metal", "style", "readyToShip", "after"]) {
    const value = incoming.get(key);
    if (value) search.set(key, value);
  }
  search.set("first", "24");

  try {
    const handles = [search.get("collection"), search.get("readyToShip") === "true" ? "ready-to-ship" : null].filter((handle) => handle !== null);
    if (handles.length) {
      const collections = await listAllCollections();
      if (!handles.every((handle) => collections.some((item) => item.handle === handle))) {
        return Response.json({ message: "Collection not found" }, { status: 404 });
      }
    }

    const page = await getFilteredProducts(search);
    const products = await filterPublicProducts(page.products);
    return Response.json({ ...page, products }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ message: "Unable to filter products" }, { status: 503 });
  }
}
