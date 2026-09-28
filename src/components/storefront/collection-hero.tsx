import Image from "next/image";

import { productCategories } from "@/lib/catalog";
import type { CollectionDetail, CollectionImage } from "@/types/collection";
import type { ProductCardData } from "@/types/product";

type CollectionHeroProps = {
  collection: CollectionDetail;
  products: ProductCardData[];
};

const collectionDescriptions: Record<string, string> = {
  gifting: "Considered diamond pieces for the people and moments worth celebrating.",
  "lab-grown-diamonds-in-delhi":
    "Modern diamond jewellery, shaped for the moments that matter.",
  shop: "Explore the complete Evol edit of lab-grown diamond jewellery.",
  "ready-to-ship": "Diamond pieces ready to become part of your story.",
  "for-her": "Diamond jewellery shaped around her style and her moments.",
  "made-to-order": "Jewellery made with intention, created to feel entirely yours.",
  fancy: "Distinctive diamond designs with a confident sense of form.",
  dailywear: "Diamond pieces designed to move easily through every day.",
  round: "The timeless brilliance of round-cut diamonds, in forms for every day.",
};

function getHeroImages(
  products: ProductCardData[],
  fallback: CollectionImage | null,
) {
  const images = products.flatMap((product) =>
    product.featuredImage ? [product.featuredImage] : [],
  );
  const uniqueImages = images.filter(
    (image, index) => images.findIndex((item) => item.url === image.url) === index,
  );

  return uniqueImages.length > 0
    ? uniqueImages.slice(0, 2)
    : fallback
      ? [fallback]
      : [];
}

export function CollectionHero({ collection, products }: CollectionHeroProps) {
  const category = productCategories.find(
    (item) => item.slug === collection.handle,
  );
  const images = getHeroImages(products, collection.image);
  const description =
    category?.description ??
    collectionDescriptions[collection.handle] ??
    "A considered edit of lab-grown diamonds and hallmarked gold, shaped for modern life.";

  return (
    <section
      data-hero
      className="relative isolate min-h-[31rem] overflow-hidden bg-cinematic text-cinematic-foreground sm:min-h-[38rem]"
    >
      {category ? (
        <Image
          src={category.image}
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : images.length > 0 ? (
        <div
          className={`absolute inset-0 grid ${images.length === 2 ? "sm:grid-cols-2" : "grid-cols-1"}`}
          aria-hidden="true"
        >
          {images.map((image, index) => (
            <div
              key={image.url}
              className={`relative min-w-0 bg-product-surface ${index === 1 ? "hidden sm:block" : ""}`}
            >
              <Image
                src={image.url}
                alt=""
                fill
                preload={index === 0}
                sizes={
                  images.length === 1
                    ? "100vw"
                    : index === 0
                      ? "(max-width: 640px) 100vw, 50vw"
                      : "50vw"
                }
                className="object-contain object-center"
              />
            </div>
          ))}
        </div>
      ) : null}
      <div className="absolute inset-0 bg-cinematic/70" />
      <div className="luxury-container relative flex min-h-[31rem] flex-col items-center justify-center px-5 pb-16 pt-28 text-center sm:min-h-[38rem]">
        <p className="text-[0.64rem] font-medium uppercase tracking-[0.22em] text-cinematic-foreground/75">
          Evol collection
        </p>
        <h1 className="mt-5 max-w-4xl font-heading text-5xl leading-[0.96] tracking-[-0.04em] sm:text-7xl">
          {collection.title}
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-cinematic-foreground/90 sm:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}
