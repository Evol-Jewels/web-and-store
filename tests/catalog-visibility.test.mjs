import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));

class CatalogApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function load(relativePath, dependencies) {
  const source = fs.readFileSync(path.join(testDirectory, "..", relativePath), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, Request, Response, URL, URLSearchParams, Set, Promise, AbortController,
    process: { env: {} }, fetch: dependencies.fetch,
    setTimeout: dependencies.setTimeout ?? setTimeout,
    require(name) {
      if (name === "server-only") return {};
      if (name === "react") return { cache: (fn) => fn, ...dependencies.react };
      if (name in dependencies) return dependencies[name];
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return exports;
}

const publicCollection = { id: "rings", handle: "rings", title: "Rings", image: null };
const internal = { id: "internal", handle: "globofilter-best-selling-products-index", title: "Renamed index" };
const hidden = { id: "hidden", handle: "hidden", title: "Hidden" };
const publicProduct = { id: "public", handle: "public", title: "Public", variants: [] };
const copy = (value) => JSON.parse(JSON.stringify(value));

test("collection visibility includes live collections without images and excludes internal and unpublished memberships", async () => {
  let detailReads = 0;
  const service = load("src/server/catalog/catalog.service.ts", {
    "@/api/catalog.client": { CatalogApiError },
    "@/lib/catalog": { productCategories: [{ slug: "rings" }, { slug: "hidden" }] },
    "./catalog.repository": {
      findCollections: async (first, after) => ({
        collections: after ? [publicCollection] : [internal],
        pageInfo: { hasNextPage: !after, endCursor: after ? null : "next" },
      }),
      findProductByHandle: async () => ({ collections: [internal, hidden, publicCollection] }),
      findCollectionByHandle: async (handle, first, after) => {
        detailReads++;
        return { ...publicCollection, handle, first, after };
      },
    },
  });
  assert.deepEqual(copy(await service.listAllCollections()), [publicCollection]);
  assert.deepEqual(copy(await service.listPublicCategories()), [{ slug: "rings" }]);
  assert.equal(await service.getCollectionDetails(internal.handle), null);
  assert.equal(await service.getCollectionDetails(hidden.handle), null);
  assert.equal(detailReads, 0);
  assert.equal((await service.getCollectionDetails("rings", 24, "later")).after, "later");
  assert.deepEqual(copy((await service.getProductDetails("product")).collections), [publicCollection]);
});

test("catalog GET retries a transient gateway error once without caching results", async () => {
  const statuses = [502, 200, 404, 503, 503];
  const calls = [];
  const client = load("src/api/catalog.client.ts", {
    setTimeout: (callback) => callback(),
    fetch: async (url, options) => {
      calls.push({ url, options });
      const status = statuses.shift();
      return Response.json({ collections: [], pageInfo: {} }, { status });
    },
  });
  assert.deepEqual(copy((await client.getCollections()).collections), []);
  assert.equal(calls.length, 2);
  assert.ok(calls[1].options.signal instanceof AbortSignal);
  await assert.rejects(client.getCollections(), { status: 404 });
  assert.equal(calls.length, 3);
  await assert.rejects(client.getCollections(), { status: 503 });
  assert.equal(calls.length, 5);
  assert.ok(calls.every((call) => call.options.cache === "no-store"));
});

test("simultaneous collection checks share only the in-flight request and recheck publication afterwards", async () => {
  let reads = 0;
  let resolvePage;
  const service = load("src/server/catalog/catalog.service.ts", {
    "@/api/catalog.client": { CatalogApiError },
    "@/lib/catalog": { productCategories: [] },
    "./catalog.repository": {
      findCollections: () => {
        reads++;
        return new Promise((resolve) => { resolvePage = resolve; });
      },
    },
  });
  const first = service.listAllCollections();
  const second = service.listAllCollections();
  assert.equal(reads, 1);
  resolvePage({ collections: [publicCollection], pageInfo: {} });
  assert.deepEqual(copy(await first), [publicCollection]);
  assert.deepEqual(copy(await second), [publicCollection]);
  const next = service.listAllCollections();
  assert.equal(reads, 2);
  resolvePage({ collections: [], pageInfo: {} });
  assert.deepEqual(copy(await next), []);
});

test("collection outages hide optional links but remain errors for required collection pages", async () => {
  let failing = true;
  const service = load("src/server/catalog/catalog.service.ts", {
    "@/api/catalog.client": { CatalogApiError },
    "@/lib/catalog": { productCategories: [{ slug: "rings" }] },
    "./catalog.repository": {
      findCollections: async () => {
        if (failing) throw new CatalogApiError("Unavailable", 502);
        return { collections: [publicCollection], pageInfo: {} };
      },
      findProductByHandle: async () => ({ ...publicProduct, collections: [publicCollection] }),
      findCollectionByHandle: async () => publicCollection,
    },
  });
  assert.deepEqual(copy(await service.listPublicCategories()), []);
  assert.deepEqual(copy(await service.listOptionalCollections()), []);
  assert.deepEqual(copy((await service.getProductDetails("public")).collections), []);
  assert.equal(await service.getSugarRushFeature(), undefined);
  await assert.rejects(service.getCollectionDetails("rings"), { status: 502 });
  failing = false;
  assert.deepEqual(copy(await service.listPublicCategories()), [{ slug: "rings" }]);
  assert.equal((await service.getCollectionDetails("rings")).handle, "rings");
});

test("fresh product checks discard cached hidden results and propagate outages", async () => {
  const service = load("src/server/catalog/product-visibility.ts", {
    "@/api/catalog.client": { CatalogApiError },
    "./catalog.repository": {
      findProductByHandle: async (handle) => {
        if (handle === "hidden") throw new CatalogApiError("Not found", 404);
        if (handle === "outage") throw new CatalogApiError("Unavailable", 503);
        return publicProduct;
      },
    },
  });
  assert.deepEqual(copy(await service.filterPublicProducts([hidden, publicProduct])), [publicProduct]);
  const saved = await service.getPublicProductCards(["hidden", "public", "public"]);
  assert.deepEqual(copy(saved.map((product) => product.handle)), ["public"]);
  assert.equal("variants" in saved[0], false);
  await assert.rejects(service.getPublicProduct("outage"), { status: 503 });
});

test("collection product API returns an outage response instead of misreporting not found", async () => {
  const route = load("src/app/api/products/route.ts", {
    "@/server/catalog/catalog.repository": {},
    "@/server/catalog/catalog.service": {
      getCollectionDetails: async (handle) => {
        if (handle === "hidden") return null;
        throw new CatalogApiError("Unavailable", 502);
      },
    },
  });
  assert.equal((await route.GET(new Request("http://localhost/api?collection=hidden"))).status, 404);
  const response = await route.GET(new Request("http://localhost/api?collection=rings"));
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("filtered requests reject hidden collection and ready-to-ship shortcuts before loading products", async () => {
  let reads = 0;
  const route = load("src/app/api/products/filtered/route.ts", {
    "@/api/catalog.client": { getFilteredProducts: async () => { reads++; return { products: [hidden, publicProduct], pageInfo: { endCursor: "24" } }; } },
    "@/server/catalog/catalog.service": { listAllCollections: async () => [publicCollection] },
    "@/server/catalog/product-visibility": { filterPublicProducts: async (products) => products.filter((product) => product.handle !== "hidden") },
  });
  for (const query of ["collection=hidden", "readyToShip=true"]) {
    assert.equal((await route.GET(new Request(`http://localhost/api?${query}`))).status, 404);
  }
  assert.equal(reads, 0);
  const response = await route.GET(new Request("http://localhost/api?collection=rings"));
  const page = await response.json();
  assert.deepEqual(page.products, [publicProduct]);
  assert.equal(page.pageInfo.endCursor, "24");
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("filter snapshots reject hidden collections and work when ready-to-ship is unpublished", async () => {
  let reads = 0;
  const route = load("src/app/api/products/filter-catalog/route.ts", {
    "@/server/catalog/catalog.service": { listAllCollections: async () => [publicCollection] },
    "@/server/catalog/catalog.repository": {
      findProducts: async () => { reads++; return { products: [publicProduct], pageInfo: {} }; },
      findCollectionByHandle: async () => { reads++; return { products: [publicProduct], pageInfo: {} }; },
    },
  });
  assert.equal((await route.GET(new Request("http://localhost/api?collection=hidden"))).status, 404);
  assert.equal(reads, 0);
  const response = await route.GET(new Request("http://localhost/api"));
  assert.deepEqual(await response.json(), { products: [publicProduct], readyProductIds: [] });
});

test("wishlist lookup validates input and never falls back to saved product data", async () => {
  let reads = 0;
  const route = load("src/app/api/products/visible/route.ts", {
    "@/server/catalog/product-visibility": { getPublicProductCards: async () => { reads++; return []; } },
  });
  const request = (handles) => new Request("http://localhost/api", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ handles }),
  });
  assert.equal((await route.POST(request(["../hidden"]))).status, 400);
  assert.equal((await route.POST(request(Array(101).fill("public")))).status, 400);
  assert.equal(reads, 0);
  assert.deepEqual(await (await route.POST(request(["hidden"]))).json(), { products: [] });
});

test("bag refresh removes hidden lines before returning bag data", async () => {
  const lines = ["public", "hidden"].map((handle) => ({ id: handle, merchandise: { product: { handle } } }));
  const cart = { id: "cart", lines: { nodes: lines }, totalQuantity: 2 };
  const calls = [];
  const server = load("src/lib/shopify/cart/server.ts", {
    "./queries": { CART_QUERY: "get", CART_LINES_REMOVE: "remove" },
    "../storefront/client": {
      ShopifyStorefrontError: Error,
      storefrontRequest: async ({ query, variables }) => {
        calls.push({ query, variables });
        return query === "get" ? { cart } : {
          cartLinesRemove: { cart: { ...cart, lines: { nodes: [lines[0]] }, totalQuantity: 1 }, userErrors: [], warnings: [] },
        };
      },
    },
    "@/server/catalog/product-visibility": { getPublicProduct: async (handle) => handle === "public" ? publicProduct : null },
  });
  const result = await server.getCart("cart");
  assert.deepEqual(copy(result.lines.nodes), [lines[0]]);
  assert.deepEqual(copy(calls[1].variables.lineIds), ["hidden"]);
});

test("bag checks fail closed during catalog outages without removing valid lines", async () => {
  let mutations = 0;
  const server = load("src/lib/shopify/cart/server.ts", {
    "./queries": { CART_QUERY: "get" },
    "../storefront/client": {
      ShopifyStorefrontError: Error,
      storefrontRequest: async ({ query }) => {
        if (query !== "get") mutations++;
        return { cart: { lines: { nodes: [{ merchandise: { product: { handle: "public" } } }] } } };
      },
    },
    "@/server/catalog/product-visibility": { getPublicProduct: async () => { throw new CatalogApiError("Unavailable", 503); } },
  });
  await assert.rejects(server.getCart("cart"), { status: 503 });
  assert.equal(mutations, 0);
});

test("bag additions reject hidden products and variants belonging to another product", async () => {
  let mutations = 0;
  const route = load("src/app/api/cart/route.ts", {
    "next/headers": { cookies: async () => ({ get: () => undefined, set: () => {} }) },
    "next/server": { NextResponse: { json: Response.json } },
    "@/lib/shopify/cart/cookie": {},
    "@/lib/shopify/cart/limits": { MAX_BAG_ITEMS: 5 },
    "@/lib/shopify/cart/server": {
      normalizeVariantId: (id) => `gid://shopify/ProductVariant/${id}`,
      createCart: async () => { mutations++; return { cart: { id: "cart" } }; },
    },
    "@/lib/shopify/storefront/client": { ShopifyStorefrontError: Error },
    "@/server/catalog/product-visibility": {
      getPublicProduct: async (handle) => handle === "hidden" ? null : { variants: [{ id: "101" }] },
    },
  });
  const request = (productHandle, merchandiseId) => new Request("http://localhost/api/cart", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productHandle, merchandiseId, quantity: 1 }),
  });
  assert.equal((await route.POST(request("hidden", "101"))).status, 400);
  assert.equal((await route.POST(request("public", "202"))).status, 400);
  assert.equal(mutations, 0);
  assert.equal((await route.POST(request("public", "101"))).status, 200);
  assert.equal(mutations, 1);
});
