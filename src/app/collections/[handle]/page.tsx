import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CollectionHero } from "@/components/storefront/collection-hero";
import { InfiniteProductGrid } from "@/components/storefront/infinite-product-grid";
import { productCategories } from "@/lib/catalog";
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

  const heroCollection = after
    ? await getCollectionDetails(handle, 4)
    : collection;

  return (
    <main>
      <CollectionHero collection={collection} products={heroCollection?.products ?? []} />

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
