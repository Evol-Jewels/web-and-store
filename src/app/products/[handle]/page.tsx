import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductInformation } from "@/components/storefront/product-information";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CatalogApiError } from "@/api/catalog.client";
import { getProductDetails } from "@/server/catalog/catalog.service";

export const dynamic = "force-dynamic";

async function loadProduct(handle: string) {
  try {
    return await getProductDetails(handle);
  } catch (error) {
    if (error instanceof CatalogApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await loadProduct(handle);

  return {
    title: product.seo.title || `${product.title} | Evol`,
    description:
      product.seo.description ||
      `Discover ${product.title}, part of the Evol fine jewellery collection.`,
    openGraph: product.featuredImage
      ? {
          images: [
            {
              url: product.featuredImage.url,
              width: product.featuredImage.width,
              height: product.featuredImage.height,
              alt: product.featuredImage.altText,
            },
          ],
        }
      : undefined,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const product = await loadProduct(handle);

  return (
    <main>
      <div className="luxury-container py-6 sm:py-8">
        <Breadcrumb>
          <BreadcrumbList className="text-[0.64rem] uppercase tracking-[0.16em]">
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/products" />}>
                Jewellery
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-48 truncate font-normal">
                {product.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="luxury-container pb-20 lg:pb-32">
        <div className="lg:hidden">
          <ProductGallery
            images={product.media.slice(0, 1)}
            productTitle={product.title}
          />
          <div className="py-12">
            <ProductInformation product={product} />
          </div>
          <ProductGallery
            images={product.media.slice(1)}
            productTitle={product.title}
          />
        </div>

        <div className="hidden gap-16 lg:grid lg:grid-cols-[minmax(0,1.55fr)_minmax(22rem,0.75fr)] xl:gap-24">
          <ProductGallery
            images={product.media}
            productTitle={product.title}
          />
          <ProductInformation product={product} />
        </div>
      </div>

      <section className="border-t border-border bg-secondary">
        <div className="luxury-container grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow">A lasting expression</p>
            <h2 className="mt-5 max-w-xl font-heading text-5xl leading-[0.98] tracking-[-0.03em] sm:text-6xl">
              Made to live with you
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground lg:justify-self-end">
            Designed with restraint and finished with precision, each piece
            rewards a closer look and becomes more personal with time.
          </p>
        </div>
      </section>
    </main>
  );
}
