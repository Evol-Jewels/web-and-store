import { getFilteredProducts } from "@/api/catalog.client";

export async function GET(request: Request) {
  const incoming = new URL(request.url).searchParams;
  const search = new URLSearchParams();
  for (const key of ["collection", "shape", "metal", "style", "readyToShip", "after"]) {
    const value = incoming.get(key);
    if (value) search.set(key, value);
  }
  search.set("first", "24");

  try {
    return Response.json(await getFilteredProducts(search));
  } catch {
    return Response.json({ message: "Unable to filter products" }, { status: 503 });
  }
}
