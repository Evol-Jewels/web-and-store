import { create } from 'zustand';

export type SortOption =
  | 'featured'
  | 'price-low-to-high'
  | 'price-high-to-low'
  | 'newest'
  | 'carat-high-to-low';

interface FilterState {
  categories: string[];
  shape: string[];
  priceRange: [number, number] | null;
  forWhom: string[];
  size: string[];
  occasion: string[];
  grossWeight: string[];
  currentSort: SortOption;
}

interface FilterStore {
  filters: FilterState;
  setFilter: (key: keyof FilterState, values: any) => void;
  clearAll: () => void;
  setSort: (sort: SortOption) => void;
  getFilteredProducts: (products: any[]) => any[];
  hasActiveFilters: () => boolean;
}

const initialFilters: FilterState = {
  categories: [],
  shape: [],
  priceRange: null,
  forWhom: [],
  size: [],
  occasion: [],
  grossWeight: [],
  currentSort: 'featured',
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: initialFilters,

  setFilter: (key, values) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: values,
      },
    }));
  },

  clearAll: () => {
    set({ filters: initialFilters });
  },

  setSort: (sort) => {
    set((state) => ({
      filters: {
        ...state.filters,
        currentSort: sort,
      },
    }));
  },

  getFilteredProducts: (products: any[]) => {
    const { filters } = get();
    let filtered = [...products];

    // Apply filters
    if (filters.shape.length > 0) {
      filtered = filtered.filter((p) => filters.shape.includes(p.shape));
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }

    if (filters.occasion.length > 0) {
      filtered = filtered.filter((p) => filters.occasion.includes(p.occasion));
    }

    // Apply sorting
    switch (filters.currentSort) {
      case 'price-low-to-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-to-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'carat-high-to-low':
        filtered.sort((a, b) => b.carat - a.carat);
        break;
      case 'featured':
      default:
        // Keep original order
        break;
    }

    return filtered;
  },

  hasActiveFilters: () => {
    const { filters } = get();
    return (
      filters.categories.length > 0 ||
      filters.shape.length > 0 ||
      filters.priceRange !== null ||
      filters.forWhom.length > 0 ||
      filters.size.length > 0 ||
      filters.occasion.length > 0 ||
      filters.grossWeight.length > 0
    );
  },
}));
