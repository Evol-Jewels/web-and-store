import type { ProductDetail } from "@/types/product";

import { ProductOptions } from "./product-options";

export function ProductInformation({ product }: { product: ProductDetail }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:w-full lg:max-w-md lg:justify-self-center lg:self-start">
      <h1 className="max-w-lg font-heading text-3xl leading-tight tracking-[-0.02em] sm:text-4xl">
        {product.title}
      </h1>

      <ProductOptions
        className="mt-6"
        options={product.options}
        variants={product.variants}
      />

      <div className="mt-6 border-y border-border py-5 text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.18em]">
          Private appointments
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Discover this piece with a jewellery specialist.
        </p>
      </div>
    </aside>
  );
}
