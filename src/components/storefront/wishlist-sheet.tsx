"use client";

import { LoadingStatus } from "@/components/storefront/loading-status";

import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
import { StorefrontMoney } from "@/components/storefront/storefront-money";
import type { ProductCardData } from "@/types/product";

export function WishlistSheet({ children }: { children: React.ReactNode }) {
  const { wishlist: savedWishlist, toggleWishlist } = useStorefront();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<{ key: string; products: ProductCardData[]; failed?: boolean } | null>(null);
  const key = JSON.stringify(savedWishlist.map((product) => product.handle));
  const wishlist = checked?.key === key ? checked.products : [];
  const pending = savedWishlist.length > 0 && checked?.key !== key;

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    fetch("/api/products/visible", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handles: JSON.parse(key) }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load wishlist");
        return response.json() as Promise<{ products: ProductCardData[] }>;
      })
      .then(({ products }) => {
        if (!controller.signal.aborted) setChecked({ key, products });
      })
      .catch(() => { if (!controller.signal.aborted) setChecked({ key, products: [], failed: true }); });
    return () => controller.abort();
  }, [open, key]);

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => { setChecked(null); setOpen(nextOpen); }}>
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

        {pending || checked?.failed ? (
          <p role="status" className="px-7 py-10 text-sm text-muted-foreground sm:px-10">
            {pending ? <LoadingStatus>Checking saved pieces…</LoadingStatus> : "Unable to load saved pieces. Please reopen your wishlist to try again."}
          </p>
        ) : wishlist.length ? (
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
                      From <StorefrontMoney money={product.priceRange.min} />
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="self-start rounded-md hover:bg-transparent hover:opacity-55"
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
                    "mt-8 h-11 rounded-md px-7 text-[0.64rem] uppercase tracking-[0.18em]",
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
