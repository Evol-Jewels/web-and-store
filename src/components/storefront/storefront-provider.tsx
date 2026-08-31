"use client";

import { createContext, useContext, useState } from "react";

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
  addToCart: (merchandiseId: string, quantity?: number) => Promise<boolean>;
  updateCartQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  applyDiscountCode: (code: string) => Promise<void>;
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<ProductCardData[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartPending, setCartPending] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

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

  async function addToCart(merchandiseId: string, quantity = 1) {
    try {
      await runCartMutation(() =>
        cartRequest("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ merchandiseId, quantity }),
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
