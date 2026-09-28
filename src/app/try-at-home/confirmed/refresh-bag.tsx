"use client";

import { useEffect, useRef } from "react";

import { useStorefront } from "@/components/storefront/storefront-provider";

export function RefreshBag() {
  const { refreshCart } = useStorefront();
  const refreshed = useRef(false);

  useEffect(() => {
    if (refreshed.current) return;
    refreshed.current = true;
    void refreshCart();
  }, [refreshCart]);

  return null;
}
