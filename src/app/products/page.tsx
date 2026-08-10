import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ProductGrid } from "@/components/storefront/product-grid";
import {
  findProductCategory,
  productCategories,
  productMatchesCategory,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { listAllProducts } from "@/server/catalog/catalog.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fine Jewellery Collection",
  description:
    "Explore every Evol creation, from lab-grown diamond rings and earrings to necklaces, bracelets and pendants.",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const { category: categoryParam } = await searchParams;
  const category = findProductCategory(
    typeof categoryParam === "string" ? categoryParam : undefined,
  );
  const allProducts = await listAllProducts();
  const products = category
    ? allProducts.filter((product) =>
        productMatchesCategory(product, category.slug),
      )
    : allProducts;
  const heroImage = category?.image ?? "/images/home/hero-01.webp";
  const title = category?.label ?? "All jewellery";
  const description =
    category?.description ??
    "Discover every Evol creation, shaped in lab-grown diamonds and hallmarked gold.";

  return (
    <main>
      <section className="relative isolate min-h-[19rem] overflow-hidden bg-cinematic text-cinematic-foreground sm:min-h-[24rem]">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-foreground/45" />
        <div className="luxury-container relative flex min-h-[19rem] flex-col items-center justify-center py-16 text-center sm:min-h-[24rem]">
          <p className="text-[0.64rem] font-medium uppercase tracking-[0.22em] text-cinematic-foreground/75">
            The collection
          </p>
          <h1 className="mt-5 font-heading text-5xl leading-none tracking-[-0.035em] sm:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-cinematic-foreground/85 sm:text-base">
            {description}
          </p>
        </div>
      </section>

      <nav
        aria-label="Product categories"
        className="border-b border-border"
      >
        <div className="luxury-container flex gap-8 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href="/products"
            aria-current={!category ? "page" : undefined}
            className={cn(
              "relative flex min-h-14 shrink-0 items-center text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground",
              !category &&
                "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-foreground",
            )}
          >
            All jewellery
          </Link>
          {productCategories.map((item) => {
            const selected = category?.slug === item.slug;

            return (
              <Link
                key={item.slug}
                href={`/products?category=${item.slug}`}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "relative flex min-h-14 shrink-0 items-center text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground",
                  selected &&
                    "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
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
              {title}
            </h2>
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>

        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="border-y border-border py-24 text-center">
            <p className="eyebrow">This collection is being prepared</p>
            <Link
              href="/products"
              className="link-underline mt-6 inline-flex text-[0.64rem] uppercase tracking-[0.18em]"
            >
              View all jewellery
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
