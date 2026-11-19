import { db, dbConfigured } from "@/lib/db";
import { currentAdmin } from "@/lib/reader-auth";

// Reader numbers and the newsletter list. Personal notes are never shown here.
export default async function Readers() {
  if (!(await currentAdmin()) || !dbConfigured()) return null;
  const [total, newsletter, recent] = await Promise.all([
    db.count("readers", { deleted_at: "is.null" }),
    db.count("readers", { newsletter: "is.true", deleted_at: "is.null" }),
    db.select<{ name: string; country: string; city: string | null; newsletter: boolean; created_at: string }>("readers", {
      select: "name,country,city,newsletter,created_at",
      deleted_at: "is.null",
      order: "created_at.desc",
      limit: 50,
    }),
  ]);
  return (
    <div>
      <h1 className="font-display text-4xl">Readers &amp; exports</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        {total} registered readers, {newsletter} of whom have agreed to receive emails. Only export the newsletter list for sending the Foundation&rsquo;s own
        updates, and remove anyone who unsubscribes. Personal notes are private to each reader and are not available here.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="/admin/export?list=newsletter" className="rounded bg-bronze px-4 py-2.5 text-sm font-semibold text-white">
          Download newsletter list (CSV)
        </a>
        <a href="/admin/export?list=orders" className="rounded border border-bronze px-4 py-2.5 text-sm font-semibold text-bronze">
          Download order enquiries (CSV)
        </a>
        <a href="/admin/export?list=donations" className="rounded border border-bronze px-4 py-2.5 text-sm font-semibold text-bronze">
          Download donations (CSV)
        </a>
      </div>
      <h2 className="mt-10 font-display text-2xl">Most recent registrations</h2>
      <ul className="mt-4 divide-y divide-line rounded-[4px] border border-line bg-white text-sm">
        {recent.length === 0 && <li className="px-4 py-3 text-muted">No registrations yet.</li>}
        {recent.map((r, i) => (
          <li key={i} className="flex flex-wrap justify-between gap-3 px-4 py-2.5">
            <span>
              {r.name} · {r.city ? `${r.city}, ` : ""}
              {r.country}
            </span>
            <span className="text-muted">
              {r.newsletter ? "Newsletter: yes · " : ""}
              {new Date(r.created_at).toLocaleDateString("en-GB")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
