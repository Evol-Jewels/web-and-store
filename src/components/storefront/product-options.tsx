"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

function materialSwatchClass(value: string) {
  const material = value.toLowerCase();

  if (material.includes("white") || material.includes("silver")) {
    return "bg-[linear-gradient(135deg,#7e7e7b_0%,#efefeb_40%,#92928f_65%,#fafaf8_100%)]";
  }

  if (material.includes("rose") || material.includes("pink")) {
    return "bg-[linear-gradient(135deg,#a36b5d_0%,#f4d5c9_40%,#b87a69_65%,#f6ddd3_100%)]";
  }

  return "bg-[linear-gradient(135deg,#8c632e_0%,#f4e4b8_38%,#b27d35_65%,#f8e9bd_100%)]";
}

export function ProductOptions({
  className,
  options,
  variants,
}: {
  className?: string;
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
    <div className={cn("space-y-6", className)}>
      {selectedVariant ? (
        <p className="text-lg font-medium tracking-[-0.01em]">
          {formatMoney(selectedVariant.price)}
        </p>
      ) : null}

      {visibleOptions.map((option) => {
        const optionName = option.name.toLowerCase();
        const isMaterial =
          optionName.includes("color") ||
          optionName.includes("colour");
        const isSize = optionName.includes("size");

        if (isMaterial) {
          return (
            <fieldset key={option.id}>
              <legend className="sr-only">{option.name}</legend>
              <div className="flex flex-wrap gap-3">
                {option.values.map((value) => {
                  const selected = selections[option.name] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-label={value}
                      aria-pressed={selected}
                      onClick={() => selectOption(option.name, value)}
                      className="grid size-11 place-items-center rounded-full border border-transparent transition-colors hover:border-foreground/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-foreground"
                    >
                      <span
                        className={cn(
                          "size-8 rounded-full border border-foreground/10",
                          materialSwatchClass(value),
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.16em]">
                {selections[option.name]}
              </p>
            </fieldset>
          );
        }

        if (isSize) {
          return (
            <label key={option.id} className="block">
              <span className="mb-2 block text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
                {option.name}
              </span>
              <span className="relative block">
                <select
                  value={selections[option.name]}
                  onChange={(event) =>
                    selectOption(option.name, event.target.value)
                  }
                  className="h-13 w-full appearance-none rounded-none border border-border bg-background px-4 pr-12 text-sm outline-none transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  {option.values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2"
                />
              </span>
            </label>
          );
        }

        return (
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
                    className="min-h-11 min-w-14 border border-border px-4 py-2.5 text-xs transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}

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
