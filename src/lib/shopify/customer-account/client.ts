import "server-only";

import { getCustomerAccessToken } from "./auth";
import { getCustomerApiConfiguration } from "./discovery";

interface GraphQlError {
  message: string;
  extensions?: { code?: string };
}

interface GraphQlResponse<T> {
  data?: T;
  errors?: GraphQlError[];
}

export class CustomerAccountApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomerAccountApiError";
  }
}

export async function customerAccountQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
) {
  const accessToken = await getCustomerAccessToken();
  if (!accessToken) return null;
  const { graphql_api } = await getCustomerApiConfiguration();
  const response = await fetch(graphql_api, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: accessToken,
      "Content-Type": "application/json",
      "User-Agent": "Evol-Web-Store",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (response.status === 401) return null;
  if (!response.ok) {
    throw new CustomerAccountApiError(
      `Shopify Customer Account API request failed (${response.status}).`,
    );
  }

  const result = (await response.json()) as GraphQlResponse<T>;
  if (!result.data) {
    const message = result.errors?.[0]?.message ?? "Shopify returned no customer data.";
    throw new CustomerAccountApiError(message);
  }
  return result.data;
}
