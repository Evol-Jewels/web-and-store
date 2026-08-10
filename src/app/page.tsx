import type { Metadata } from "next";
import Link from "next/link";

import { BrandStory } from "@/components/storefront/home/brand-story";
import { EditorialBand } from "@/components/storefront/home/editorial-band";
import { EditorialCollections } from "@/components/storefront/home/editorial-collections";
import { FeaturedCollection } from "@/components/storefront/home/featured-collection";
import { HomeHero } from "@/components/storefront/home/home-hero";
import { ProductCard } from "@/components/storefront/product-card";
import { Reveal } from "@/components/storefront/reveal";
import { buttonVariants } from "@/components/ui/button";
import {
  getCollectionDetails,
  listFeaturedProducts,
} from "@/server/catalog/catalog.service";
import type { ProductCardData } from "@/types/product";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lab-Grown Diamond Jewellery",
  description:
    "Discover Evol's certified lab-grown diamond jewellery, handcrafted in India in hallmarked gold.",
};

const promises = [
  ["IGI/SGL", "Certified diamonds"],
  ["14K & 18K", "Hallmarked gold"],
  ["India", "Handcrafted locally"],
  ["For life", "Complimentary annual care"],
];

const featuredTypes = ["rings", "necklaces", "earrings", "bracelets"];

const SPOTLIGHT_HANDLE = "dailywear";

function pieceCount(count: number | undefined) {
  if (!count) return undefined;
  return `${count.toLocaleString("en-IN")} pieces`;
}

function selectFeaturedProducts(products: ProductCardData[]) {
  const selected = featuredTypes
    .map((type) =>
      products.find((product) => product.productType?.toLowerCase() === type),
    )
    .filter((product): product is ProductCardData => Boolean(product));

  return selected.length === featuredTypes.length
    ? selected
    : products.slice(0, 4);
}

export default async function Home() {
  const [{ products }, spotlight] = await Promise.all([
    listFeaturedProducts(),
    getCollectionDetails(SPOTLIGHT_HANDLE),
  ]);
  const featuredProducts = selectFeaturedProducts(products);

  return (
    <main className="overflow-hidden">
      <HomeHero />

      <section className="luxury-container py-24 text-center sm:py-32 lg:py-40">
        <Reveal>
          <p className="eyebrow">The Evol point of view</p>
          <h2 className="mx-auto mt-7 max-w-4xl font-heading text-5xl leading-[0.98] tracking-[-0.035em] sm:text-7xl lg:text-[5.75rem]">
            Diamonds, evolved for the way we live now.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            Lab-grown diamonds with exceptional clarity, set in hallmarked gold
            and shaped by hand in India. Modern heirlooms, made with intention.
          </p>
        </Reveal>
      </section>

      <EditorialCollections />

      {spotlight ? (
        <FeaturedCollection
          eyebrow="A signature to live in"
          title="Daily Wear Diamonds"
          description="Lightweight lab-grown diamond pieces designed for the everyday — quiet, wearable brilliance that moves from morning to evening without a second thought."
          image="/images/home/editorial-daily.jpg"
          alt="A woman wearing everyday Evol lab-grown diamond studs and a pendant"
          handle={SPOTLIGHT_HANDLE}
          meta={pieceCount(spotlight.productsCount)}
          reversed
        />
      ) : null}

      <section className="luxury-container py-24 sm:py-32" aria-labelledby="featured-title">
        <Reveal className="mb-12 flex items-end justify-between gap-8 sm:mb-16">
          <div>
            <p className="eyebrow">Our creations</p>
            <h2
              id="featured-title"
              className="mt-4 font-heading text-4xl tracking-[-0.025em] sm:text-6xl"
            >
              Pieces to live in
            </h2>
          </div>
          <Link
            href="/products"
            className="link-underline hidden text-[0.65rem] uppercase tracking-[0.2em] sm:inline-flex"
          >
            View all jewellery
          </Link>
        </Reveal>

        {featuredProducts.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-14 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
            {featuredProducts.map((product, index) => (
              <Reveal key={product.id} delay={(index % 4) * 90}>
                <ProductCard product={product} priority={index < 2} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="border-y border-border py-24 text-center">
            <p className="eyebrow">The collection is being prepared</p>
          </div>
        )}

        <Link
          href="/products"
          className="mt-12 inline-flex text-[0.65rem] uppercase tracking-[0.2em] sm:hidden"
        >
          View all jewellery
        </Link>
      </section>

      <EditorialBand />

      <BrandStory />

      <section className="border-b border-border bg-background" aria-label="The Evol promise">
        <Reveal className="luxury-container grid grid-cols-2 border-x border-border lg:grid-cols-4">
          {promises.map(([value, label], index) => (
            <div
              key={label}
              className={`px-5 py-10 text-center sm:py-12 ${
                index % 2 ? "border-l border-border" : ""
              } ${index > 1 ? "border-t border-border lg:border-t-0" : ""} ${
                index === 2 ? "lg:border-l" : ""
              }`}
            >
              <p className="font-heading text-2xl tracking-[-0.02em] sm:text-3xl">{value}</p>
              <p className="mt-2 text-[0.58rem] uppercase tracking-[0.18em] text-muted-foreground sm:text-[0.62rem]">
                {label}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="luxury-container py-24 text-center sm:py-32 lg:py-40">
        <Reveal>
          <p className="eyebrow">Made personal</p>
          <h2 className="mx-auto mt-6 max-w-3xl font-heading text-5xl leading-none tracking-[-0.035em] sm:text-7xl">
            Your diamond, your way
          </h2>
          <p className="mx-auto mt-7 max-w-lg text-sm leading-7 text-muted-foreground">
            Meet with an Evol diamond specialist to choose a stone, refine a
            design, or create a piece entirely your own.
          </p>
          <Link
            href="/products"
            className={buttonVariants({
              variant: "luxury",
              className: "mt-9 h-12 rounded-none px-8 text-[0.62rem]",
            })}
          >
            Begin your consultation
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
