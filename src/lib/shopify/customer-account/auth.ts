import "server-only";

import { createPublicKey, verify } from "node:crypto";
import { cache } from "react";

import { getCallbackUrl, getCustomerAccountConfig } from "./config";
import { createCodeChallenge, randomUrlSafe, secureEqual } from "./crypto";
import { getOpenIdConfiguration, getOpenIdJwks } from "./discovery";
import {
  clearCustomerSession,
  readCustomerSession,
  writeAuthorizationTransaction,
  writeCustomerSession,
  type CustomerSession,
} from "./session";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  id_token?: string;
  refresh_token?: string;
}

interface IdTokenClaims {
  aud?: string | string[];
  exp?: number;
  iat?: number;
  iss?: string;
  nonce?: string;
}

interface IdTokenHeader {
  alg?: string;
  kid?: string;
  typ?: string;
}

export function normalizeCustomerReturnTo(value: string | null) {
  if (!value || value.length > 500 || value.includes("\\")) return "/account";
  try {
    const url = new URL(value, "https://evol.invalid");
    const isAccountPath =
      url.origin === "https://evol.invalid" &&
      (url.pathname === "/account" || url.pathname.startsWith("/account/"));
    const isAuthRoute = [
      "/account/login",
      "/account/authorize",
      "/account/logout",
    ].includes(url.pathname);
    return isAccountPath && !isAuthRoute
      ? `${url.pathname}${url.search}`
      : "/account";
  } catch {
    return "/account";
  }
}

function authorizationHeader() {
  const { clientId, clientSecret } = getCustomerAccountConfig();
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}

async function requestToken(body: URLSearchParams, requireIdToken = false) {
  const { token_endpoint } = await getOpenIdConfiguration();
  const response = await fetch(token_endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: authorizationHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Evol-Web-Store",
    },
    body,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Shopify customer token request failed (${response.status}).`);
  }
  const token = (await response.json()) as Partial<TokenResponse>;
  if (
    !token.access_token ||
    !token.expires_in ||
    (requireIdToken && !token.id_token)
  ) {
    throw new Error("Shopify returned an incomplete customer token response.");
  }
  return token as TokenResponse;
}

function parseIdToken(idToken: string) {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = idToken.split(".");
    if (!encodedHeader || !encodedPayload || !encodedSignature) throw new Error();
    return {
      header: JSON.parse(Buffer.from(encodedHeader, "base64url").toString()) as IdTokenHeader,
      claims: JSON.parse(Buffer.from(encodedPayload, "base64url").toString()) as IdTokenClaims,
      encodedHeader,
      encodedPayload,
      signature: Buffer.from(encodedSignature, "base64url"),
    };
  } catch {
    throw new Error("Shopify returned an invalid customer ID token.");
  }
}

async function validateIdToken(idToken: string, nonce?: string) {
  const { clientId } = getCustomerAccountConfig();
  const { issuer } = await getOpenIdConfiguration();
  const { header, claims, encodedHeader, encodedPayload, signature } = parseIdToken(idToken);
  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Shopify used an unsupported customer ID token algorithm.");
  }
  let { keys } = await getOpenIdJwks();
  let signingKey = keys.find(
    (candidate) => candidate.kid === header.kid && (!candidate.alg || candidate.alg === header.alg),
  );
  if (!signingKey) {
    ({ keys } = await getOpenIdJwks(true));
    signingKey = keys.find(
      (candidate) => candidate.kid === header.kid && (!candidate.alg || candidate.alg === header.alg),
    );
  }
  if (!signingKey) {
    throw new Error("Shopify customer ID token signing key was not found.");
  }
  const signatureIsValid = verify(
    "RSA-SHA256",
    Buffer.from(`${encodedHeader}.${encodedPayload}`),
    createPublicKey({ key: signingKey, format: "jwk" }),
    signature,
  );
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (
    !signatureIsValid ||
    !issuer ||
    claims.iss !== issuer ||
    (nonce && (!claims.nonce || !secureEqual(claims.nonce, nonce))) ||
    !audiences.includes(clientId) ||
    !claims.exp ||
    claims.exp * 1000 <= Date.now() - 60_000 ||
    (claims.iat && claims.iat * 1000 > Date.now() + 60_000)
  ) {
    throw new Error("Shopify customer ID token validation failed.");
  }
}

function toSession(
  token: TokenResponse,
  fallbackRefreshToken: string | null,
  fallbackIdToken?: string,
): CustomerSession {
  const idToken = token.id_token ?? fallbackIdToken;
  if (!idToken) throw new Error("Shopify did not return a customer ID token.");
  return {
    accessToken: token.access_token,
    accessTokenExpiresAt: Date.now() + token.expires_in * 1000,
    refreshToken: token.refresh_token ?? fallbackRefreshToken,
    idToken,
  };
}

export async function createCustomerAuthorizationUrl(returnToValue: string | null) {
  const { clientId } = getCustomerAccountConfig();
  const { authorization_endpoint } = await getOpenIdConfiguration();
  const state = randomUrlSafe();
  const nonce = randomUrlSafe();
  const codeVerifier = randomUrlSafe(48);
  const returnTo = normalizeCustomerReturnTo(returnToValue);

  await writeAuthorizationTransaction({
    state,
    nonce,
    codeVerifier,
    returnTo,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  const url = new URL(authorization_endpoint);
  url.searchParams.set("scope", "openid email customer-account-api:full");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", getCallbackUrl());
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("code_challenge", createCodeChallenge(codeVerifier));
  url.searchParams.set("code_challenge_method", "S256");
  return url;
}

export async function exchangeCustomerAuthorizationCode(
  code: string,
  codeVerifier: string,
  nonce: string,
) {
  const { clientId } = getCustomerAccountConfig();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: getCallbackUrl(),
    code,
    code_verifier: codeVerifier,
  });
  const token = await requestToken(body, true);
  await validateIdToken(token.id_token!, nonce);
  const session = toSession(token, null);
  await writeCustomerSession(session);
  return session;
}

export async function refreshCustomerSession(session: CustomerSession) {
  if (!session.refreshToken) return null;
  const { clientId } = getCustomerAccountConfig();
  const token = await requestToken(
    new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      refresh_token: session.refreshToken,
    }),
  );
  if (token.id_token) await validateIdToken(token.id_token);
  return toSession(token, session.refreshToken, session.idToken);
}

const resolveCustomerAccessToken = cache(async () => {
  const session = await readCustomerSession();
  if (!session) return null;
  if (session.accessTokenExpiresAt > Date.now() + 60_000) {
    return session.accessToken;
  }

  try {
    const refreshed = await refreshCustomerSession(session);
    if (!refreshed) {
      try {
        await clearCustomerSession();
      } catch {}
      return null;
    }
    try {
      await writeCustomerSession(refreshed);
    } catch {}
    return refreshed.accessToken;
  } catch {
    try {
      await clearCustomerSession();
    } catch {}
    return null;
  }
});

export function getCustomerAccessToken() {
  return resolveCustomerAccessToken();
}

export async function hasCustomerSession() {
  return Boolean(await getCustomerAccessToken());
}
