import "server-only";

type GraphqlError = {
  message: string;
};

type GraphqlResponse<T> = {
  data?: T;
  errors?: GraphqlError[];
};

function storefrontConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  const version = process.env.SHOPIFY_STOREFRONT_API_VERSION;

  if (!domain || !token || !version) {
    throw new Error("Shopify Storefront API environment variables are not configured.");
  }

  return { domain, token, version };
}

export class ShopifyStorefrontError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyStorefrontError";
  }
}

export async function storefrontRequest<T>({
  query,
  variables,
  buyerIp,
}: {
  query: string;
  variables?: Record<string, unknown>;
  buyerIp?: string | null;
}) {
  const { domain, token, version } = storefrontConfig();
  const headers = new Headers({
    "Content-Type": "application/json",
    "Shopify-Storefront-Private-Token": token,
  });

  if (buyerIp) headers.set("Shopify-Storefront-Buyer-IP", buyerIp);

  const response = await fetch(
    `https://${domain}/api/${version}/graphql.json`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new ShopifyStorefrontError(
      `Shopify Storefront API request failed (${response.status}).`,
    );
  }

  const result = (await response.json()) as GraphqlResponse<T>;

  if (result.errors?.length || !result.data) {
    throw new ShopifyStorefrontError(
      result.errors?.map(({ message }) => message).join(" ") ||
        "Shopify returned an empty response.",
    );
  }

  return result.data;
}

