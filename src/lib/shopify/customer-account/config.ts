import "server-only";

export class CustomerAccountConfigurationError extends Error {
  constructor(variable: string) {
    super(`Customer Account API is not configured: ${variable} is missing.`);
    this.name = "CustomerAccountConfigurationError";
  }
}

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new CustomerAccountConfigurationError(name);
  }
  return value;
}

export function getCustomerAccountConfig() {
  const siteUrl = new URL(required("NEXT_PUBLIC_SITE_URL"));
  const storeDomain = required("SHOPIFY_STORE_DOMAIN")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  return {
    clientId: required("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID"),
    clientSecret: required("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET"),
    sessionSecret: required("CUSTOMER_ACCOUNT_SESSION_SECRET"),
    siteUrl,
    storeDomain,
  };
}

export function getCallbackUrl() {
  return new URL("/account/authorize", getCustomerAccountConfig().siteUrl).toString();
}

export function getLogoutReturnUrl() {
  return new URL("/", getCustomerAccountConfig().siteUrl).toString();
}
