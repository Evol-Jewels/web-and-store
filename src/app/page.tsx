import type { Metadata } from "next";
import Link from "next/link";

import { BrandStory } from "@/components/storefront/home/brand-story";
import { EditorialBand } from "@/components/storefront/home/editorial-band";
import { EditorialCollections } from "@/components/storefront/home/editorial-collections";
import { HomeHero } from "@/components/storefront/home/home-hero";
import { ProductCard } from "@/components/storefront/product-card";
import { Reveal } from "@/components/storefront/reveal";
import { listFeaturedProducts } from "@/server/catalog/catalog.service";
import type { ProductCardData } from "@/types/product";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lab-Grown Diamond Jewellery",
  description:
    "Discover Evol's certified lab-grown diamond jewellery, handcrafted in India in hallmarked gold.",
};

const featuredTypes = ["rings", "necklaces", "earrings", "bracelets"];

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
  const { products } = await listFeaturedProducts();
  const featuredProducts = selectFeaturedProducts(products);

  return (
    <main className="overflow-hidden">
      <HomeHero />

      <EditorialCollections />

      <section className="luxury-container py-20 sm:py-28 lg:py-32" aria-labelledby="featured-title">
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
          <div className="rounded-md border border-border py-24 text-center">
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
    </main>
  );
}
