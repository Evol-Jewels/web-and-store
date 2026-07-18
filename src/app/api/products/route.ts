import { listFeaturedProducts } from "@/server/catalog/catalog.service";

export async function GET() {
  const products = await listFeaturedProducts();
  return Response.json(products);
}
