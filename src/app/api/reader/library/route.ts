import { db, dbConfigured, eq } from "@/lib/db";
import { currentReader } from "@/lib/reader-auth";

export const dynamic = "force-dynamic";

/** The signed-in reader's personal library: books started, saved or completed, on any device. */
export async function GET() {
  const reader = await currentReader();
  if (!reader?.rid || !dbConfigured()) return Response.json({ sync: false, books: [] }, { headers: { "Cache-Control": "private, no-store" } });
  const rows = await db.select("reading_state", { reader_id: eq(reader.rid), order: "updated_at.desc" });
  return Response.json({ sync: true, books: rows }, { headers: { "Cache-Control": "private, no-store" } });
}
