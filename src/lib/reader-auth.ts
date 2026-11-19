import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Free reader accounts without passwords (instructions §6.1). A reader confirms their email with a
// signed link that expires after 30 minutes; following it sets a signed, http-only session cookie.
//
// The signed link carries the registration details. On confirmation the reader is saved in the
// database (lib/readers.ts) and the link's nonce is recorded, so each link works once. Without a
// database, registrations are emailed to the Foundation inbox and notes stay on the device.
//
//   READER_AUTH_SECRET   a long random string (e.g. `openssl rand -base64 32`). Required in production.

const LINK_TTL = 30 * 60; // seconds
const SESSION_TTL = 180 * 24 * 60 * 60;
export const SESSION_COOKIE = "cmf_reader";

export type Registration = { name: string; country: string; city?: string; email: string; subscribe: boolean };
export type LinkPayload = { purpose: "register"; reg: Registration; next?: string } | { purpose: "sign-in"; email: string; next?: string };
export type Session = { email: string; rid?: string; name?: string; country?: string; since: number };

export class AuthNotConfigured extends Error {}

function secret() {
  const s = process.env.READER_AUTH_SECRET?.trim();
  if (s && s.length >= 24) return s;
  if (process.env.NODE_ENV !== "production") return "development-only-reader-secret-do-not-use";
  throw new AuthNotConfigured("READER_AUTH_SECRET is not set (at least 24 characters).");
}

const b64 = (s: string | Buffer) => Buffer.from(s).toString("base64url");

function sign(body: string) {
  return createHmac("sha256", secret()).update(body).digest("base64url");
}

function seal(data: object, ttl: number) {
  const body = b64(JSON.stringify({ ...data, exp: Math.floor(Date.now() / 1000) + ttl, n: randomBytes(6).toString("base64url") }));
  return `${body}.${sign(body)}`;
}

function open<T>(token: string | undefined): T | null {
  if (!token || token.length > 4000) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof data.exp !== "number" || data.exp < Date.now() / 1000) return null;
    return data as T;
  } catch {
    return null;
  }
}

export const createLinkToken = (payload: LinkPayload) => seal(payload, LINK_TTL);
export const readLinkToken = (token: string | undefined) => open<LinkPayload & { exp: number; n: string }>(token);

export async function startSession(session: Omit<Session, "since">, ttl = SESSION_TTL) {
  const store = await cookies();
  store.set(SESSION_COOKIE, seal({ ...session, since: Math.floor(Date.now() / 1000) }, ttl), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ttl,
  });
}

export async function currentReader(): Promise<Session | null> {
  try {
    const store = await cookies();
    return open<Session>(store.get(SESSION_COOKIE)?.value);
  } catch {
    return null;
  }
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export { safeNextPath as safeNext } from "./paths";

/** Authorised CMF management (ADMIN_EMAILS, comma-separated) may open the dashboard at /admin. */
export function isAdminEmail(email: string | undefined | null) {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return admins.includes(email.toLowerCase());
}

export async function currentAdmin() {
  const reader = await currentReader();
  return reader && isAdminEmail(reader.email) ? reader : null;
}

/**
 * Password sign-in for management, so staff need no emailed link. The password lives only in the
 * hosting settings (ADMIN_PASSWORD, at least 12 characters), never in the code: the repository is
 * public. Both an authorised email (ADMIN_EMAILS) and the password are required.
 */
export function checkAdminPassword(email: string, password: string) {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected || expected.length < 12 || !isAdminEmail(email)) return false;
  const digest = (v: string) => createHash("sha256").update(v).digest();
  return timingSafeEqual(digest(password), digest(expected));
}

/** As long as browsers allow a cookie to last (400 days); signing in again renews it. */
export const ADMIN_SESSION_TTL = 400 * 24 * 60 * 60;
