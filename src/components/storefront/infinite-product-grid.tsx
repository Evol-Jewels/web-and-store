"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { activeFilterCount, predefinedFacets, emptyFilters, type CatalogFilters, type FilterKey } from "@/lib/catalog-filters";
import type { ProductCardData, ProductConnection } from "@/types/product";

import { CatalogFilterBar } from "./catalog-filter-bar";
import { CollectionGridFeature, type CollectionGridFeatureData } from "./collection-grid-feature";
import { ProductGrid } from "./product-grid";

export function InfiniteProductGrid({
  collectionHandle,
  featuredCollection,
  initialPageInfo,
  initialProducts,
  initialTotalProducts,
}: {
  collectionHandle?: string;
  featuredCollection?: CollectionGridFeatureData;
  initialPageInfo: ProductConnection["pageInfo"];
  initialProducts: ProductCardData[];
  initialTotalProducts?: number | null;
}) {
  const [pagedProducts, setPagedProducts] = useState(initialProducts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [paging, setPaging] = useState(false);
  const [pagingError, setPagingError] = useState(false);
  const [filters, setFilters] = useState<CatalogFilters>(emptyFilters);
  const [filteredPage, setFilteredPage] = useState<ProductConnection | null>(null);
  const [filterState, setFilterState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [filterRetryKey, setFilterRetryKey] = useState(0);
  const [filterPaging, setFilterPaging] = useState(false);
  const [filterPagingError, setFilterPagingError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pagingRef = useRef(false);
  const filterPagingRef = useRef(false);

  const hasFilters = activeFilterCount(filters) > 0;
  const filterSearch = useMemo(() => {
    const search = new URLSearchParams();
    if (collectionHandle) search.set("collection", collectionHandle);
    for (const key of ["shape", "metal", "style"] as const) {
      if (filters[key].length) search.set(key, filters[key].join(","));
    }
    if (filters.readyToShip) search.set("readyToShip", "true");
    return search.toString();
  }, [collectionHandle, filters]);

  useEffect(() => {
    if (!hasFilters) return;
    const controller = new AbortController();
    filterPagingRef.current = false;
    fetch(`/api/products/filtered?${filterSearch}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to filter products");
        return response.json() as Promise<ProductConnection>;
      })
      .then((page) => {
        setFilteredPage(page);
        setFilterState("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFilterState("error");
      });
    return () => controller.abort();
  }, [filterSearch, filterRetryKey, hasFilters]);

  const products = hasFilters ? filteredPage?.products ?? [] : pagedProducts;
  const productListing = featuredCollection && products.length >= 24 ? (
    <>
      <ProductGrid products={products.slice(0, 24)} />
      <CollectionGridFeature collection={featuredCollection} />
      {products.length > 24 ? <ProductGrid products={products.slice(24)} prioritizeFirstRow={false} /> : null}
    </>
  ) : <ProductGrid products={products} />;
  const resultCount = hasFilters ? filteredPage?.totalProducts ?? products.length : initialTotalProducts ?? products.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const cursor = pageInfo.endCursor;
    if (!sentinel || hasFilters || !pageInfo.hasNextPage || !cursor || pagingError) return;
    let controller: AbortController | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      if (pagingRef.current) return;
      pagingRef.current = true;
      controller = new AbortController();
      setPaging(true);
      const search = new URLSearchParams({ after: cursor });
      if (collectionHandle) search.set("collection", collectionHandle);
      fetch(`/api/products?${search.toString()}`, { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) throw new Error("Unable to load more products");
          return response.json() as Promise<Pick<ProductConnection, "products" | "pageInfo">>;
        })
        .then((page) => {
          setPagedProducts((current) => {
            const seen = new Set(current.map((product) => product.id));
            return [...current, ...page.products.filter((product) => !seen.has(product.id))];
          });
          setPageInfo(page.pageInfo.endCursor === cursor
            ? { ...page.pageInfo, hasNextPage: false }
            : page.pageInfo);
          setPaging(false);
          pagingRef.current = false;
          setPagingError(false);
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setPaging(false);
          pagingRef.current = false;
          setPagingError(true);
        });
    }, { rootMargin: "500px 0px" });
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      controller?.abort();
    };
  }, [collectionHandle, pageInfo, pagingError, hasFilters]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const cursor = filteredPage?.pageInfo.endCursor;
    if (!sentinel || !hasFilters || !filteredPage?.pageInfo.hasNextPage || !cursor || filterPagingError) return;
    let controller: AbortController | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || filterPagingRef.current) return;
      observer.disconnect();
      filterPagingRef.current = true;
      controller = new AbortController();
      setFilterPaging(true);
      const search = new URLSearchParams(filterSearch);
      search.set("after", cursor);
      fetch(`/api/products/filtered?${search.toString()}`, { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) throw new Error("Unable to load more filtered products");
          return response.json() as Promise<ProductConnection>;
        })
        .then((nextPage) => {
          setFilteredPage((current) => current ? {
            ...nextPage,
            products: [...current.products, ...nextPage.products],
          } : nextPage);
          filterPagingRef.current = false;
          setFilterPaging(false);
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          filterPagingRef.current = false;
          setFilterPaging(false);
          setFilterPagingError(true);
        });
    }, { rootMargin: "500px 0px" });
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      controller?.abort();
    };
  }, [filteredPage, hasFilters, filterSearch, filterPagingError]);

  function select(key: FilterKey, value: string, additive: boolean) {
    setFilters((current) => ({
      ...current,
      [key]: additive
        ? current[key].includes(value)
          ? current[key].filter((selected) => selected !== value)
          : [...current[key], value]
        : current[key].length === 1 && current[key][0] === value
          ? []
          : [value],
    }));
    setFilteredPage(null);
    setFilterState("loading");
    setFilterPaging(false);
    setFilterPagingError(false);
  }

  function remove(key: FilterKey, value: string) {
    setFilters((current) => ({ ...current, [key]: current[key].filter((selected) => selected !== value) }));
    setFilteredPage(null);
    setFilterState("loading");
    setFilterPaging(false);
    setFilterPagingError(false);
  }

  function clear() {
    setFilters(emptyFilters);
    setFilteredPage(null);
    setFilterState("idle");
    setFilterPaging(false);
    setFilterPagingError(false);
  }

  return (
    <div>
      <CatalogFilterBar
        facets={predefinedFacets}
        filters={filters}
        resultCount={resultCount}
        resultsLoading={hasFilters && filterState === "loading"}
        onSelect={select}
        onRemove={remove}
        onReadyToggle={() => {
          setFilters((current) => ({ ...current, readyToShip: !current.readyToShip }));
          setFilteredPage(null);
          setFilterState("loading");
          setFilterPaging(false);
          setFilterPagingError(false);
        }}
        onClear={clear}
      />
      {hasFilters && filterState === "loading" ? (
        <div className="min-h-56 border-y border-border py-20 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground" aria-live="polite">Finding matching pieces…</div>
      ) : hasFilters && filterState === "error" ? (
        <div className="min-h-56 border-y border-border py-20 text-center text-sm text-muted-foreground" role="alert">Unable to filter pieces. <button type="button" onClick={() => { setFilterState("loading"); setFilterRetryKey((current) => current + 1); }} className="underline underline-offset-4">Try again</button></div>
      ) : products.length ? productListing : (
        <div className="border-y border-border py-20 text-center">
          <p className="font-heading text-3xl">No pieces found</p>
          <p className="mt-2 text-sm text-muted-foreground">Try a different combination of filters.</p>
          <button type="button" onClick={clear} className="mt-6 text-xs uppercase tracking-[0.16em] underline underline-offset-4">Clear filters</button>
        </div>
      )}
      <div ref={sentinelRef} className="min-h-10 pt-10 text-center" aria-live="polite">
        {!hasFilters && paging ? <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">Loading more pieces</p> : null}
        {!hasFilters && pagingError ? <button type="button" onClick={() => setPagingError(false)} className="text-xs underline underline-offset-4">Try loading more</button> : null}
        {hasFilters && filterPaging ? <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">Loading more pieces</p> : null}
        {hasFilters && filterPagingError ? <button type="button" onClick={() => setFilterPagingError(false)} className="text-xs underline underline-offset-4">Try loading more</button> : null}
      </div>
    </div>
  );
}
