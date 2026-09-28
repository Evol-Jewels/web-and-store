import type { ProductDetail } from "@/types/product";
import type { ProductCardData } from "@/types/product";
import { availableInventoryForVariant, variantMatchesSelections } from "@/lib/inventory-availability";

import { ProductActionActions } from "./product-action-actions";
import { ProductOptions } from "./product-options";

export function ProductInformation({
  product,
  productCard,
  selections,
  onSelectOption,
}: {
  product: ProductDetail;
  productCard: ProductCardData | null;
  selections: Record<string, string>;
  onSelectOption: (name: string, value: string) => void;
}) {
  const selectedVariant = product.variants.find((variant) =>
    variantMatchesSelections(variant, selections),
  );
  const canTryAtHome = selectedVariant
    ? availableInventoryForVariant(selectedVariant, product.inventoryProducts).length > 0
    : false;

  return (
    <aside className="w-full lg:max-w-md">
      <h1 className="max-w-lg font-heading text-3xl leading-tight tracking-[-0.02em] sm:text-4xl">
        {product.title}
      </h1>

      <ProductOptions
        className="mt-6"
        options={product.options}
        variants={product.variants}
        inventoryProducts={product.inventoryProducts}
        selections={selections}
        onSelectOption={onSelectOption}
        productCard={productCard}
      />

      <ProductActionActions
        className="mt-6"
        productTitle={product.title}
        productHandle={product.handle}
        variantId={selectedVariant?.id ?? null}
        canTryAtHome={canTryAtHome}
      />
    </aside>
  );
}
