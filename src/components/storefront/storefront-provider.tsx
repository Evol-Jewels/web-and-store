"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";

import type { Cart, CartResponse } from "@/lib/shopify/cart/types";
import type { ProductCardData } from "@/types/product";

type StorefrontContextValue = {
  wishlist: ProductCardData[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: ProductCardData) => void;
  cart: Cart | null;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  cartPending: boolean;
  cartMessage: string | null;
  refreshCart: () => Promise<void>;
  addToCart: (merchandiseId: string, productHandle: string, quantity?: number) => Promise<boolean>;
  updateCartQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  applyDiscountCode: (code: string) => Promise<void>;
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);
const WISHLIST_STORAGE_KEY = "evol-wishlist";
const WISHLIST_CHANGE_EVENT = "evol-wishlist-change";

function readWishlist(value: string | null): ProductCardData[] {
  try {
    const saved: unknown = JSON.parse(value ?? "[]");

    if (!Array.isArray(saved)) return [];

    return saved.filter(
      (item): item is ProductCardData =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.handle === "string" &&
        typeof item.title === "string" &&
        typeof item.priceRange?.min?.amount === "string" &&
        typeof item.priceRange?.min?.currencyCode === "string",
    );
  } catch {
    return [];
  }
}

function getWishlistSnapshot() {
  try {
    return localStorage.getItem(WISHLIST_STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribeToWishlist(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(WISHLIST_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(WISHLIST_CHANGE_EVENT, onChange);
  };
}

export function StorefrontProvider({ children }: { children: React.ReactNode }) {
  const wishlist = readWishlist(useSyncExternalStore(subscribeToWishlist, getWishlistSnapshot, () => null));
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartPending, setCartPending] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  function isWishlisted(productId: string) {
    return wishlist.some((product) => product.id === productId);
  }

  function toggleWishlist(product: ProductCardData) {
    const updated = wishlist.some((item) => item.id === product.id)
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product];

    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event(WISHLIST_CHANGE_EVENT));
    } catch {
      return;
    }
  }

  async function cartRequest(url: string, init?: RequestInit) {
    const response = await fetch(url, init);
    const result = (await response.json()) as CartResponse & { error?: string };

    if (!response.ok) throw new Error(result.error || "We could not update your shopping bag.");

    setCart(result.cart);
    setCartMessage(result.warnings?.map(({ message }) => message).join(" ") || null);
    return result;
  }

  async function runCartMutation(operation: () => Promise<CartResponse>) {
    setCartPending(true);
    setCartMessage(null);

    try {
      await operation();
    } catch (error) {
      setCartMessage(
        error instanceof Error
          ? error.message
          : "We could not update your shopping bag.",
      );
      throw error;
    } finally {
      setCartPending(false);
    }
  }

  async function refreshCart() {
    setCart(null);
    setCartPending(true);
    try {
      await cartRequest("/api/cart");
    } catch (error) {
      setCartMessage(
        error instanceof Error ? error.message : "We could not load your shopping bag.",
      );
    } finally {
      setCartPending(false);
    }
  }

  async function addToCart(merchandiseId: string, productHandle: string, quantity = 1) {
    try {
      await runCartMutation(() =>
        cartRequest("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ merchandiseId, productHandle, quantity }),
        }),
      );
      setCartOpen(true);
      return true;
    } catch {
      return false;
    }
  }

  async function updateCartQuantity(lineId: string, quantity: number) {
    await runCartMutation(() =>
      cartRequest("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId, quantity }),
      }),
    ).catch(() => undefined);
  }

  async function removeFromCart(lineId: string) {
    await runCartMutation(() =>
      cartRequest("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId }),
      }),
    ).catch(() => undefined);
  }

  async function applyDiscountCode(code: string) {
    await runCartMutation(() =>
      cartRequest("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discountCode: code }),
      }),
    ).catch(() => undefined);
  }

  return (
    <StorefrontContext
      value={{
        wishlist,
        isWishlisted,
        toggleWishlist,
        cart,
        cartOpen,
        setCartOpen,
        cartPending,
        cartMessage,
        refreshCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        applyDiscountCode,
      }}
    >
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
