import "server-only";
import { db, dbConfigured, eq } from "./db";
import type { Registration } from "./reader-auth";

export type ReaderRow = { id: string; email: string; name: string; country: string; city: string | null; newsletter: boolean; created_at: string; verified_at: string | null; deleted_at: string | null };

/** Records a sign-in link as used. Returns false when it was used before (links work once). */
export async function consumeLink(nonce: string) {
  if (!dbConfigured()) return true;
  const rows = await db.insert("used_links", { nonce }, { onConflict: "nonce", ignoreDuplicates: true });
  return rows.length > 0;
}

export async function findReader(email: string) {
  if (!dbConfigured()) return null;
  const [row] = await db.select<ReaderRow>("readers", { email: eq(email.toLowerCase()), limit: 1 });
  return row && !row.deleted_at ? row : null;
}

/** Creates the reader, or updates their details if they register again. Newsletter consent is only ever added, never assumed. */
export async function saveRegistration(reg: Registration) {
  const now = new Date().toISOString();
  const existing = dbConfigured() ? (await db.select<ReaderRow>("readers", { email: eq(reg.email), limit: 1 }))[0] : undefined;
  const values = {
    email: reg.email,
    name: reg.name,
    country: reg.country,
    city: reg.city ?? null,
    privacy_ack_at: now,
    verified_at: now,
    last_seen_at: now,
    deleted_at: null,
    ...(reg.subscribe ? { newsletter: true, newsletter_at: now } : existing ? {} : { newsletter: false }),
  };
  const [row] = await db.insert<ReaderRow>("readers", values, { onConflict: "email" });
  return { row, isNew: !existing || Boolean(existing.deleted_at) };
}

export async function touchReader(id: string) {
  await db.update("readers", { id: eq(id) }, { last_seen_at: new Date().toISOString() });
}

/** Everything held about a reader (data-access requests, §10.2). */
export async function exportReader(id: string) {
  const [reader] = await db.select("readers", { id: eq(id) });
  const [state, notes, bookmarks, prefs, feedback] = await Promise.all([
    db.select("reading_state", { reader_id: eq(id) }),
    db.select("notes", { reader_id: eq(id), order: "created_at.asc" }),
    db.select("bookmarks", { reader_id: eq(id), order: "created_at.asc" }),
    db.select("reader_prefs", { reader_id: eq(id) }),
    db.select("feedback", { reader_id: eq(id), order: "created_at.asc" }),
  ]);
  return { reader, reading: state, notes, bookmarks, preferences: prefs[0]?.prefs ?? {}, feedback };
}

/** Deletes the reader and, by cascade, their reading state, notes, bookmarks and preferences. */
export async function deleteReader(id: string) {
  await db.update("feedback", { reader_id: eq(id) }, { reader_id: null, email: null, name: null });
  await db.remove("readers", { id: eq(id) });
}
