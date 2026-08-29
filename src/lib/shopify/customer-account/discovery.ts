import "server-only";

import type { JsonWebKey } from "node:crypto";

import { getCustomerAccountConfig } from "./config";

export interface OpenIdConfiguration {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
  issuer?: string;
  jwks_uri?: string;
}

export interface JsonWebKeySet {
  keys: Array<JsonWebKey & { kid?: string; alg?: string; use?: string }>;
}

interface CustomerApiConfiguration {
  graphql_api: string;
}

async function discover<T>(url: string, fresh = false): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "Evol-Web-Store" },
    ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 3600 } }),
  });
  if (!response.ok) {
    throw new Error(`Shopify discovery failed (${response.status}).`);
  }
  return (await response.json()) as T;
}

export async function getOpenIdConfiguration() {
  const { storeDomain } = getCustomerAccountConfig();
  const config = await discover<OpenIdConfiguration>(
    `https://${storeDomain}/.well-known/openid-configuration`,
  );

  if (
    !config.authorization_endpoint ||
    !config.token_endpoint ||
    !config.end_session_endpoint ||
    !config.issuer ||
    !config.jwks_uri
  ) {
    throw new Error("Shopify returned an incomplete OpenID configuration.");
  }
  return config;
}

export async function getCustomerApiConfiguration() {
  const { storeDomain } = getCustomerAccountConfig();
  const config = await discover<CustomerApiConfiguration>(
    `https://${storeDomain}/.well-known/customer-account-api`,
  );

  if (!config.graphql_api) {
    throw new Error("Shopify returned an incomplete Customer Account API configuration.");
  }
  return config;
}

export async function getOpenIdJwks(fresh = false) {
  const { jwks_uri } = await getOpenIdConfiguration();
  if (!jwks_uri) {
    throw new Error("Shopify did not provide an OpenID signing-key endpoint.");
  }
  return discover<JsonWebKeySet>(jwks_uri, fresh);
}
