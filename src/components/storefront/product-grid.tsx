import type { ProductCardData } from "@/types/product";

import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-14 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 xl:gap-y-20">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
