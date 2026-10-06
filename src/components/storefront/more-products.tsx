import Link from "next/link";

import { ProductGrid } from "@/components/storefront/product-grid";
import { getCollectionDetails } from "@/server/catalog/catalog.service";
import type { ProductDetail } from "@/types/product";

async function getRecommendations(product: ProductDetail) {
  for (const { handle } of product.collections) {
    const collection = await getCollectionDetails(handle, 5);
    if (!collection) continue;

    const products = collection.products
      .filter((item) => item.id !== product.id)
      .slice(0, 4);
    if (products.length) return { collection, products };
  }

  return null;
}

export async function MoreProducts({ product }: { product: ProductDetail }) {
  const recommendation = await getRecommendations(product);
  if (!recommendation) return null;
  const { collection, products } = recommendation;

  return (
    <section
      aria-labelledby="more-products-title"
      className="border-t border-border py-16 sm:py-20 lg:py-24"
    >
      <div className="luxury-container">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 sm:mb-10">
          <div>
            <p className="eyebrow">{collection.title}</p>
            <h2
              id="more-products-title"
              className="mt-3 font-heading text-3xl tracking-[-0.025em] sm:text-4xl"
            >
              More products to explore
            </h2>
          </div>
          <Link
            href={`/collections/${collection.handle}`}
            className="flex min-h-11 items-center text-[0.64rem] uppercase tracking-[0.18em] underline underline-offset-4 transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          >
            View collection
          </Link>
        </div>
        <ProductGrid products={products} prioritizeFirstRow={false} />
      </div>
    </section>
  );
}
