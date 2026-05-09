'use client';

import { useFilterStore } from '@/lib/stores/filterStore';

export function EmptyState() {
  const { clearAll } = useFilterStore();

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20">
      <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-2 md:mb-3">
        Nothing Here Yet.
      </h2>
      <p className="font-body text-sm md:text-base text-evol-dark-grey mb-6 md:mb-8">
        Try Adjusting Your Filters.
      </p>
      <button
        onClick={() => clearAll()}
        className="px-6 md:px-8 py-2 md:py-3 border-2 border-evolRed text-evolRed font-sans font-medium text-sm md:text-base rounded-full hover:bg-evolRed hover:text-white transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
