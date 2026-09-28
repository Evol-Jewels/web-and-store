import "server-only";

import { availableInventoryForVariant } from "@/lib/inventory-availability";
import { normalizeVariantId } from "@/lib/shopify/cart/server";
import type { Cart } from "@/lib/shopify/cart/types";
import { getProductDetails } from "@/server/catalog/catalog.service";

export async function canRequestTryAtHome(cart: Cart) {
  const products = await Promise.all(
    cart.lines.nodes.map((line) => getProductDetails(line.merchandise.product.handle)),
  );

  return cart.lines.nodes.every((line, index) => {
    const product = products[index];
    const variant = product?.variants.find(
      ({ id }) => normalizeVariantId(id) === line.merchandise.id,
    );
    return Boolean(
      variant &&
        availableInventoryForVariant(variant, product.inventoryProducts).length >= line.quantity,
    );
  });
}
