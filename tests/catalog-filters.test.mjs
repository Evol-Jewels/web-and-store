import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");

function load(relativePath, dependencies, globals = {}) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, URLSearchParams, AbortController, DOMException, Set, ...globals,
    require(name) {
      return name in dependencies ? dependencies[name] : require(name);
    },
  });
  return exports;
}

const config = load("src/lib/catalog-filters.ts", {});
const gridPath = "src/components/storefront/infinite-product-grid.tsx";

function harness() {
  const states = [];
  const calls = [];
  let cursor = 0;
  let effects = [];
  const grid = load(gridPath, {
    "@/lib/catalog-filters": config,
    "./catalog-filter-bar": { CatalogFilterBar: "filters" },
    "./collection-grid-feature": { CollectionGridFeature: "feature" },
    "./product-grid": { ProductGrid: "products" },
    react: {
      useState(initial) {
        const index = cursor++;
        if (!(index in states)) states[index] = initial;
        return [states[index], (next) => { states[index] = typeof next === "function" ? next(states[index]) : next; }];
      },
      useRef: () => ({ current: null }),
      useMemo: (fn) => fn(),
      useEffect: (fn) => effects.push(fn),
    },
  }, {
    fetch: async (url) => {
      calls.push(url);
      return Response.json({ products: [{ id: "kite" }], totalProducts: 1, pageInfo: { hasNextPage: false, endCursor: null } });
    },
  });
  return {
    calls,
    render() {
      cursor = 0;
      effects = [];
      const tree = grid.InfiniteProductGrid({
        collectionHandle: "rings",
        initialProducts: [{ id: "initial" }],
        initialPageInfo: { hasNextPage: false, endCursor: null },
        initialTotalProducts: 80,
      });
      for (const effect of effects) effect();
      return tree.props.children[0].props;
    },
  };
}

test("collection filters are immediately available without fetching a catalog snapshot", () => {
  const grid = harness();
  const filters = grid.render();
  assert.equal(grid.calls.length, 0);
  assert.equal(filters.facets, config.predefinedFacets);
  assert.equal(filters.facets.shape.length, 12);
  assert.equal(filters.resultCount, 80);
});

test("Kite requests collection-scoped results and clearing restores the initial catalog without a scan", async () => {
  const grid = harness();
  grid.render().onSelect("shape", "Kite", false);
  assert.equal(grid.render().resultsLoading, true);
  assert.deepEqual(grid.calls, ["/api/products/filtered?collection=rings&shape=Kite"]);
  await new Promise((resolve) => setImmediate(resolve));
  const results = grid.render();
  assert.equal(results.resultCount, 1);
  results.onClear();
  const restored = grid.render();
  assert.equal(restored.resultCount, 80);
  assert.equal(restored.filters.shape.length, 0);
  assert.ok(grid.calls.every((url) => url.startsWith("/api/products/filtered?")));
});

test("all predefined shapes have local self-contained Shopify icons", () => {
  for (const { value } of config.predefinedFacets.shape) {
    const svg = fs.readFileSync(path.join(root, "public/images/shapes", `${value.toLowerCase()}.svg`), "utf8");
    assert.match(svg, /<svg\b/);
    assert.doesNotMatch(svg, /<script\b|(?:href|src)=["']https?:/i);
  }
});
