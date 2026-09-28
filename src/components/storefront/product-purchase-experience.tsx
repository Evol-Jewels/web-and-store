"use client";

import { useEffect, useState } from "react";

import { availableInventoryForVariant } from "@/lib/inventory-availability";
import {
  imagesForSelections,
  isProductImage,
} from "@/lib/product-media";

import type {
  ProductCardData,
  ProductDetail,
  ProductVariant,
} from "@/types/product";

import { ProductActionActions } from "./product-action-actions";
import { ProductGallery } from "./product-gallery";
import { ProductInformation } from "./product-information";

function selectionsFromVariant(variant: ProductVariant | undefined) {
  return Object.fromEntries(
    variant?.selectedOptions.map(({ name, value }) => [name, value]) ?? [],
  );
}

export function ProductPurchaseExperience({
  product,
}: {
  product: ProductDetail;
}) {
  const firstVariant =
    product.variants.find(
      (variant) =>
        availableInventoryForVariant(variant, product.inventoryProducts).length >
        0,
    ) ??
    product.variants.find((variant) => variant.availableForSale) ??
    product.variants[0];
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    selectionsFromVariant(firstVariant),
  );
  const [productCard, setProductCard] = useState<ProductCardData | null>(null);
  const images = imagesForSelections(
    product.media.filter(isProductImage),
    product.options,
    product.variants,
    selections,
  );

  useEffect(() => {
    setProductCard({
      id: product.id,
      handle: product.handle,
      title: product.title,
      vendor: product.vendor,
      productType: product.productType,
      tags: product.tags,
      featuredImage: product.featuredImage,
      secondaryImage: product.secondaryImage,
      priceRange: product.priceRange,
      availableForSale: product.availableForSale,
    });
  }, [product]);

  function selectOption(name: string, value: string) {
    setSelections((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.85fr)] lg:gap-12 xl:gap-20">
      <div className="lg:hidden">
        <ProductGallery
          images={images.slice(0, 1)}
          preloadFirst
          productTitle={product.title}
        />
      </div>

      <div className="py-10 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:flex lg:h-[calc(100vh-6rem)] lg:items-[safe_center] lg:justify-center lg:self-start lg:py-6">
        <ProductInformation
          product={product}
          productCard={productCard}
          selections={selections}
          onSelectOption={selectOption}
        />
      </div>

      <div className="lg:hidden">
        <ProductGallery
          images={images.slice(1)}
          productTitle={product.title}
        />
      </div>

      <div className="hidden lg:col-start-1 lg:row-start-1 lg:block">
        <ProductGallery
          images={images}
          preloadFirst
          productTitle={product.title}
        />
      </div>
    </div>
  );
}
