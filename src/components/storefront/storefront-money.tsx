"use client";

import { convertMoney } from "@/lib/currency";
import { formatMoney } from "@/lib/format";
import type { Money } from "@/types/product";
import { useCurrency } from "./currency-provider";

export function StorefrontMoney({ money }: { money: Money }) {
  const { currency, rateData } = useCurrency();
  const converted = convertMoney(money, currency, rateData?.rates ?? null);
  const approximate = converted.currencyCode !== money.currencyCode;
  return (
    <span title={approximate ? `Approximate price · ${formatMoney(money)} at checkout` : undefined}>
      {formatMoney(converted)}
    </span>
  );
}

export function CurrencyNotice() {
  const { currency } = useCurrency();
  if (currency === "INR") return null;
  return (
    <p className="mt-3 text-xs leading-5 text-muted-foreground">
      Converted prices are approximate. Checkout is charged in INR.
    </p>
  );
}
