import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import { getCustomerAccountConfig } from "./config";

const VERSION = "v1";

function key() {
  return createHash("sha256")
    .update(getCustomerAccountConfig().sessionSecret, "utf8")
    .digest();
}

function encode(value: Buffer) {
  return value.toString("base64url");
}

export function randomUrlSafe(bytes = 32) {
  return encode(randomBytes(bytes));
}

export function createCodeChallenge(verifier: string) {
  return encode(createHash("sha256").update(verifier).digest());
}

export function secureEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function seal<T>(value: T) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  cipher.setAAD(Buffer.from(VERSION));
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  return [VERSION, encode(iv), encode(encrypted), encode(cipher.getAuthTag())].join(".");
}

export function unseal<T>(value: string): T | null {
  try {
    const [version, ivValue, encryptedValue, tagValue] = value.split(".");
    if (version !== VERSION || !ivValue || !encryptedValue || !tagValue) return null;

    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivValue, "base64url"));
    decipher.setAAD(Buffer.from(VERSION));
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, "base64url")),
      decipher.final(),
    ]);
    return JSON.parse(decrypted.toString("utf8")) as T;
  } catch {
    return null;
  }
}
