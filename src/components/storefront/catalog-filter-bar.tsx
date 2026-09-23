"use client";

import { Plus, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle,
} from "@/components/ui/sheet";
import {
  activeFilterCount, filterLabels, filterOrder,
  type CatalogFilters, type FilterKey, type FilterOptionData,
} from "@/lib/catalog-filters";

import { CatalogFilterOption, CatalogFilterVisual } from "./catalog-filter-option";

type Facets = Record<FilterKey, FilterOptionData[]>;

export function CatalogFilterBar({
  facets, filters, readyCount, resultCount, loading, resultsLoading, error, onSelect, onRemove, onReadyToggle, onClear, onRetry,
}: {
  facets: Facets;
  filters: CatalogFilters;
  readyCount: number;
  resultCount: number;
  loading: boolean;
  resultsLoading: boolean;
  error: boolean;
  onSelect: (key: FilterKey, value: string, additive: boolean) => void;
  onRemove: (key: FilterKey, value: string) => void;
  onReadyToggle: () => void;
  onClear: () => void;
  onRetry: () => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedCount = activeFilterCount(filters);

  return (
    <div className="mb-10 border-y border-border sm:mb-14">
      <div className="flex min-h-16 items-center justify-between gap-4 py-3 lg:hidden">
        <Button variant="outline" className="min-h-11 rounded-none px-4 text-[0.66rem] uppercase tracking-[0.16em]" onClick={() => setOpen(true)}>
          <SlidersHorizontal className="size-4" strokeWidth={1.5} />
          Filters{selectedCount ? ` (${selectedCount})` : ""}
        </Button>
        <span className="text-xs text-muted-foreground">{resultsLoading ? "Updating…" : `${resultCount.toLocaleString("en-IN")} pieces`}</span>
      </div>

      <div className="hidden items-stretch gap-5 py-5 lg:flex">
        <div className="flex min-w-0 flex-1 gap-7 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filterOrder.map((key) => facets[key].length ? (
          <div key={key} className="shrink-0 border-r border-border pr-7 last:border-0">
            <p className="mb-3 text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">{filterLabels[key]}</p>
            <div className="flex gap-2">
              {facets[key].slice(0, key === "shape" ? 5 : 3).map((option) => (
                <CatalogFilterOption key={option.value} kind={key} option={option} selected={filters[key].includes(option.value)} onSelect={() => onSelect(key, option.value, false)} onAdd={() => onSelect(key, option.value, true)} compact />
              ))}
              {facets[key].length > (key === "shape" ? 5 : 3) ? (
                <button type="button" aria-label={`More ${filterLabels[key].toLowerCase()} options`} onClick={() => setOpen(true)} className="flex min-h-12 min-w-11 items-center justify-center border-b-2 border-transparent text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"><Plus className="size-4" strokeWidth={1.3} /></button>
              ) : null}
            </div>
          </div>
        ) : null)}
        </div>
        {readyCount ? (
          <div className="shrink-0 border-l border-border pl-5">
            <p className="mb-3 text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">Availability</p>
            <CatalogFilterOption kind="availability" option={{ value: "Ready to ship", count: readyCount }} selected={filters.readyToShip} onSelect={onReadyToggle} onAdd={onReadyToggle} compact />
          </div>
        ) : null}
        <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 shrink-0 items-center gap-2 border-l border-border pl-5 text-[0.65rem] uppercase tracking-[0.16em] transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring">
          <SlidersHorizontal className="size-4" strokeWidth={1.5} /> All filters{selectedCount ? ` (${selectedCount})` : ""}
        </button>
      </div>

      {selectedCount ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-border py-3">
          {filterOrder.flatMap((key) => filters[key].map((value) => (
            <button key={`${key}:${value}`} type="button" aria-label={`Remove ${value} filter`} onClick={() => onRemove(key, value)} className="inline-flex min-h-10 items-center gap-2 border border-border px-2.5 text-xs hover:bg-muted">
              <CatalogFilterVisual kind={key} option={facets[key].find((option) => option.value === value) ?? { value, count: 0 }} compact />
              <span>{value}</span><span aria-hidden="true">×</span>
            </button>
          )))}
          {filters.readyToShip ? <button type="button" aria-label="Remove Ready to ship filter" onClick={onReadyToggle} className="inline-flex min-h-10 items-center gap-2 border border-border px-2.5 text-xs hover:bg-muted"><CatalogFilterVisual kind="availability" option={{ value: "Ready to ship", count: readyCount }} compact />Ready to ship <span aria-hidden="true">×</span></button> : null}
          <button type="button" onClick={onClear} className="min-h-9 px-2 text-xs underline underline-offset-4">Clear all</button>
          <span className="ml-auto text-xs text-muted-foreground">{resultsLoading ? "Updating pieces…" : `${resultCount.toLocaleString("en-IN")} pieces`}</span>
        </div>
      ) : null}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent showCloseButton={false} className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-[38rem]">
          <div className="flex items-center justify-between border-b border-border px-6 py-5 sm:px-8">
            <SheetTitle className="font-sans text-xs font-medium uppercase tracking-[0.2em]">Filter pieces</SheetTitle>
            <SheetClose className="min-h-11 px-2 text-[0.65rem] uppercase tracking-[0.16em] hover:text-muted-foreground">Close</SheetClose>
          </div>
          <SheetDescription className="px-6 pt-4 text-xs leading-5 sm:px-8">Select to replace. Double-click to combine options within a group.</SheetDescription>
          <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
            {loading ? <p className="text-sm text-muted-foreground">Preparing filters from the collection…</p> : null}
            {error ? <div className="flex items-center gap-4"><p className="text-sm text-muted-foreground">Filters could not load.</p><button type="button" onClick={onRetry} className="text-sm underline underline-offset-4">Try again</button></div> : null}
            {!loading && !error ? (
              <div className="space-y-8">
                {filterOrder.map((key) => facets[key].length ? (
                  <fieldset key={key} className="border-b border-border pb-8">
                    <legend className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.18em]">{filterLabels[key]}</legend>
                    <div className="grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-4">
                      {facets[key].map((option) => <CatalogFilterOption key={option.value} kind={key} option={option} selected={filters[key].includes(option.value)} onSelect={() => onSelect(key, option.value, false)} onAdd={() => onSelect(key, option.value, true)} />)}
                    </div>
                  </fieldset>
                ) : null)}
                {readyCount ? (
                  <fieldset>
                    <legend className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.18em]">Availability</legend>
                    <div className="max-w-32"><CatalogFilterOption kind="availability" option={{ value: "Ready to ship", count: readyCount }} selected={filters.readyToShip} onSelect={onReadyToggle} onAdd={onReadyToggle} /></div>
                  </fieldset>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-border bg-background px-6 py-5 sm:px-8">
            <Button variant="outline" className="h-12 rounded-none text-[0.67rem] uppercase tracking-[0.16em]" onClick={onClear} disabled={!selectedCount}>Clear filters</Button>
            <Button variant="luxury" className="h-12 rounded-none text-[0.67rem]" onClick={() => setOpen(false)} disabled={loading || error || resultsLoading}>{resultsLoading ? "Updating pieces" : `View ${resultCount.toLocaleString("en-IN")} pieces`}</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
