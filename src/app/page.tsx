import type { Metadata } from "next";

import { ProductGrid } from "@/components/storefront/product-grid";
import { listFeaturedProducts } from "@/server/catalog/catalog.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fine Jewellery Collection | Evol",
  description:
    "Discover fine jewellery shaped by light, material and enduring emotion.",
};

export default async function Home() {
  const { products } = await listFeaturedProducts();

  return (
    <main>
      <section className="luxury-container py-20 text-center sm:py-28 lg:py-36">
        <p className="eyebrow">The collection</p>
        <h1 className="mx-auto mt-6 max-w-4xl font-heading text-6xl leading-[0.92] tracking-[-0.04em] sm:text-7xl lg:text-[6.75rem]">
          Objects of permanence
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
          Jewellery composed in precious material and light, created to hold
          meaning beyond the moment.
        </p>
      </section>

      <section id="collection" className="border-t border-border py-16 sm:py-20">
        <div className="luxury-container">
          <div className="mb-12 flex items-end justify-between gap-8 sm:mb-16">
            <div>
              <p className="eyebrow">New expressions</p>
              <h2 className="mt-4 font-heading text-4xl tracking-[-0.025em] sm:text-5xl">
                Discover the pieces
              </h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm leading-6 text-muted-foreground md:block">
              Sculptural forms for everyday rituals and defining occasions.
            </p>
          </div>

          {products.length ? (
            <ProductGrid products={products} />
          ) : (
            <div className="border-y border-border py-24 text-center">
              <p className="eyebrow">The collection is being prepared</p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-16 bg-cinematic text-cinematic-foreground sm:mt-24">
        <div className="luxury-container grid min-h-[32rem] place-items-center py-24 text-center">
          <div className="max-w-2xl">
            <p className="eyebrow text-cinematic-foreground/50">
              Crafted with intention
            </p>
            <h2 className="mt-6 font-heading text-5xl leading-[0.98] tracking-[-0.03em] sm:text-7xl">
              Form follows feeling
            </h2>
            <p className="mx-auto mt-7 max-w-lg text-sm leading-7 text-cinematic-foreground/60">
              Each composition balances precision with emotion, allowing
              material, movement and memory to find their form.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
