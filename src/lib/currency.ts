import type { Money } from "@/types/product";

export const CURRENCY_COOKIE = "evol_currency";
export const currencies = [
  { code: "INR", label: "Indian Rupee", locale: "en-IN" },
  { code: "USD", label: "US Dollar", locale: "en-US" },
  { code: "EUR", label: "Euro", locale: "en-IE" },
  { code: "GBP", label: "British Pound", locale: "en-GB" },
] as const;

export type CurrencyCode = (typeof currencies)[number]["code"];
export type CurrencyPreference = CurrencyCode | "auto";
export type ExchangeRates = Record<CurrencyCode, number>;
export type CurrencyRates = { rates: ExchangeRates; date: string };

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return currencies.some(({ code }) => code === value);
}

export function currencyPreference(value: unknown): CurrencyPreference {
  return isCurrencyCode(value) ? value : "auto";
}

const euroCountries = new Set([
  "AT", "BE", "BG", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES",
]);

export function currencyForCountry(country: string | null): CurrencyCode {
  const code = country?.toUpperCase();
  if (code === "US") return "USD";
  if (code === "GB") return "GBP";
  if (code && euroCountries.has(code)) return "EUR";
  return "INR";
}

export function parseCurrencyRates(value: unknown, now = Date.now()): CurrencyRates | null {
  if (!Array.isArray(value)) return null;
  const rates: ExchangeRates = { INR: 1, USD: 0, EUR: 0, GBP: 0 };
  let oldestDate = "";
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    const { base, quote, rate, date } = row as Record<string, unknown>;
    if (base !== "INR" || !isCurrencyCode(quote) || quote === "INR") continue;
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) return null;
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
    const timestamp = Date.parse(`${date}T00:00:00Z`);
    if (!Number.isFinite(timestamp) || timestamp > now || now - timestamp > 7 * 86400000) return null;
    rates[quote] = rate;
    if (!oldestDate || date < oldestDate) oldestDate = date;
  }
  return rates.USD && rates.EUR && rates.GBP ? { rates, date: oldestDate } : null;
}

function decimalRatio(value: string) {
  if (!/^\d+(?:\.\d+)?$/.test(value)) return null;
  const [whole, fraction = ""] = value.split(".");
  if (fraction.length > 18 || whole.length > 18) return null;
  return { numerator: BigInt(whole + fraction), denominator: BigInt(10) ** BigInt(fraction.length) };
}

export function convertMoney(money: Money, currency: CurrencyCode, rates: ExchangeRates | null): Money {
  if (money.currencyCode === currency || money.currencyCode !== "INR" || !rates) return money;
  const amount = decimalRatio(money.amount);
  const rate = decimalRatio(String(rates[currency]));
  if (!amount || !rate || rate.numerator <= BigInt(0)) return money;
  const numerator = amount.numerator * rate.numerator * BigInt(100);
  const denominator = amount.denominator * rate.denominator;
  const minor = (numerator + denominator / BigInt(2)) / denominator;
  return {
    amount: `${minor / BigInt(100)}.${String(minor % BigInt(100)).padStart(2, "0")}`,
    currencyCode: currency,
  };
}
