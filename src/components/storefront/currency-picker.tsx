"use client";

import { Globe2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currencies } from "@/lib/currency";
import { useCurrency } from "./currency-provider";

export function CurrencyPicker() {
  const { currency, preference, rateData, setPreference } = useCurrency();
  return (
    <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-5 z-40 sm:bottom-[calc(1.75rem+env(safe-area-inset-bottom))] sm:left-7">
      <Select value={currency} onValueChange={setPreference}>
        <SelectTrigger
          aria-label={`Display currency: ${currency}${preference === "auto" ? ", automatic" : ""}`}
          className="min-w-28 rounded-none border-border bg-background px-3 text-foreground data-[size=default]:h-11"
        >
          <Globe2 className="size-4" strokeWidth={1.25} />
          <SelectValue>{currency}</SelectValue>
        </SelectTrigger>
        <SelectContent side="top" align="start" alignItemWithTrigger={false} className="min-w-60 rounded-none p-1 shadow-none">
          {currencies.map(({ code, label }) => (
            <SelectItem key={code} value={code} disabled={!rateData && code !== "INR"} className="min-h-11 rounded-none px-3">
              {label} ({code})
            </SelectItem>
          ))}
          {!rateData ? (
            <p role="status" className="px-3 py-2 text-xs leading-5 text-muted-foreground">Conversion is temporarily unavailable. Prices are shown in INR.</p>
          ) : null}
        </SelectContent>
      </Select>
    </div>
  );
}
