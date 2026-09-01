import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CollectionCard } from "@/components/storefront/collection-card";
import { Reveal } from "@/components/storefront/reveal";
import { productCategories } from "@/lib/catalog";
import { listAllCollections } from "@/server/catalog/catalog.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jewellery Collections",
  description:
    "Explore every Evol collection, from everyday lab-grown diamond signatures to solitaire, gifting and ready-to-ship jewellery.",
};

export default async function CollectionsPage() {
  const collections = (await listAllCollections()).toSorted((left, right) =>
    left.title.localeCompare(right.title, "en-IN"),
  );

  return (
    <main>
      <section
        data-hero
        className="relative isolate min-h-[31rem] overflow-hidden bg-cinematic text-cinematic-foreground sm:min-h-[38rem]"
      >
        <Image
          src="/images/home/editorial-expression.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-foreground/45" />
        <div className="luxury-container relative flex min-h-[31rem] flex-col items-center justify-center px-5 pt-24 text-center sm:min-h-[38rem]">
          <p className="text-[0.64rem] font-medium uppercase tracking-[0.22em] text-cinematic-foreground/75">
            The world of Evol
          </p>
          <h1 className="mt-5 max-w-4xl font-heading text-6xl leading-[0.95] tracking-[-0.04em] sm:text-8xl">
            Collections, considered
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-cinematic-foreground/85 sm:text-base">
            Discover modern diamond signatures through form, feeling and the
            moments they are made to hold.
          </p>
        </div>
      </section>

      <section className="border-b border-border py-20 sm:py-28">
        <Reveal className="luxury-container">
          <p className="eyebrow">Begin with a form</p>
          <div className="mt-5 flex items-end justify-between gap-8">
            <h2 className="max-w-2xl font-heading text-4xl tracking-[-0.03em] sm:text-6xl">
              Jewellery by category
            </h2>
            <Link
              href="/products"
              className="link-underline hidden text-[0.64rem] uppercase tracking-[0.18em] sm:inline-flex"
            >
              View all jewellery
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-px bg-border lg:grid-cols-5">
          {productCategories.map((category) => (
            <Link
              key={category.slug}
              href={"/collections/" + category.slug}
              className="group relative aspect-[4/5] overflow-hidden bg-product-surface"
            >
              <Image
                src={category.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 50vw, 20vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-background sm:p-7">
                <p className="text-[0.64rem] font-medium uppercase tracking-[0.2em]">
                  {category.label}
                </p>
                <p className="mt-2 hidden text-xs leading-5 text-background/75 sm:block">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="luxury-container py-20 sm:py-28 lg:py-32"
        aria-labelledby="all-collections-title"
      >
        <Reveal className="mb-12 flex items-end justify-between gap-8 border-b border-border pb-6 sm:mb-16">
          <div>
            <p className="eyebrow">Every expression</p>
            <h2
              id="all-collections-title"
              className="mt-4 font-heading text-4xl tracking-[-0.03em] sm:text-6xl"
            >
              All collections
            </h2>
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            {collections.length.toLocaleString("en-IN")} collections
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-3 gap-y-14 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 xl:gap-y-20">
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              priority={index < 4}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
