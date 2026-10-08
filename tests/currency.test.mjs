import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
function load(file, dependencies = {}) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports, require: (name) => dependencies[name] });
  return exports;
}
const currency = load("src/lib/currency.ts");
const format = load("src/lib/format.ts", { "@/lib/currency": currency });
const rates = { INR: 1, USD: 0.01038, EUR: 0.00924, GBP: 0.00783 };
const now = Date.parse("2026-10-07T12:00:00Z");
const rows = Object.entries(rates).filter(([code]) => code !== "INR")
  .map(([quote, rate]) => ({ base: "INR", quote, rate, date: "2026-10-07" }));

test("converts the same original INR amount to each currency with decimal precision", () => {
  const money = { amount: "50573", currencyCode: "INR" };
  for (const [code, expected] of [["USD", "524.95"], ["EUR", "467.29"], ["GBP", "395.99"]]) {
    const converted = currency.convertMoney(money, code, rates);
    assert.equal(converted.amount, expected);
    assert.equal(converted.currencyCode, code);
  }
  assert.equal(money.amount, "50573");
  assert.equal(currency.convertMoney(money, "INR", rates), money);
});

test("rounds half cents once without floating point drift", () => {
  assert.equal(currency.convertMoney({ amount: "1", currencyCode: "INR" }, "USD", { ...rates, USD: 1.005 }).amount, "1.01");
  assert.equal(currency.convertMoney({ amount: "0.10", currencyCode: "INR" }, "USD", { ...rates, USD: 0.2 }).amount, "0.02");
});

test("keeps original prices when rates are unavailable or money is not INR", () => {
  const inr = { amount: "100", currencyCode: "INR" };
  const usd = { amount: "100", currencyCode: "USD" };
  assert.equal(currency.convertMoney(inr, "USD", null), inr);
  assert.equal(currency.convertMoney(usd, "EUR", rates), usd);
  assert.equal(currency.convertMoney(inr, "USD", { ...rates, USD: 0 }), inr);
});

test("accepts a complete recent response, including weekend reference rates", () => {
  assert.equal(currency.parseCurrencyRates(rows, now).rates.USD, rates.USD);
  const weekend = rows.map((row) => ({ ...row, date: "2026-10-02" }));
  assert.equal(currency.parseCurrencyRates(weekend, now).date, "2026-10-02");
});

test("rejects incomplete, old, future and invalid rate data", () => {
  assert.equal(currency.parseCurrencyRates(rows.slice(0, 2), now), null);
  for (const change of [{ date: "2026-09-20" }, { date: "2026-10-08" }, { date: "bad" }, { rate: -1 }, { rate: Infinity }, { rate: "0.01" }]) {
    assert.equal(currency.parseCurrencyRates(rows.map((row) => ({ ...row, ...change })), now), null);
  }
  assert.equal(currency.parseCurrencyRates({ rates }, now), null);
});

test("resolves supported visitor countries and validates saved preferences", () => {
  for (const [country, expected] of [["US", "USD"], ["gb", "GBP"], ["DE", "EUR"], ["IN", "INR"], ["JP", "INR"], [null, "INR"]]) {
    assert.equal(currency.currencyForCountry(country), expected);
  }
  assert.equal(currency.currencyPreference("USD"), "USD");
  assert.equal(currency.currencyPreference("JPY"), "auto");
  assert.equal(currency.currencyPreference(undefined), "auto");
});

test("formats foreign cents and retains Indian digit grouping", () => {
  assert.equal(format.formatMoney({ amount: "123456", currencyCode: "INR" }), "₹1,23,456");
  assert.equal(format.formatMoney({ amount: "524.95", currencyCode: "USD" }), "$524.95");
  assert.equal(format.formatMoney({ amount: "395.99", currencyCode: "GBP" }), "£395.99");
});
