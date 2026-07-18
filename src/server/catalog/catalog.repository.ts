import "server-only";

import type { Product } from "@/types/product";

const products: Product[] = [
  { id: "field-tote", name: "Field Tote", category: "Carry", price: 3490, color: "#bac5a2", accent: "#33432c" },
  { id: "pour-over", name: "Stone Pour Over", category: "Kitchen", price: 1890, color: "#d8b897", accent: "#713f29" },
  { id: "desk-tray", name: "Folded Desk Tray", category: "Workspace", price: 2250, color: "#9eb9c7", accent: "#253e4d" },
];

export async function findFeaturedProducts(): Promise<Product[]> {
  return products;
}
