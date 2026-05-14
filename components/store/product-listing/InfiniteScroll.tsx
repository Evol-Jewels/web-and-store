"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "motion/react";

interface InfiniteScrollProps {
  isLoading?: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  children?: React.ReactNode;
}

/**
 * Infinite scroll trigger component
 * Automatically triggers onLoadMore when the element comes into view
 * Trigger fires when element is 100px before entering viewport
 */
export function InfiniteScroll({
  isLoading = false,
  hasMore,
  onLoadMore,
  children,
}: InfiniteScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    // Trigger load when component comes into view and more products exist
    if (isInView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [isInView, hasMore, isLoading, onLoadMore]);

  // Don't render if no more products to load
  if (!hasMore) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="flex items-center justify-center py-8 md:py-12"
    >
      {isLoading && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-evolRed animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-evolRed animate-bounce animation-delay-100" />
          <div className="w-2 h-2 rounded-full bg-evolRed animate-bounce animation-delay-200" />
        </div>
      )}
      {children}
    </div>
  );
}
