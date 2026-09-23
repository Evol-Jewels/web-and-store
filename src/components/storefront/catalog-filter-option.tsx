"use client";

import { Check, PackageCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import type { FilterKey, FilterOptionData } from "@/lib/catalog-filters";

import styles from "./catalog-filter-option.module.css";
import { StoneShapeIcon } from "./stone-shape-icon";

export type OptionKind = FilterKey | "availability";

function MetalSwatch({ value, className }: { value: string; className?: string }) {
  const metalClass = value === "White gold"
    ? styles.metalWhite
    : value === "Rose gold"
      ? styles.metalRose
      : styles.metalYellow;
  return <span aria-hidden="true" className={cn(metalClass, className)} />;
}

export function CatalogFilterVisual({ kind, option, compact }: {
  kind: OptionKind;
  option: FilterOptionData;
  compact: boolean;
}) {
  if (kind === "shape") {
    return <StoneShapeIcon shape={option.value} className={compact ? "size-8" : "size-16 sm:size-[4.5rem]"} />;
  }
  if (kind === "metal") {
    return <MetalSwatch value={option.value} className={compact ? "size-8" : "size-16"} />;
  }
  if (kind === "availability") {
    return <PackageCheck aria-hidden="true" className={compact ? "size-6" : "size-10"} strokeWidth={1.1} />;
  }
  if (option.image) {
    return (
      <span className={cn("relative block overflow-hidden bg-product-surface", compact ? "size-9" : "aspect-square w-full")}>
        <Image src={option.image} alt="" fill sizes={compact ? "36px" : "(max-width: 640px) 28vw, 130px"} className="object-cover" />
      </span>
    );
  }
  return <StoneShapeIcon shape="Round" className={compact ? "size-7" : "size-16"} />;
}

export function CatalogFilterOption({
  kind, option, selected, compact = false, onSelect, onAdd,
}: {
  kind: OptionKind;
  option: FilterOptionData;
  selected: boolean;
  compact?: boolean;
  onSelect: () => void;
  onAdd: () => void;
}) {
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (clickTimer.current) clearTimeout(clickTimer.current);
  }, []);

  function handleClick(detail: number) {
    if (detail === 0) {
      onSelect();
      return;
    }
    if (detail > 1) return;
    clickTimer.current = setTimeout(onSelect, 250);
  }

  function handleDoubleClick() {
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = null;
    onAdd();
  }

  if (compact) {
    return (
      <button
        type="button"
        title={option.value}
        aria-label={option.value}
        aria-pressed={selected}
        onClick={(event) => handleClick(event.detail)}
        onDoubleClick={handleDoubleClick}
        className={cn(
          "relative flex min-h-12 shrink-0 items-center justify-center gap-2 border-b-2 px-2 text-xs transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          selected ? "border-foreground text-foreground" : "border-transparent text-muted-foreground",
          kind === "style" && "pr-3",
        )}
      >
        <CatalogFilterVisual kind={kind} option={option} compact />
        {kind === "style" || kind === "availability" ? <span className="text-foreground">{option.value}</span> : null}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={option.value}
      aria-pressed={selected}
      onClick={(event) => handleClick(event.detail)}
      onDoubleClick={handleDoubleClick}
      className={cn(
        "group relative flex min-w-0 flex-col text-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        kind === "availability" && "w-full",
      )}
    >
      <span className={cn(
        "relative flex aspect-square w-full items-center justify-center border bg-muted/35 text-foreground transition-colors group-hover:bg-muted/65",
        selected ? "border-foreground" : "border-transparent",
        kind === "availability" && "aspect-auto min-h-28",
      )}>
        <CatalogFilterVisual kind={kind} option={option} compact={false} />
        {selected ? <span className="absolute right-2 top-2 grid size-5 place-items-center bg-foreground text-background"><Check className="size-3" strokeWidth={1.5} /></span> : null}
      </span>
      <span className="mt-2 block w-full text-xs leading-4">
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>{option.value}</span>
      </span>
    </button>
  );
}
