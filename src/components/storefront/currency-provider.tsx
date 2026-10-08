"use client";

import { createContext, useContext, useState } from "react";
import { CURRENCY_COOKIE, currencyPreference, type CurrencyCode, type CurrencyPreference, type CurrencyRates } from "@/lib/currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  preference: CurrencyPreference;
  rateData: CurrencyRates | null;
  setPreference: (value: string | null) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  children, initialPreference, autoCurrency, rateData,
}: {
  children: React.ReactNode;
  initialPreference: CurrencyPreference;
  autoCurrency: CurrencyCode;
  rateData: CurrencyRates | null;
}) {
  const [preference, setPreferenceState] = useState(initialPreference);
  const requestedCurrency = preference === "auto" ? autoCurrency : preference;
  const currency = rateData ? requestedCurrency : "INR";

  function setPreference(value: string | null) {
    const next = currencyPreference(value);
    document.cookie = `${CURRENCY_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    setPreferenceState(next);
  }

  return (
    <CurrencyContext value={{ currency, preference, rateData, setPreference }}>
      {children}
    </CurrencyContext>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
