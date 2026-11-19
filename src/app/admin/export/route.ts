import { db, dbConfigured, eq } from "@/lib/db";
import { currentAdmin } from "@/lib/reader-auth";

// CSV exports for authorised CMF management only.
const csv = (rows: Record<string, unknown>[], cols: string[]) =>
  [cols.join(","), ...rows.map((r) => cols.map((c) => `"${String(r[c] ?? "").replace(/"/g, '""').replace(/^([=+\-@])/, "'$1")}"`).join(","))].join("\r\n");

export async function GET(req: Request) {
  if (!(await currentAdmin()) || !dbConfigured()) return new Response("Not authorised", { status: 403 });
  const list = new URL(req.url).searchParams.get("list");
  let body: string;
  if (list === "newsletter") {
    const rows = await db.select("readers", { select: "name,email,country,newsletter_at", newsletter: "is.true", deleted_at: "is.null", order: "newsletter_at.asc" });
    const footer = await db.select("enquiries", { select: "email,created_at", kind: eq("newsletter"), order: "created_at.asc" });
    body = csv([...rows, ...footer.map((f) => ({ email: f.email, newsletter_at: f.created_at, name: "", country: "" }))], ["name", "email", "country", "newsletter_at"]);
  } else if (list === "orders") {
    const rows = await db.select("enquiries", { kind: eq("order"), order: "created_at.desc" });
    body = csv(
      rows.map((r) => ({ ...r, ...(r.payload as object) })),
      ["created_at", "name", "organisation", "email", "country", "destination", "book", "quantity", "topic", "instructions", "status"],
    );
  } else if (list === "donations") {
    const rows = await db.select("donations", { order: "received_on.desc" });
    body = csv(rows, ["received_on", "amount", "currency", "category", "method", "reference", "donor_name", "donor_email", "note", "recorded_by"]);
  } else return new Response("Unknown list", { status: 400 });
  return new Response(body, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="cmf-${list}-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" },
  });
}
