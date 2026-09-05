import Image from "next/image";

import type { ProductImage } from "@/types/product";

export function ProductGallery({
  images,
  preloadFirst = false,
  productTitle,
}: {
  images: ProductImage[];
  preloadFirst?: boolean;
  productTitle: string;
}) {
  if (images.length === 0) {
    return (
      <div className="grid aspect-[4/5] place-items-center rounded-md bg-product-surface text-xs uppercase tracking-[0.24em] text-muted-foreground">
        Evol
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {images.map((image, index) => (
        <figure key={image.id} className="overflow-hidden rounded-md bg-product-surface">
          <Image
            src={image.url}
            alt={image.altText || productTitle}
            width={image.width}
            height={image.height}
            preload={preloadFirst && index === 0}
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="h-auto w-full"
          />
        </figure>
      ))}
    </div>
  );
}
