"use client";

import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useStorefront } from "@/components/storefront/storefront-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatMoney } from "@/lib/format";

export function WishlistSheet({ children }: { children: React.ReactNode }) {
  const { wishlist, toggleWishlist } = useStorefront();

  return (
    <Sheet>
      <SheetTrigger render={children as React.ReactElement} />
      <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-[34rem]">
        <SheetHeader className="border-b border-border px-7 py-6 sm:px-10">
          <SheetTitle className="font-sans text-xs font-medium uppercase tracking-[0.22em]">
            Wishlist {wishlist.length ? `(${wishlist.length})` : ""}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Products saved to your Evol wishlist.
          </SheetDescription>
        </SheetHeader>

        {wishlist.length ? (
          <div className="overflow-y-auto px-7 pb-10 sm:px-10">
            <p className="border-b border-border py-6 text-xs leading-6 text-muted-foreground">
              Sign in to keep your saved pieces available across devices.
            </p>
            <div className="divide-y divide-border">
              {wishlist.map((product) => (
                <article key={product.id} className="grid grid-cols-[6.5rem_1fr_auto] gap-4 py-6">
                  <Link
                    href={`/products/${product.handle}`}
                    className="relative aspect-square bg-product-surface"
                  >
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText}
                        fill
                        sizes="104px"
                        className="object-contain p-3"
                      />
                    ) : null}
                  </Link>
                  <div className="min-w-0 self-center">
                    <p className="text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                      {product.productType || "Fine jewellery"}
                    </p>
                    <Link
                      href={`/products/${product.handle}`}
                      className="mt-2 block font-heading text-xl leading-tight"
                    >
                      {product.title}
                    </Link>
                    <p className="mt-2 text-xs">
                      From {formatMoney(product.priceRange.min)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="self-start rounded-none hover:bg-transparent hover:opacity-55"
                    aria-label={`Remove ${product.title} from wishlist`}
                    onClick={() => toggleWishlist(product)}
                  >
                    <X strokeWidth={1.25} />
                  </Button>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid flex-1 place-items-center px-7 py-16 text-center sm:px-10">
            <div className="max-w-xs">
              <Heart className="mx-auto size-6" strokeWidth={1.1} />
              <p className="mt-6 font-heading text-3xl tracking-[-0.02em]">
                Your wishlist is empty
              </p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Save the pieces you would like to return to.
              </p>
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "mt-8 h-11 rounded-none px-7 text-[0.64rem] uppercase tracking-[0.18em]",
                })}
              >
                Explore jewellery
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
