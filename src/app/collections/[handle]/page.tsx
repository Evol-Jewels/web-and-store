import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InfiniteProductGrid } from "@/components/storefront/infinite-product-grid";
import { productCategories } from "@/lib/catalog";
import { toExcerpt } from "@/lib/text";
import { getCollectionDetails } from "@/server/catalog/catalog.service";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionDetails(handle, 1);

  if (!collection) {
    return { title: "Collection not found" };
  }

  return {
    title: collection.seo.title ?? collection.title,
    description:
      collection.seo.description ??
      collection.description ??
      "Discover this Evol fine jewellery collection.",
    alternates: { canonical: "/collections/" + collection.handle },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: PageProps<"/collections/[handle]">) {
  const [{ handle }, { after: afterParam }] = await Promise.all([
    params,
    searchParams,
  ]);
  const after = typeof afterParam === "string" ? afterParam : undefined;
  const collection = await getCollectionDetails(handle, 24, after);

  if (!collection) notFound();

  const description = toExcerpt(
    collection.description ??
      "A considered edit of lab-grown diamonds and hallmarked gold, shaped for modern life.",
    280,
  );

  return (
    <main>
      <section
        data-hero
        className="bg-cinematic pt-20 text-cinematic-foreground"
      >
        <div className="mx-auto grid min-h-[32rem] max-w-[100rem] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex items-center px-6 py-20 sm:px-12 lg:px-16 xl:px-24">
            <div className="max-w-xl">
              <p className="text-[0.64rem] font-medium uppercase tracking-[0.22em] text-cinematic-foreground/65">
                Evol collection
              </p>
              <h1 className="mt-6 font-heading text-5xl leading-[0.96] tracking-[-0.04em] sm:text-7xl">
                {collection.title}
              </h1>
              <p className="mt-7 max-w-lg text-sm leading-7 text-cinematic-foreground/75 sm:text-base">
                {description}
              </p>
              <p className="mt-8 text-[0.62rem] uppercase tracking-[0.2em] text-cinematic-foreground/55">
                {collection.productsCount.toLocaleString("en-IN")} pieces
              </p>
            </div>
          </div>
          <div className="relative min-h-[26rem] overflow-hidden bg-product-surface sm:min-h-[34rem]">
            {collection.image ? (
              <Image
                src={collection.image.url}
                alt={collection.image.altText}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Evol
              </div>
            )}
          </div>
        </div>
      </section>

      <nav aria-label="Product categories" className="border-b border-border">
        <div className="luxury-container flex gap-8 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href="/products"
            className="flex min-h-14 shrink-0 items-center text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            All jewellery
          </Link>
          {productCategories.map((category) => {
            const selected = category.slug === collection.handle;

            return (
              <Link
                key={category.slug}
                href={"/collections/" + category.slug}
                aria-current={selected ? "page" : undefined}
                className={
                  selected
                    ? "relative flex min-h-14 shrink-0 items-center text-[0.64rem] uppercase tracking-[0.18em] text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-foreground"
                    : "flex min-h-14 shrink-0 items-center text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {category.label}
              </Link>
            );
          })}
          <Link
            href="/collections"
            className="flex min-h-14 shrink-0 items-center text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            All collections
          </Link>
        </div>
      </nav>

      <section
        className="luxury-container py-16 sm:py-20 lg:py-24"
        aria-labelledby="collection-products-title"
      >
        <div className="mb-10 flex items-end justify-between gap-6 border-b border-border pb-5 sm:mb-14">
          <div>
            <p className="eyebrow">Browse the collection</p>
            <h2
              id="collection-products-title"
              className="mt-3 font-heading text-3xl tracking-[-0.025em] sm:text-4xl"
            >
              {collection.title}
            </h2>
          </div>
          <p className="shrink-0 text-xs text-muted-foreground">
            {collection.productsCount.toLocaleString("en-IN")} pieces
          </p>
        </div>

        <InfiniteProductGrid
          key={`${collection.handle}:${after ?? "initial"}`}
          collectionHandle={collection.handle}
          initialProducts={collection.products}
          initialPageInfo={collection.pageInfo}
        />
      </section>
    </main>
  );
}
