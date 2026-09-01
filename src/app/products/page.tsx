import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CatalogNextLink } from "@/components/storefront/catalog-next-link";
import { ProductGrid } from "@/components/storefront/product-grid";
import { productCategories } from "@/lib/catalog";
import { findProducts } from "@/server/catalog/catalog.repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fine Jewellery Collection",
  description:
    "Explore every Evol creation, from lab-grown diamond rings and earrings to necklaces, bracelets and pendants.",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const {
    after: afterParam,
    category: categoryParam,
    collection: collectionParam,
  } = await searchParams;

  if (typeof collectionParam === "string") {
    redirect("/collections/" + encodeURIComponent(collectionParam));
  }
  if (typeof categoryParam === "string") {
    redirect("/collections/" + encodeURIComponent(categoryParam));
  }

  const after = typeof afterParam === "string" ? afterParam : undefined;
  const page = await findProducts(24, after);

  return (
    <main>
      <section
        data-hero
        className="relative isolate min-h-[23rem] overflow-hidden bg-cinematic text-cinematic-foreground sm:min-h-[27rem]"
      >
        <Image
          src="/images/home/editorial-portrait.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-foreground/45" />
        <div className="luxury-container relative flex min-h-[23rem] flex-col items-center justify-center px-5 pb-16 pt-28 text-center sm:min-h-[27rem]">
          <p className="text-[0.64rem] font-medium uppercase tracking-[0.22em] text-cinematic-foreground/75">
            Every expression
          </p>
          <h1 className="mt-5 font-heading text-5xl leading-none tracking-[-0.035em] sm:text-7xl">
            All jewellery
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-cinematic-foreground/85 sm:text-base">
            Discover every Evol creation, shaped in lab-grown diamonds and
            hallmarked gold.
          </p>
        </div>
      </section>

      <nav aria-label="Product categories" className="border-b border-border">
        <div className="luxury-container flex gap-8 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href="/products"
            aria-current="page"
            className="relative flex min-h-14 shrink-0 items-center text-[0.64rem] uppercase tracking-[0.18em] text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-foreground"
          >
            All jewellery
          </Link>
          {productCategories.map((category) => (
            <Link
              key={category.slug}
              href={"/collections/" + category.slug}
              className="flex min-h-14 shrink-0 items-center text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {category.label}
            </Link>
          ))}
          <Link
            href="/collections"
            className="flex min-h-14 shrink-0 items-center text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            View collections
          </Link>
        </div>
      </nav>

      <section
        className="luxury-container py-16 sm:py-20 lg:py-24"
        aria-labelledby="catalog-title"
      >
        <div className="mb-10 flex items-end justify-between gap-6 border-b border-border pb-5 sm:mb-14">
          <div>
            <p className="eyebrow">Browse the collection</p>
            <h2
              id="catalog-title"
              className="mt-3 font-heading text-3xl tracking-[-0.025em] sm:text-4xl"
            >
              The complete collection
            </h2>
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            {page.totalProducts.toLocaleString("en-IN")} pieces
          </p>
        </div>

        <ProductGrid products={page.products} />

        <CatalogNextLink
          pathname="/products"
          endCursor={page.pageInfo.endCursor}
          hasNextPage={page.pageInfo.hasNextPage}
        />
      </section>
    </main>
  );
}
