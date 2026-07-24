"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import type { ProductOption, ProductVariant } from "@/types/product";

function selectionsFromVariant(variant: ProductVariant | undefined) {
  return Object.fromEntries(
    variant?.selectedOptions.map(({ name, value }) => [name, value]) ?? [],
  );
}

function matchesSelections(
  variant: ProductVariant,
  selections: Record<string, string>,
) {
  return variant.selectedOptions.every(
    ({ name, value }) => selections[name] === value,
  );
}

export function ProductOptions({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const firstVariant =
    variants.find((variant) => variant.availableForSale) ?? variants[0];
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    selectionsFromVariant(firstVariant),
  );
  const selectedVariant = variants.find((variant) =>
    matchesSelections(variant, selections),
  );
  const available = selectedVariant?.availableForSale ?? false;
  const visibleOptions = options.filter(
    (option) =>
      option.name.toLowerCase() !== "title" ||
      option.values.some((value) => value !== "Default Title"),
  );

  function selectOption(name: string, value: string) {
    setSelections((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="space-y-8">
      {visibleOptions.map((option) => (
        <fieldset key={option.id}>
          <legend className="mb-3 text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
            {option.name}
          </legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const selected = selections[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectOption(option.name, value)}
                  className="min-h-11 min-w-14 border border-border px-4 py-2.5 text-xs transition-colors hover:border-foreground aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      {selectedVariant ? (
        <p className="font-heading text-2xl">
          {formatMoney(selectedVariant.price)}
        </p>
      ) : null}

      <div>
        <Button
          type="button"
          variant="luxury"
          size="lg"
          disabled
          className="h-13 w-full rounded-none disabled:opacity-100"
        >
          {available ? "Add to bag" : "Currently unavailable"}
        </Button>
        <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
          Online purchasing will be available soon.
        </p>
      </div>
    </div>
  );
}
