"use client";

import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { productCategories } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";
import type { ProductCardData } from "@/types/product";

const searchCollections = [
  { handle: "solitaire", label: "Solitaire" },
  { handle: "dailywear", label: "Daily Wear" },
  { handle: "gifting", label: "Gifting" },
  { handle: "fancy", label: "Fancy" },
  { handle: "ready-to-ship", label: "Ready to Ship" },
];

const linkClass =
  "text-sm text-foreground/80 transition-colors hover:text-foreground";

export function SearchSheet({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [creations, setCreations] = useState<ProductCardData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open || loaded) return;
    let active = true;
    fetch("/api/products")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data?.products) {
          setCreations(data.products.slice(0, 4));
          setLoaded(true);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [open, loaded]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={children as React.ReactElement} />
      <SheetContent
        side="top"
        showCloseButton={false}
        className="max-h-[92svh] overflow-y-auto p-0"
      >
        <SheetTitle className="sr-only">Search</SheetTitle>
        <SheetDescription className="sr-only">
          Search Evol creations, collections and categories.
        </SheetDescription>

        <div className="luxury-container flex items-center gap-4 border-b border-border py-6 sm:py-7">
          <Search className="size-5 shrink-0 text-muted-foreground" strokeWidth={1.25} />
          <input
            type="search"
            autoFocus
            placeholder="Search creations, collections…"
            aria-label="Search"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setOpen(false);
                router.push("/products");
              }
            }}
            className="w-full bg-transparent text-base tracking-wide outline-none placeholder:text-muted-foreground"
          />
          <SheetClose
            aria-label="Close search"
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" strokeWidth={1.25} />
          </SheetClose>
        </div>

        <div className="luxury-container grid gap-x-12 gap-y-12 py-12 lg:grid-cols-[10rem_10rem_1fr]">
          <div>
            <p className="eyebrow">Categories</p>
            <ul className="mt-6 space-y-4">
              {productCategories.map((category) => (
                <li key={category.slug}>
                  <SheetClose
                    render={
                      <Link
                        href={`/collections/${category.slug}`}
                        className={linkClass}
                      />
                    }
                  >
                    {category.label}
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Collections</p>
            <ul className="mt-6 space-y-4">
              {searchCollections.map((collection) => (
                <li key={collection.handle}>
                  <SheetClose
                    render={
                      <Link
                        href={`/collections/${collection.handle}`}
                        className={linkClass}
                      />
                    }
                  >
                    {collection.label}
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Creations</p>
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
              {creations.map((product) => (
                <SheetClose
                  key={product.id}
                  render={
                    <Link href={`/products/${product.handle}`} className="group block" />
                  }
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-product-surface">
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText}
                        fill
                        sizes="200px"
                        className="object-contain p-[8%] transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    ) : null}
                  </div>
                  <p className="mt-3 line-clamp-1 text-xs leading-5 text-foreground">
                    {product.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    From {formatMoney(product.priceRange.min)}
                  </p>
                </SheetClose>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
