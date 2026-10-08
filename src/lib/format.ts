import type { Money } from "@/types/product";
import { currencies } from "@/lib/currency";

export function formatMoney(money: Money) {
  const locale = currencies.find(({ code }) => code === money.currencyCode)?.locale ?? "en-IN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: money.currencyCode === "INR" ? 0 : 2,
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
