"use client";

import { useState } from "react";

import type {
  ProductDetail,
  ProductImage,
  ProductOption,
  ProductVariant,
} from "@/types/product";

import { ProductGallery } from "./product-gallery";
import { ProductInformation } from "./product-information";

const IMAGES_PER_COLOUR = 4;

function isColourOption(option: ProductOption) {
  const name = option.name.toLowerCase();
  return name.includes("color") || name.includes("colour");
}

function selectionsFromVariant(variant: ProductVariant | undefined) {
  return Object.fromEntries(
    variant?.selectedOptions.map(({ name, value }) => [name, value]) ?? [],
  );
}

function imagesForSelections(
  images: ProductImage[],
  options: ProductOption[],
  selections: Record<string, string>,
) {
  const colourOption = options.find(isColourOption);
  if (!colourOption) return images;

  const selectedColour = selections[colourOption.name];
  const colourIndex = Math.max(
    colourOption.values.indexOf(selectedColour),
    0,
  );
  const start = colourIndex * IMAGES_PER_COLOUR;
  const selectedImages = images.slice(start, start + IMAGES_PER_COLOUR);

  return selectedImages.length > 0
    ? selectedImages
    : images.slice(0, IMAGES_PER_COLOUR);
}

export function ProductPurchaseExperience({
  product,
}: {
  product: ProductDetail;
}) {
  const firstVariant =
    product.variants.find((variant) => variant.availableForSale) ??
    product.variants[0];
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    selectionsFromVariant(firstVariant),
  );
  const images = imagesForSelections(
    product.media,
    product.options,
    selections,
  );

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
