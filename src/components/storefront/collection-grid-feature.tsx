import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { ProductCardData } from "@/types/product";

import { ProductCard } from "./product-card";

export type CollectionGridFeatureData = {
  handle: string;
  title: string;
  products: ProductCardData[];
};

export function CollectionGridFeature({
  collection,
}: {
  collection: CollectionGridFeatureData;
}) {
  return (
    <section aria-labelledby="grid-feature-title" className="relative left-1/2 my-14 w-dvw -translate-x-1/2 bg-secondary py-12 sm:my-20 sm:py-16">
      <div className="luxury-container grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
        <div className="col-span-2 flex min-h-72 flex-col justify-center px-2 py-10 text-secondary-foreground sm:min-h-80 sm:px-4 lg:min-h-0 lg:px-8 lg:py-12">
          <div className="flex max-w-md flex-col items-start">
            <p className="eyebrow">New collection</p>
            <h2
              id="grid-feature-title"
              className="mt-5 font-heading text-4xl leading-none tracking-[-0.035em] sm:text-5xl"
            >
              {collection.title}
            </h2>
            <Link
              href={`/collections/${collection.handle}`}
              className={buttonVariants({
                variant: "luxury",
                className: "mt-8 h-11 px-5 text-[0.62rem] uppercase tracking-[0.16em]",
              })}
            >
              Explore the collection
            </Link>
          </div>
        </div>
        {collection.products.slice(0, 2).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        ))}
      </div>
    </section>
  );
}
