import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { CollectionImage } from "@/types/collection";
import type { ProductCardData } from "@/types/product";

import { ProductCard } from "./product-card";

export type CollectionGridFeatureData = {
  handle: string;
  title: string;
  image: CollectionImage | null;
  products: ProductCardData[];
};

export function CollectionGridFeature({
  collection,
}: {
  collection: CollectionGridFeatureData;
}) {
  return (
    <section aria-labelledby="grid-feature-title" className="relative left-1/2 my-14 w-dvw -translate-x-1/2 bg-secondary py-12 sm:my-20 sm:py-16">
      <div className="luxury-container grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
        <div className="col-span-2 flex flex-col text-secondary-foreground lg:col-span-1">
          {collection.image ? (
            <div className="relative aspect-[4/3] overflow-hidden bg-media-canvas sm:aspect-[16/9] lg:aspect-auto lg:min-h-64 lg:flex-1">
              <Image
                src={collection.image.url}
                alt={collection.image.altText || collection.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className={`flex flex-col px-2 pb-6 pt-8 sm:px-4 ${collection.image ? "" : "justify-center lg:flex-1 lg:py-12"}`}>
            <p className="eyebrow">New collection</p>
            <h2
              id="grid-feature-title"
              className="mt-5 font-heading text-4xl leading-none tracking-[-0.035em] sm:text-5xl"
            >
              {collection.title}
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
              Explore the new Sugar Rush collection.
            </p>
            <Link
              href={`/collections/${collection.handle}`}
              className={buttonVariants({
                variant: "luxury",
                className: "mt-8 h-11 self-start px-5 text-[0.62rem] uppercase tracking-[0.16em]",
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
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          />
        ))}
      </div>
    </section>
  );
}
