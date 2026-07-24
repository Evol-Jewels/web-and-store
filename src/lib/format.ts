import type { Money } from "@/types/product";

export function formatMoney(money: Money) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(money.amount));
}

export function formatPriceRange({
  min,
  max,
}: {
  min: Money;
  max: Money;
}) {
  if (min.amount === max.amount) return formatMoney(min);
  return `${formatMoney(min)} – ${formatMoney(max)}`;
}
