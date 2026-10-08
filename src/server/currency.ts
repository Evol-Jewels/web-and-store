import "server-only";

import { cookies, headers } from "next/headers";
import { CURRENCY_COOKIE, currencyForCountry, currencyPreference, parseCurrencyRates } from "@/lib/currency";

export async function getCurrencySettings() {
  const [cookieStore, requestHeaders, rateData] = await Promise.all([
    cookies(),
    headers(),
    getCurrencyRates(),
  ]);
  return {
    initialPreference: currencyPreference(cookieStore.get(CURRENCY_COOKIE)?.value),
    autoCurrency: currencyForCountry(
      requestHeaders.get("x-vercel-ip-country") ?? requestHeaders.get("cf-ipcountry"),
    ),
    rateData,
  };
}

async function getCurrencyRates() {
  try {
    const response = await fetch("https://api.frankfurter.dev/v2/rates?base=INR&quotes=USD,EUR,GBP", {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    return parseCurrencyRates(await response.json());
  } catch {
    return null;
  }
}
