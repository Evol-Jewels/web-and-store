import { getPublicProductCards } from "@/server/catalog/product-visibility";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (
      !body || typeof body !== "object" || !("handles" in body) ||
      !Array.isArray(body.handles) || body.handles.length > 100 ||
      !body.handles.every((handle: unknown) =>
        typeof handle === "string" && handle.length <= 255 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(handle),
      )
    ) {
      return Response.json({ message: "Invalid product handles" }, { status: 400 });
    }
    return Response.json(
      { products: await getPublicProductCards(body.handles) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ message: "Unable to check saved products" }, { status: 503 });
  }
}
