import "server-only";

// The Foundation's database (Supabase Postgres), reached only from the server with the service-role
// key through Supabase's REST API. Schema: supabase/migrations. Every table has row-level security
// on and no public policies, so browsers can never query it directly.
//
//   SUPABASE_URL                 https://<project>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY    the secret key (sb_secret_…, Project Settings → API Keys). Server only, never NEXT_PUBLIC.
//
// Without these the site still works: reading, notes and bookmarks stay on the reader's device and
// messages are emailed as before. Only sync, the dashboard and reports need the database.

const url = () => process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
const key = () => process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

/** New-style secret keys (sb_secret_…) go in the apikey header only; legacy service_role JWTs also as a bearer token. */
const authHeaders = (secret: string): Record<string, string> =>
  secret.startsWith("sb_") ? { apikey: secret } : { apikey: secret, Authorization: `Bearer ${secret}` };

export function dbConfigured() {
  return Boolean(url() && key());
}

export class DbError extends Error {}

async function rest(path: string, init: RequestInit & { prefer?: string } = {}) {
  const base = url();
  const secret = key();
  if (!base || !secret) throw new DbError("Database not configured (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
  const res = await fetch(`${base}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...authHeaders(secret),
      "Content-Type": "application/json",
      ...(init.prefer ? { Prefer: init.prefer } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new DbError(`Supabase ${res.status} on ${path.split("?")[0]}: ${await res.text().catch(() => "")}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/** Encodes a value for a PostgREST filter: eq("a@b.c") → "eq.a%40b.c". */
export const eq = (v: string | number | boolean) => `eq.${encodeURIComponent(String(v))}`;
export const gte = (v: string) => `gte.${encodeURIComponent(v)}`;

type Query = Record<string, string | number | undefined>;
const qs = (q: Query) =>
  Object.entries(q)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${k === "select" || k === "order" || k === "or" ? String(v) : String(v)}`)
    .join("&");

export const db = {
  select: <T = Record<string, unknown>>(table: string, q: Query = {}) => rest(`${table}?${qs({ select: "*", ...q })}`) as Promise<T[]>,

  /** Exact row count for a filter, without fetching rows. */
  async count(table: string, q: Query = {}) {
    const base = url();
    const secret = key();
    if (!base || !secret) throw new DbError("Database not configured");
    const res = await fetch(`${base}/rest/v1/${table}?${qs({ select: "*", ...q, limit: 1 })}`, {
      method: "HEAD",
      headers: { ...authHeaders(secret), Prefer: "count=exact" },
      cache: "no-store",
    });
    return Number(res.headers.get("content-range")?.split("/")[1] ?? 0);
  },

  insert: <T = Record<string, unknown>>(table: string, rows: object | object[], opts: { onConflict?: string; ignoreDuplicates?: boolean } = {}) =>
    rest(`${table}${opts.onConflict ? `?on_conflict=${opts.onConflict}` : ""}`, {
      method: "POST",
      body: JSON.stringify(rows),
      prefer: ["return=representation", opts.onConflict ? (opts.ignoreDuplicates ? "resolution=ignore-duplicates" : "resolution=merge-duplicates") : ""]
        .filter(Boolean)
        .join(","),
    }) as Promise<T[]>,

  update: <T = Record<string, unknown>>(table: string, q: Query, values: object) =>
    rest(`${table}?${qs(q)}`, { method: "PATCH", body: JSON.stringify(values), prefer: "return=representation" }) as Promise<T[]>,

  remove: (table: string, q: Query) => rest(`${table}?${qs(q)}`, { method: "DELETE" }),

  rpc: (fn: string, args: object) => rest(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) }),
};

/** Runs a database write when the database is configured; never lets a database fault break the request. */
export async function tryDb<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
  if (!dbConfigured()) return null;
  try {
    return await fn();
  } catch (err) {
    console.error(`[db] ${label}`, err);
    return null;
  }
}

/** Adds to an aggregate daily count (no personal data). */
export const countMetric = (event: string, book = "", by = 1) => tryDb(`metric ${event}`, () => db.rpc("increment_metric", { p_event: event, p_book: book, p_by: by }));

/** Keeps a copy of an enquiry for the dashboard (the email to the Foundation inbox is still sent). */
export const recordEnquiry = (row: { kind: string; topic?: string; book?: string; quantity?: number; country?: string; name?: string; email?: string; payload?: object }) =>
  tryDb(`enquiry ${row.kind}`, () => db.insert("enquiries", row));
