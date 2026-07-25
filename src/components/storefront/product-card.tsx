import Image from "next/image";
import Link from "next/link";

import { formatPriceRange } from "@/lib/format";
import type { ProductCardData } from "@/types/product";

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductCardData;
  priority?: boolean;
}) {
  const hasSecondView =
    product.secondaryImage &&
    product.secondaryImage.url !== product.featuredImage?.url;

  return (
    <article className="group min-w-0">
      <Link
        href={`/products/${product.handle}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-product-surface">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-[8%] transition duration-700 ease-out group-hover:scale-[1.025] group-hover:opacity-0 motion-reduce:transition-none"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Evol
            </div>
          )}

          {hasSecondView ? (
            <Image
              src={product.secondaryImage.url}
              alt={product.secondaryImage.altText}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-[8%] opacity-0 transition duration-700 ease-out group-hover:scale-[1.025] group-hover:opacity-100 motion-reduce:transition-none"
            />
          ) : null}

          {!product.availableForSale ? (
            <span className="absolute left-4 top-4 bg-background/90 px-3 py-2 text-[0.62rem] uppercase tracking-[0.18em]">
              Enquire
            </span>
          ) : null}
        </div>

        <div className="border-b border-border py-4 sm:py-5">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 truncate text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground sm:text-[0.66rem] sm:tracking-[0.2em]">
              {product.productType || product.vendor || "Fine jewellery"}
            </p>
            <p className="shrink-0 whitespace-nowrap text-[0.68rem] sm:text-sm">
              {formatPriceRange(product.priceRange)}
            </p>
          </div>
          <h2 className="mt-2 line-clamp-2 font-heading text-lg leading-tight tracking-[-0.01em] sm:text-xl">
            {product.title}
          </h2>
        </div>
      </Link>
    </article>
  );
}
