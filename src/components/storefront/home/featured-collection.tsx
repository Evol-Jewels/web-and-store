import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/storefront/reveal";
import { buttonVariants } from "@/components/ui/button";

type FeaturedCollectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  handle: string;
  meta?: string;
  reversed?: boolean;
};

export function FeaturedCollection({
  eyebrow,
  title,
  description,
  image,
  alt,
  handle,
  meta,
  reversed = false,
}: FeaturedCollectionProps) {
  return (
    <section className="bg-background" aria-labelledby={`collection-${handle}`}>
      <div className="grid lg:grid-cols-2">
        <div
          className={`relative min-h-[26rem] overflow-hidden sm:min-h-[36rem] lg:min-h-[46rem] ${
            reversed ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <Reveal image className="absolute inset-0">
            <Image
              src={image}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </Reveal>
        </div>
        <div
          className={`flex items-center bg-secondary px-6 py-20 sm:px-12 sm:py-28 lg:px-20 xl:px-28 ${
            reversed ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <Reveal className="max-w-xl">
            <p className="eyebrow">{eyebrow}</p>
            <h2
              id={`collection-${handle}`}
              className="mt-6 font-heading text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl"
            >
              {title}
            </h2>
            <p className="mt-8 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={`/products?collection=${handle}`}
                className={buttonVariants({
                  variant: "luxury",
                  className:
                    "h-12 rounded-none px-8 text-[0.62rem] uppercase tracking-[0.18em]",
                })}
              >
                Explore the collection
              </Link>
              {meta ? (
                <span className="text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {meta}
                </span>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
