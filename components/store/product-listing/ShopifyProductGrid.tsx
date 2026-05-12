"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import type { ShopifyProduct } from "@/lib/types";

interface ShopifyProductGridProps {
  products: ShopifyProduct[];
}

function ShopifyProductCard({
  product,
  index,
}: {
  product: ShopifyProduct;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { isInWishlist, toggle } = useWishlistStore();
  const isFavorite = isInWishlist(product.id);
  const [isHovered, setIsHovered] = useState(false);

  const price = parseInt(product.variants[0]?.price || "0");
  const firstImage = product.images[0]?.url;
  const secondImage = product.images[1]?.url;
  const imageUrl = isHovered && secondImage ? secondImage : firstImage;

  return (
    <motion.div
      ref={ref}
      initial={{ y: 16, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.6,
        ease: "easeOut",
      }}
      className="h-full"
    >
      <Link href={`/products/${product.handle}`}>
        <div className="h-full flex flex-col cursor-pointer">
          {/* Image container - 70% of card height */}
          <div
            className="relative aspect-4/5 overflow-hidden bg-evol-light-grey group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Product image */}
            {imageUrl && (
              <motion.div
                className="w-full h-full relative"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Image
                  src={imageUrl}
                  alt={product.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </motion.div>
            )}

            {/* Hover shadow */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
              whileHover={{
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}
            />

            {/* Wishlist button - visible on mobile, on hover for desktop */}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggle(product.id);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white hover:bg-gray-100 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label={
                isFavorite ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorite
                    ? "fill-evolRed text-evolRed"
                    : "text-evol-dark-grey"
                }`}
              />
            </button>
          </div>

          {/* Product info - 30% of card height */}
          <div className="flex-1 flex flex-col justify-start pt-3 md:pt-4 px-1">
            {/* Product name */}
            <h3 className="font-serif text-base md:text-lg text-gray-900 line-clamp-2">
              {product.title}
            </h3>

            {/* Price */}
            <p className="font-sans font-medium text-sm md:text-base text-gray-900 mt-2">
              ₹{price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ShopifyProductGrid({ products }: ShopifyProductGridProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-7">
      {products.map((product, index) => (
        <ShopifyProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
