import Link from "next/link";
import { type Dashboard, dashboard, period } from "@/lib/admin-data";
import { dbConfigured } from "@/lib/db";
import { currentAdmin } from "@/lib/reader-auth";
import { enquiryTypes } from "@/lib/enquiries";

// The management dashboard (instructions §9.8). Every figure states its period and definition.
const LOOKER = process.env.NEXT_PUBLIC_LOOKER_STUDIO_URL?.trim();

function Stat({ label, value, note }: { label: string; value: string | number; note: string }) {
  return (
    <div className="rounded-[4px] border border-line bg-white p-4">
      <p className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">{label}</p>
      <p className="mt-1 font-display text-3xl tabular-nums">{value}</p>
      <p className="mt-1 text-[0.72rem] leading-snug text-muted">{note}</p>
    </div>
  );
}

function Section({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl">{title}</h2>
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

const pct = (v: number | null) => (v === null ? "–" : `${Math.round(v * 100)}%`);

function Bars({ days }: { days: Dashboard["days"] }) {
  const entries = Object.entries(days);
  const max = Math.max(1, ...entries.map(([, d]) => d.starts));
  return (
    <div className="rounded-[4px] border border-line bg-white p-4">
      <div className="flex h-32 items-end gap-[2px]" role="img" aria-label="Reading starts per day">
        {entries.map(([day, d]) => (
          <div key={day} className="flex-1 bg-bronze/80" style={{ height: `${(d.starts / max) * 100}%`, minHeight: d.starts ? 2 : 0 }} title={`${day}: ${d.starts} reading starts, ${d.registrations} registrations, ${d.enquiries} enquiries`} />
        ))}
      </div>
      <p className="mt-2 flex justify-between text-[0.7rem] text-muted">
        <span>{entries[0]?.[0]}</span>
        <span>Reading starts per day (hover a bar for registrations and enquiries)</span>
        <span>{entries.at(-1)?.[0]}</span>
      </p>
    </div>
  );
}

export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  if (!(await currentAdmin()) || !dbConfigured()) return null;
  const { days } = await searchParams;
  const p = period(Number(days) || 30);
  const d = await dashboard(p);
  const o = d.overview;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Overview</h1>
          <p className="mt-1 text-sm text-muted">
            {p.label} ({p.since} to today, Lagos time). Counts are estimates where measurement has limits; a click is never counted as a completed reading.
          </p>
        </div>
        <div className="flex gap-1 rounded-full bg-white p-1 text-sm ring-1 ring-line">
          {[1, 7, 30, 90, 365].map((n) => (
            <Link key={n} href={`/admin?days=${n}`} aria-current={n === p.days ? "page" : undefined} className="rounded-full px-3 py-1.5 aria-[current]:bg-ink aria-[current]:text-white">
              {n === 1 ? "Today" : n === 365 ? "Year" : `${n}d`}
            </Link>
          ))}
        </div>
      </div>

      <Section title="Daily overview">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Reading starts" value={o.readingStarts} note="Times a book was opened in the reader" />
          <Stat label="Book page views" value={o.bookPageViews} note="Visits to /books/… pages" />
          <Stat label="New registrations" value={o.registrations} note="Reader accounts with a confirmed email" />
          <Stat label="Enquiries" value={o.enquiries} note="Contact form messages, all types" />
          <Stat label="Institutional orders" value={o.orders} note={`${o.copiesRequested} copies requested in total`} />
          <Stat label="Reader feedback" value={o.feedback} note="Sent with “Send feedback to CMF”" />
          <Stat label="Newsletter opt-ins" value={o.newsletterSignups} note="Footer sign-ups plus opt-ins at registration" />
          <Stat label="Confirmed donations" value={o.donationsConfirmed} note={`Recorded from payment records. ${o.donateClicks} checkout starts.`} />
        </div>
        <div className="mt-3">
          <Bars days={d.days} />
        </div>
      </Section>

      <Section title="Literature performance" note="Per launch title. Completion estimate = book completions ÷ reading starts.">
        <div className="overflow-x-auto rounded-[4px] border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[#faf8f4] text-left text-xs tracking-[0.06em] text-muted uppercase">
              <tr>
                {["Book", "Page views", "Starts", "25%", "50%", "75%", "Chapters done", "Completed", "Completion", "Notes", "Bookmarks", "Amazon clicks"].map((h) => (
                  <th key={h} className="px-3 py-2 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.literature.map((b) => (
                <tr key={b.slug} className="border-t border-line tabular-nums">
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{b.title}</td>
                  {[b.pageViews, b.starts, b.p25, b.p50, b.p75, b.chapters, b.completes].map((v, i) => (
                    <td key={i} className="px-3 py-2">
                      {v}
                    </td>
                  ))}
                  <td className="px-3 py-2">{pct(b.completion)}</td>
                  <td className="px-3 py-2">{b.notes}</td>
                  <td className="px-3 py-2">{b.bookmarks}</td>
                  <td className="px-3 py-2">{b.amazon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Audience development">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Registered readers" value={d.audience.readers} note="All active reader accounts" />
            <Stat label="New in period" value={d.audience.newReaders} note={p.label} />
            <Stat label="Returning readers" value={d.audience.activeReaders} note="Signed in during the period" />
            <Stat label="Newsletter list" value={d.audience.newsletter} note="Readers who opted in (consent recorded)" />
          </div>
          <div className="rounded-[4px] border border-line bg-white p-4">
            <p className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">Registered readers by country</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {d.audience.byCountry.length === 0 && <li className="text-muted">No registrations yet.</li>}
              {d.audience.byCountry.map(([c, n]) => (
                <li key={c} className="flex items-center gap-3">
                  <span className="w-40 truncate">{c}</span>
                  <span className="h-2 rounded bg-bronze/70" style={{ width: `${(n / (d.audience.byCountry[0]?.[1] || 1)) * 50}%` }} />
                  <span className="tabular-nums text-muted">{n}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.72rem] text-muted">Visitor countries and cities (not only registered readers) are in Google Analytics.</p>
          </div>
        </div>
      </Section>

      <Section title="Support and partnerships">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[4px] border border-line bg-white p-4 text-sm">
            <p className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">Confirmed donations by purpose</p>
            <ul className="mt-3 space-y-1">
              {Object.keys(d.support.donationTotals).length === 0 && <li className="text-muted">None recorded in this period.</li>}
              {Object.entries(d.support.donationTotals).map(([k, v]) => (
                <li key={k} className="flex justify-between gap-3">
                  <span>{k}</span>
                  <span className="tabular-nums">{v.toLocaleString("en-NG", { maximumFractionDigits: 2 })}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[4px] border border-line bg-white p-4 text-sm">
            <p className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">Checkout starts by purpose</p>
            <ul className="mt-3 space-y-1">
              {Object.keys(d.support.donateClicks).length === 0 && <li className="text-muted">None in this period.</li>}
              {Object.entries(d.support.donateClicks).map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="capitalize">{k}</span>
                  <span className="tabular-nums">{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[4px] border border-line bg-white p-4 text-sm">
            <p className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">Enquiries by type</p>
            <ul className="mt-3 space-y-1">
              {Object.keys(d.support.enquiryTopics).length === 0 && <li className="text-muted">None in this period.</li>}
              {Object.entries(d.support.enquiryTopics).map(([k, v]) => (
                <li key={k} className="flex justify-between gap-3">
                  <span>{enquiryTypes.find((t) => t.id === k)?.label ?? k}</span>
                  <span className="tabular-nums">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Website traffic and technical performance" note="Visitors, sessions, engagement, sources, devices, search queries and page speed come from Google Analytics 4 and Search Console.">
        {LOOKER ? (
          <div className="overflow-hidden rounded-[4px] border border-line bg-white">
            <iframe src={LOOKER} title="Looker Studio traffic report" className="h-[900px] w-full" loading="lazy" allowFullScreen sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" />
          </div>
        ) : (
          <p className="rounded-[4px] border border-dashed border-line bg-white p-5 text-sm text-muted">
            Connect the Looker Studio report by setting NEXT_PUBLIC_LOOKER_STUDIO_URL (its embed link). Until then, open{" "}
            <a className="text-bronze underline" href="https://analytics.google.com" target="_blank" rel="noopener">
              Google Analytics
            </a>{" "}
            and{" "}
            <a className="text-bronze underline" href="https://search.google.com/search-console" target="_blank" rel="noopener">
              Search Console
            </a>
            . Availability and errors: Vercel project dashboard.
          </p>
        )}
      </Section>
    </div>
  );
}
