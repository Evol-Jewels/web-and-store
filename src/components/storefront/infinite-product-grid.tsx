"use client";

import { useEffect, useRef, useState } from "react";

import type { ProductCardData, ProductConnection } from "@/types/product";

import { ProductGrid } from "./product-grid";

type ProductPage = Pick<ProductConnection, "pageInfo" | "products">;

function appendUniqueProducts(
  current: ProductCardData[],
  incoming: ProductCardData[],
) {
  const productIds = new Set(current.map((product) => product.id));
  return [
    ...current,
    ...incoming.filter((product) => {
      if (productIds.has(product.id)) return false;
      productIds.add(product.id);
      return true;
    }),
  ];
}

export function InfiniteProductGrid({
  collectionHandle,
  initialPageInfo,
  initialProducts,
}: {
  collectionHandle?: string;
  initialPageInfo: ProductConnection["pageInfo"];
  initialProducts: ProductCardData[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [retryKey, setRetryKey] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const cursor = pageInfo.endCursor;
    if (!sentinel || !pageInfo.hasNextPage || !cursor) return;

    let controller: AbortController | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        controller = new AbortController();
        setLoadState("loading");

        const searchParams = new URLSearchParams({ after: cursor });
        if (collectionHandle) {
          searchParams.set("collection", collectionHandle);
        }

        fetch(`/api/products?${searchParams.toString()}`, {
          signal: controller.signal,
        })
          .then(async (response) => {
            if (!response.ok) throw new Error("Unable to load more products");
            return response.json() as Promise<ProductPage>;
          })
          .then((nextPage) => {
            setProducts((current) =>
              appendUniqueProducts(current, nextPage.products),
            );
            setPageInfo(
              nextPage.pageInfo.endCursor === cursor
                ? { ...nextPage.pageInfo, hasNextPage: false }
                : nextPage.pageInfo,
            );
            setLoadState("idle");
          })
          .catch((error: unknown) => {
            if (error instanceof DOMException && error.name === "AbortError") {
              return;
            }
            setLoadState("error");
          });
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      controller?.abort();
    };
  }, [collectionHandle, pageInfo, retryKey]);

  return (
    <div aria-busy={loadState === "loading"}>
      <ProductGrid products={products} />
      <div
        ref={sentinelRef}
        className="flex min-h-24 items-center justify-center pt-10 text-center"
        aria-live="polite"
      >
        {loadState === "loading" ? (
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground motion-safe:animate-pulse">
            Loading more pieces
          </p>
        ) : null}
        {loadState === "error" ? (
          <button
            type="button"
            className="min-h-11 text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground underline decoration-border underline-offset-8 transition-colors hover:text-foreground"
            onClick={() => {
              setLoadState("idle");
              setRetryKey((current) => current + 1);
            }}
          >
            Try loading again
          </button>
        ) : null}
      </div>
    </div>
  );
}
