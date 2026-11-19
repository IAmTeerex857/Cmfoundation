import { bad, readJson } from "@/lib/api";
import { getBook } from "@/lib/books";
import { db, dbConfigured, eq } from "@/lib/db";
import { currentReader } from "@/lib/reader-auth";

// The signed-in reader's workspace for one book: position, notes, bookmarks and preferences,
// synchronised across their devices (instructions §6.2, §6.5). Only the reader can reach their own
// data: every query is scoped to the reader id in their signed session cookie.

export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store" };

async function scope() {
  const reader = await currentReader();
  if (!reader?.rid || !dbConfigured()) return null;
  return reader.rid;
}

export async function GET(req: Request) {
  const rid = await scope();
  if (!rid) return Response.json({ sync: false }, { headers: noStore });
  const book = new URL(req.url).searchParams.get("book") ?? "";
  if (!getBook(book)) return bad("Unknown book.");
  const [state, notes, bookmarks, prefs] = await Promise.all([
    db.select("reading_state", { reader_id: eq(rid), book: eq(book) }),
    db.select("notes", { reader_id: eq(rid), book: eq(book), order: "created_at.desc" }),
    db.select("bookmarks", { reader_id: eq(rid), book: eq(book), order: "created_at.desc" }),
    db.select("reader_prefs", { reader_id: eq(rid) }),
  ]);
  return Response.json({ sync: true, state: state[0] ?? null, notes, bookmarks, prefs: prefs[0]?.prefs ?? null }, { headers: noStore });
}

const str = (v: unknown, max: number) => String(v ?? "").slice(0, max);
const ratio = (v: unknown) => Math.min(Math.max(Number(v) || 0, 0), 1);

export async function POST(req: Request) {
  const rid = await scope();
  if (!rid) return bad("Not signed in.", 401);
  const body = await readJson(req);
  if (!body) return bad("Invalid request.");
  const book = str(body.book, 80);
  if (body.op !== "prefs" && !getBook(book)) return bad("Unknown book.");
  const now = new Date().toISOString();

  switch (body.op) {
    case "position": {
      const percent = Math.round(Math.min(Math.max(Number(body.percent) || 0, 0), 100));
      await db.insert(
        "reading_state",
        { reader_id: rid, book, section: str(body.section, 80), ratio: ratio(body.ratio), percent, updated_at: now, ...(body.completed ? { completed_at: now } : {}) },
        { onConflict: "reader_id,book" },
      );
      return Response.json({ ok: true });
    }
    case "note.add": {
      const n = body.note as Record<string, unknown>;
      if (!n?.text) return bad("Empty note.");
      const [row] = await db.insert("notes", {
        reader_id: rid,
        book,
        section: str(n.section, 80),
        section_title: str(n.sectionTitle, 200),
        quote: n.quote ? str(n.quote, 1000) : null,
        body: str(n.text, 10000),
        ...(n.created ? { created_at: new Date(Number(n.created)).toISOString() } : {}),
      });
      return Response.json({ ok: true, id: row.id });
    }
    case "note.delete":
      await db.remove("notes", { reader_id: eq(rid), id: eq(str(body.id, 40)) });
      return Response.json({ ok: true });
    case "bookmark.add": {
      const b = body.bookmark as Record<string, unknown>;
      const [row] = await db.insert("bookmarks", { reader_id: rid, book, section: str(b?.section, 80), section_title: str(b?.sectionTitle, 200), ratio: ratio(b?.ratio) });
      return Response.json({ ok: true, id: row.id });
    }
    case "bookmark.delete":
      await db.remove("bookmarks", { reader_id: eq(rid), id: eq(str(body.id, 40)) });
      return Response.json({ ok: true });
    case "prefs":
      await db.insert("reader_prefs", { reader_id: rid, prefs: body.prefs ?? {}, updated_at: now }, { onConflict: "reader_id" });
      return Response.json({ ok: true });
    case "save":
      await db.insert("reading_state", { reader_id: rid, book, saved: body.saved === true, updated_at: now }, { onConflict: "reader_id,book" });
      return Response.json({ ok: true });
    default:
      return bad("Unknown operation.");
  }
}
