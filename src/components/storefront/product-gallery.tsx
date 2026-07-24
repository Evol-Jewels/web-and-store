import Image from "next/image";

import type { ProductImage } from "@/types/product";

export function ProductGallery({
  images,
  productTitle,
}: {
  images: ProductImage[];
  productTitle: string;
}) {
  const visibleImages = images.slice(0, 8);

  if (visibleImages.length === 0) {
    return (
      <div className="grid aspect-[4/5] place-items-center bg-product-surface text-xs uppercase tracking-[0.24em] text-muted-foreground">
        Evol
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {visibleImages.map((image, index) => (
        <div
          key={image.id}
          className={`relative overflow-hidden bg-product-surface ${
            index === 0 ? "aspect-[4/5] sm:col-span-2 sm:aspect-[8/7]" : "aspect-[4/5]"
          }`}
        >
          <Image
            src={image.url}
            alt={image.altText || productTitle}
            fill
            priority={index === 0}
            sizes={
              index === 0
                ? "(max-width: 1024px) 100vw, 62vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 31vw"
            }
            className="object-contain p-[6%]"
          />
        </div>
      ))}
    </div>
  );
}
