import { create } from 'zustand';

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  metal: string;
  carat: number;
  size: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  add: (item: CartItem) => void;
  remove: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  isInCart: (productId: string) => boolean;
  total: () => number;
  setOpen: (open: boolean) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  add: (item: CartItem) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return {
        items: [...state.items, item],
      };
    });
  },

  remove: (productId: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    }));
  },

  updateQty: (productId: string, qty: number) => {
    if (qty <= 0) {
      get().remove(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity: qty } : i
      ),
    }));
  },

  clear: () => {
    set({ items: [] });
  },

  isInCart: (productId: string) => {
    return get().items.some((i) => i.productId === productId);
  },

  total: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  setOpen: (open: boolean) => {
    set({ isOpen: open });
  },
}));
