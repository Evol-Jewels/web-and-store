"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useStorefront } from "@/components/storefront/storefront-provider";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import type { ProductCardData } from "@/types/product";

function formatProductTitle(title: string) {
  return title
    .toLocaleLowerCase("en-IN")
    .replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase("en-IN"));
}

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductCardData;
  priority?: boolean;
}) {
  const { isWishlisted, toggleWishlist } = useStorefront();
  const saved = isWishlisted(product.id);

  return (
    <article className="group min-w-0">
      <div className="relative">
        <Link
          href={`/products/${product.handle}`}
          prefetch={false}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-product-surface transition-transform duration-700 ease-out group-hover:-translate-y-1 group-focus-within:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText}
                fill
                priority={priority}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Evol
              </div>
            )}
          </div>
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="group/wishlist absolute top-3 right-3 z-10 rounded-none bg-background/75 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-background focus-visible:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
          aria-label={
            saved
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          aria-pressed={saved}
          onClick={() => toggleWishlist(product)}
        >
          <Heart
            className={`transition-transform duration-300 ease-out group-hover/wishlist:scale-105 group-focus-visible/wishlist:scale-105 motion-reduce:transform-none motion-reduce:transition-none ${saved ? "fill-current" : "fill-transparent"}`}
            strokeWidth={1.25}
          />
        </Button>
      </div>

      <Link
        href={`/products/${product.handle}`}
        prefetch={false}
        className="block py-4 sm:py-5"
      >
        <h2 className="text-sm font-normal leading-5 sm:text-base sm:leading-6">
          {formatProductTitle(product.title)}
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
          From {formatMoney(product.priceRange.min)}
        </p>
      </Link>
    </article>
  );
}
