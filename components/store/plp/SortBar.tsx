"use client";

import { ChevronDown } from "lucide-react";
import { useFilterStore, type SortOption } from "@/lib/stores/filterStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortBarProps {
  resultCount: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low-to-high", label: "Price: Low To High" },
  { value: "price-high-to-low", label: "Price: High To Low" },
];

export function SortBar({ resultCount }: SortBarProps) {
  const { filters, setSort } = useFilterStore();

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === filters.currentSort)?.label ||
    "Sort By";

  return (
    <div className="flex items-center justify-between mb-6 md:mb-8">
      <p className="font-body text-sm md:text-base text-evol-dark-grey">
        {resultCount} Pieces
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded border border-evol-grey text-evol-dark-grey hover:border-evolRed hover:shadow-sm text-sm md:text-base font-medium transition-all duration-200 bg-white">
            <span className="font-sans font-medium">
              Sort By: {currentSortLabel}
            </span>
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 md:w-64 bg-white border border-evol-grey"
        >
          <DropdownMenuLabel className="font-serif text-sm md:text-base px-3 py-2.5">
            Sort By
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setSort(option.value)}
              className={`px-3 py-2.5 text-sm md:text-base cursor-pointer transition-colors ${
                filters.currentSort === option.value
                  ? "bg-evolRed bg-opacity-10 text-evolRed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="font-body text-sm md:text-base">
                {option.label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
