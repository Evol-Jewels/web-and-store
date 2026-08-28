import type {
  InventoryProduct,
  ProductVariant,
} from "@/types/product";

function optionValue(
  variant: ProductVariant,
  namePattern: RegExp,
) {
  return variant.selectedOptions.find(({ name }) => namePattern.test(name))
    ?.value;
}

function variantPurity(variant: ProductVariant) {
  const namedValue = optionValue(variant, /purity|karat|metal/i);
  const source = namedValue ?? variant.selectedOptions.map(({ value }) => value).join(" ");
  const match = source.match(/(?:^|\D)(14|18|22|24)\s*K(?:T)?(?:\D|$)/i);

  return match ? Number(match[1]) : null;
}

function variantColor(variant: ProductVariant) {
  const namedValue = optionValue(variant, /colou?r|metal/i);
  const source = (
    namedValue ?? variant.selectedOptions.map(({ value }) => value).join(" ")
  ).toLowerCase();

  if (source.includes("white")) return "WHITE";
  if (source.includes("rose") || source.includes("pink")) return "ROSE";
  if (source.includes("yellow")) return "YELLOW";

  return null;
}

export function variantMatchesSelections(
  variant: ProductVariant,
  selections: Record<string, string>,
) {
  return variant.selectedOptions.every(
    ({ name, value }) => selections[name] === value,
  );
}

export function availableInventoryForVariant(
  variant: ProductVariant,
  inventoryProducts: InventoryProduct[] | null | undefined,
) {
  const purity = variantPurity(variant);
  const color = variantColor(variant);

  if (
    purity === null ||
    color === null ||
    !Array.isArray(inventoryProducts)
  ) {
    return [];
  }

  return inventoryProducts.filter(
    (product) =>
      product.status === "AVAILABLE" &&
      product.purity === purity &&
      product.color === color,
  );
}
