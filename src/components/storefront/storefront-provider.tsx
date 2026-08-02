"use client";

import { createContext, useContext, useState } from "react";

import type { ProductCardData } from "@/types/product";

type StorefrontContextValue = {
  wishlist: ProductCardData[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: ProductCardData) => void;
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<ProductCardData[]>([]);

  function isWishlisted(productId: string) {
    return wishlist.some((product) => product.id === productId);
  }

  function toggleWishlist(product: ProductCardData) {
    setWishlist((current) =>
      current.some((item) => item.id === product.id)
        ? current.filter((item) => item.id !== product.id)
        : [...current, product],
    );
  }

  return (
    <StorefrontContext value={{ wishlist, isWishlisted, toggleWishlist }}>
      {children}
    </StorefrontContext>
  );
}

export function useStorefront() {
  const context = useContext(StorefrontContext);

  if (!context) {
    throw new Error("useStorefront must be used within StorefrontProvider");
  }

  return context;
}
