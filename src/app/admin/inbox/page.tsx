import { getBook } from "@/lib/books";
import { db, dbConfigured } from "@/lib/db";
import { enquiryTypes } from "@/lib/enquiries";
import { currentAdmin } from "@/lib/reader-auth";
import { setEnquiryStatus, setFeedbackStatus } from "../actions";

// The secure administrative inbox (instructions §6.3): reader feedback, enquiries and institutional orders.
// Messages also arrive in the Foundation's email; this keeps a record and a status for each.

type Feedback = { id: string; book: string | null; section: string | null; name: string | null; email: string | null; message: string; status: string; created_at: string; reader_id: string | null };
type Enquiry = { id: string; kind: string; topic: string | null; book: string | null; quantity: number | null; country: string | null; name: string | null; email: string | null; payload: Record<string, string>; status: string; created_at: string };

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { timeZone: "Africa/Lagos", dateStyle: "medium", timeStyle: "short" });

function StatusForm({ id, status, options, action }: { id: string; status: string; options: string[]; action: (f: FormData) => Promise<void> }) {
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <select name="status" defaultValue={status} className="rounded-lg border border-black/[0.08] bg-[#faf7f2] px-2 py-1.5 text-sm">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <button className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white">Save</button>
    </form>
  );
}

export default async function Inbox({ searchParams }: PageProps<"/admin/inbox">) {
  if (!(await currentAdmin()) || !dbConfigured()) return null;
  const { show } = await searchParams;
  const archived = show === "all";
  const [feedback, enquiries] = await Promise.all([
    db.select<Feedback>("feedback", { order: "created_at.desc", limit: 200, ...(archived ? {} : { status: "neq.archived" }) }),
    db.select<Enquiry>("enquiries", { order: "created_at.desc", limit: 300, kind: "neq.newsletter", ...(archived ? {} : { status: "neq.archived" }) }),
  ]);
  return (
    <div>
      <div className="flex items-end justify-between">
        <h1 className="font-display text-[clamp(2.4rem,4vw,3.4rem)] leading-none">Inbox</h1>
        <a href={archived ? "/admin/inbox" : "/admin/inbox?show=all"} className="text-sm text-bronze underline">
          {archived ? "Hide archived" : "Show archived"}
        </a>
      </div>

      <h2 className="mt-8 text-[1.15rem] font-medium">Reader feedback ({feedback.length})</h2>
      <ul className="mt-4 space-y-3">
        {feedback.length === 0 && <li className="text-muted">No feedback.</li>}
        {feedback.map((f) => (
          <li key={f.id} className="rounded-[22px] bg-white p-5 ring-1 ring-black/[0.05]">
            <div className="flex flex-wrap items-start justify-between gap-3 text-sm">
              <p>
                <strong>{f.name || "Anonymous"}</strong> {f.email && <a href={`mailto:${f.email}`} className="text-bronze underline">{f.email}</a>} {f.reader_id && <span className="ml-1 rounded-full bg-parchment px-1.5 py-0.5 text-xs">verified reader</span>}
                <span className="block text-muted">
                  {when(f.created_at)} · {f.book ? getBook(f.book)?.title ?? f.book : "No book"}
                  {f.section ? ` · ${f.section}` : ""}
                </span>
              </p>
              <StatusForm id={f.id} status={f.status} options={["new", "read", "replied", "archived"]} action={setFeedbackStatus} />
            </div>
            <p className="mt-3 whitespace-pre-wrap">{f.message}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-[1.15rem] font-medium">Enquiries and orders ({enquiries.length})</h2>
      <ul className="mt-4 space-y-3">
        {enquiries.length === 0 && <li className="text-muted">No enquiries.</li>}
        {enquiries.map((e) => (
          <li key={e.id} className="rounded-[22px] bg-white p-5 ring-1 ring-black/[0.05]">
            <div className="flex flex-wrap items-start justify-between gap-3 text-sm">
              <p>
                <span className={`mr-2 rounded px-1.5 py-0.5 text-xs font-semibold uppercase ${e.kind === "order" ? "bg-ink text-white" : "bg-blush"}`}>
                  {e.kind === "order" ? "Order" : (enquiryTypes.find((t) => t.id === e.topic)?.label ?? e.topic)}
                </span>
                <strong>{e.name}</strong>{" "}
                {e.email && (
                  <a href={`mailto:${e.email}`} className="text-bronze underline">
                    {e.email}
                  </a>
                )}
                <span className="block text-muted">{when(e.created_at)}</span>
              </p>
              <StatusForm id={e.id} status={e.status} options={["new", "in-progress", "done", "archived"]} action={setEnquiryStatus} />
            </div>
            {e.kind === "order" ? (
              <dl className="mt-3 grid grid-cols-[9rem_1fr] gap-y-1 text-sm">
                <dt className="text-muted">Book</dt>
                <dd>{e.book ? (getBook(e.book)?.title ?? e.book) : ""}</dd>
                <dt className="text-muted">Quantity</dt>
                <dd>{e.quantity}</dd>
                <dt className="text-muted">Purpose</dt>
                <dd>{e.topic}</dd>
                <dt className="text-muted">Organisation</dt>
                <dd>{e.payload.organisation || "–"}</dd>
                <dt className="text-muted">Deliver to</dt>
                <dd>
                  {e.payload.destination}, {e.country}
                </dd>
                {e.payload.instructions && (
                  <>
                    <dt className="text-muted">Instructions</dt>
                    <dd className="whitespace-pre-wrap">{e.payload.instructions}</dd>
                  </>
                )}
              </dl>
            ) : (
              <p className="mt-3 whitespace-pre-wrap">{e.payload.message}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
