import "server-only";

import { cookies } from "next/headers";

import { seal, unseal } from "./crypto";

const SESSION_COOKIE = "evol_customer_session";
const TRANSACTION_COOKIE = "evol_customer_auth";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export interface CustomerSession {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string | null;
  idToken: string;
}

export interface AuthorizationTransaction {
  state: string;
  nonce: string;
  codeVerifier: string;
  returnTo: string;
  expiresAt: number;
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
    priority: "high" as const,
  };
}

export async function readCustomerSession() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return value ? unseal<CustomerSession>(value) : null;
}

export async function writeCustomerSession(session: CustomerSession) {
  const value = seal(session);
  if (value.length > 3900) {
    throw new Error("The encrypted customer session is too large for a cookie.");
  }
  (await cookies()).set(SESSION_COOKIE, value, cookieOptions(THIRTY_DAYS));
}

export async function clearCustomerSession() {
  (await cookies()).set(SESSION_COOKIE, "", cookieOptions(0));
}

export async function readAuthorizationTransaction() {
  const value = (await cookies()).get(TRANSACTION_COOKIE)?.value;
  const transaction = value ? unseal<AuthorizationTransaction>(value) : null;
  if (!transaction || transaction.expiresAt < Date.now()) return null;
  return transaction;
}

export async function writeAuthorizationTransaction(transaction: AuthorizationTransaction) {
  (await cookies()).set(TRANSACTION_COOKIE, seal(transaction), cookieOptions(600));
}

export async function clearAuthorizationTransaction() {
  (await cookies()).set(TRANSACTION_COOKIE, "", cookieOptions(0));
}
