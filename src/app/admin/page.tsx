import Link from "next/link";
import { type Dashboard, dashboard, period } from "@/lib/admin-data";
import { dbConfigured } from "@/lib/db";
import { enquiryTypes } from "@/lib/enquiries";
import { currentAdmin } from "@/lib/reader-auth";
import { Card, CardHead, Chevron, Delta, Empty, HeadLink, StatRow, fmt, hatch } from "./ui";

// The management dashboard (instructions §9.8) as one bento: the reading headline leads, the
// per-book breakdown beside it, a navy highlight, then daily rhythm, audience and what needs a reply.
// Every figure is from the Foundation's own database and states its period.

const LOOKER = process.env.NEXT_PUBLIC_LOOKER_STUDIO_URL?.trim();
const ranges = [
  { n: 7, label: "7 days" },
  { n: 30, label: "30 days" },
  { n: 90, label: "90 days" },
  { n: 365, label: "Year" },
];

const pct = (v: number | null) => (v === null ? "–" : `${Math.round(v * 100)}%`);
const short = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function Daily({ days }: { days: Dashboard["days"] }) {
  const all = Object.entries(days);
  // Long periods are grouped into weeks so the bars stay legible.
  const size = all.length > 60 ? 7 : 1;
  const groups: { from: string; starts: number; registrations: number }[] = [];
  for (let i = 0; i < all.length; i += size) {
    const chunk = all.slice(i, i + size);
    groups.push({ from: chunk[0][0], starts: chunk.reduce((n, [, d]) => n + d.starts, 0), registrations: chunk.reduce((n, [, d]) => n + d.registrations, 0) });
  }
  const max = Math.max(1, ...groups.map((g) => g.starts));
  const last = groups.at(-1);
  return (
    <div>
      <div className="relative mt-6 flex h-40 items-end gap-[3px]" role="img" aria-label={`Reading starts per ${size === 7 ? "week" : "day"}`}>
        {groups.map((g, i) => {
          const latest = i === groups.length - 1;
          return (
            <div key={g.from} className="relative flex h-full flex-1 items-end" title={`${short(g.from)}: ${g.starts} reading starts, ${g.registrations} new readers`}>
              {latest && g.starts > 0 && <span className="absolute -top-0 left-1/2 -translate-x-1/2 text-xs font-medium text-ink tabular-nums">{g.starts}</span>}
              <div className="w-full rounded-[3px]" style={{ height: `${Math.max(g.starts ? 4 : 2, (g.starts / max) * 88)}%`, ...hatch(latest), opacity: g.starts ? 1 : 0.35 }} />
            </div>
          );
        })}
      </div>
      <p className="mt-2 flex justify-between text-xs text-muted">
        <span>{groups[0] && short(groups[0].from)}</span>
        <span>{last && short(last.from)}</span>
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

  const books = [...d.literature].sort((a, b) => b.starts - a.starts);
  const bookMax = Math.max(1, ...books.map((b) => b.starts));
  const lead = books[0]?.starts ? books[0] : null;
  const countryTotal = d.audience.byCountry.reduce((n, [, c]) => n + c, 0);
  const needs = [
    { n: d.needs.messages, title: "messages", one: "message", note: "Contact form, not yet answered", href: "/admin/inbox", tone: "bg-[#f8e9e4] text-[#9a3b25]" },
    { n: d.needs.orders, title: "book orders", one: "book order", note: "Institutional copies to confirm", href: "/admin/inbox", tone: "bg-parchment text-bronze-dark" },
    { n: d.needs.feedback, title: "pieces of reader feedback", one: "piece of reader feedback", note: "Sent from inside the books", href: "/admin/inbox", tone: "bg-[#e6ecf3] text-navy-soft" },
    { n: Math.max(0, o.donateClicks - o.donationsConfirmed), title: "checkouts to reconcile", one: "checkout to reconcile", note: "Started this period, not yet recorded", href: "/admin/donations", tone: "bg-[#e9f3ea] text-[#2f6b3a]" },
  ];
  const waiting = needs.filter((x) => x.n > 0);

  return (
    <div>
      {/* Title and period */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(2.4rem,4vw,3.4rem)] leading-none tracking-[-0.01em]">Overview</h1>
          <p className="mt-2 text-sm text-muted">
            {short(p.since)} to today, compared with the {p.days} days before.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full bg-white p-1 ring-1 ring-black/[0.06]">
            {ranges.map((r) => (
              <Link
                key={r.n}
                href={`/admin?days=${r.n}`}
                aria-current={r.n === p.days ? "page" : undefined}
                className="rounded-full px-3.5 py-1.5 text-sm text-muted transition-colors hover:text-ink aria-[current]:bg-navy aria-[current]:text-white"
              >
                {r.label}
              </Link>
            ))}
          </div>
          <a href="/admin/export?list=orders" className="rounded-full bg-white px-4 py-2 text-sm text-ink ring-1 ring-black/[0.06] hover:bg-[#faf7f2]">
            Export orders
          </a>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* 1. The headline: reading */}
        <Card className="lg:col-span-4">
          <CardHead title="Reading starts" note={p.label} />
          <p className="mt-5 text-[clamp(3rem,5vw,4.2rem)] leading-none font-medium tracking-[-0.04em] text-ink tabular-nums">{fmt(o.readingStarts)}</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted">
            <Delta now={o.readingStarts} before={d.previous.readingStarts} />
            <span>vs previous {p.days} days</span>
          </div>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-body">
            {fmt(o.chaptersCompleted)} chapters read to the end and {fmt(o.booksCompleted)} {o.booksCompleted === 1 ? "book" : "books"} finished.
          </p>
          <div className="mt-4">
            <StatRow label="Book page views" value={fmt(o.bookPageViews)} />
            <StatRow label="New reader accounts" value={fmt(o.registrations)} />
            <StatRow label="Invitations to register seen" value={fmt(o.invitesShown)} />
          </div>
        </Card>

        {/* 2. Per book */}
        <Card className="flex flex-col lg:col-span-5">
          <CardHead title="Reading by book" note="Reading starts, with the share read to the end" action={<HeadLink href="#literature">Details</HeadLink>} />
          <ul className="mt-6 grid gap-4">
            {books.map((b, i) => (
              <li key={b.slug}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate text-ink">{b.title}</span>
                  <span className="shrink-0 text-muted tabular-nums">
                    {b.starts ? (
                      <>
                        <span className="font-medium text-ink">{fmt(b.starts)}</span> · {pct(b.completion)} finished
                      </>
                    ) : (
                      "Not opened yet"
                    )}
                  </span>
                </div>
                <div className="mt-1.5 h-3 rounded-full bg-[#f3eee6]">
                  <div className="h-full rounded-full" style={{ width: `${Math.max(b.starts ? 3 : 0, (b.starts / bookMax) * 100)}%`, ...hatch(i === 0 && b.starts > 0) }} />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <div className="rounded-2xl bg-[#faf7f2] px-4 py-3.5 text-[0.95rem]">
              {lead ? (
                <>
                  <p className="font-medium text-ink">
                    {lead.title} leads with {fmt(lead.starts)} reading {lead.starts === 1 ? "start" : "starts"}.
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    {fmt(lead.p50)} readers passed halfway; {fmt(lead.notes)} notes and {fmt(lead.bookmarks)} bookmarks made.
                  </p>
                </>
              ) : (
                <p className="text-muted">Figures appear here as readers open the books.</p>
              )}
            </div>
          </div>
        </Card>

        {/* 3. Navy highlight */}
        <section className="relative flex min-h-[22rem] min-w-0 flex-col overflow-hidden rounded-[22px] bg-navy p-6 text-white lg:col-span-3">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -bottom-24 size-72 rounded-full bg-gold/25 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -top-16 -left-10 size-56 rounded-full bg-navy-soft blur-2xl" />
          <span className="relative w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-tan-light ring-1 ring-white/15">Readers</span>
          <p className="relative mt-6 flex items-baseline gap-2">
            <span className="text-[3.6rem] leading-none font-medium tracking-[-0.04em] tabular-nums">{fmt(d.audience.newReaders)}</span>
            <span className="text-sm text-white/60">new in {p.days} days</span>
          </p>
          <p className="relative mt-5 font-display text-[1.55rem] leading-snug">
            {d.audience.byCountry[0] ? `Most readers so far are in ${d.audience.byCountry[0][0]}.` : "Reader accounts will gather here after the 24 November launch."}
          </p>
          <p className="relative mt-2 text-sm leading-relaxed text-white/65">
            {fmt(d.audience.readers)} registered in total, {fmt(d.audience.activeReaders)} active this period, {fmt(d.audience.newsletter)} on the newsletter list.
          </p>
          <Link href="/admin/readers" className="relative mt-auto inline-flex w-fit items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-navy hover:bg-cream">
            See readers
            <Chevron />
          </Link>
        </section>

        {/* 4. Daily rhythm */}
        <Card className="lg:col-span-4">
          <CardHead title={p.days > 60 ? "Week by week" : "Day by day"} note="Reading starts; the latest is solid" />
          <Daily days={d.days} />
        </Card>

        {/* 5. Audience */}
        <Card className="lg:col-span-5">
          <CardHead title="Where readers are" note="Registered reader accounts by country" />
          {d.audience.byCountry.length ? (
            <ul className="mt-5 grid gap-2">
              {d.audience.byCountry.slice(0, 6).map(([c, n], i) => (
                <li key={c} className="relative overflow-hidden rounded-xl bg-[#faf7f2]">
                  <div className="absolute inset-y-0 left-0 rounded-xl" style={{ width: `${(n / (d.audience.byCountry[0][1] || 1)) * 100}%`, ...(i === 0 ? { background: "rgba(162,96,26,0.16)" } : { background: "rgba(162,96,26,0.08)" }) }} />
                  <div className="relative flex items-center justify-between px-3.5 py-2.5 text-sm">
                    <span className="text-ink">{c}</span>
                    <span className="text-muted tabular-nums">
                      <span className="font-medium text-ink">{fmt(n)}</span> · {Math.round((n / (countryTotal || 1)) * 100)}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5">
              <Empty>No registered readers yet. Visitor countries and cities from every visitor are in Google Analytics.</Empty>
            </div>
          )}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              ["Registered", d.audience.readers],
              ["Active", d.audience.activeReaders],
              ["Newsletter", d.audience.newsletter],
            ].map(([label, v]) => (
              <div key={label} className="rounded-xl ring-1 ring-black/[0.06] px-3 py-2.5">
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-0.5 text-lg font-medium tabular-nums">{fmt(Number(v))}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 6. Needs you */}
        <Card className="lg:col-span-3">
          <CardHead title="Needs you" note={waiting.length ? `${waiting.length} ${waiting.length === 1 ? "thing" : "things"} waiting` : "All clear"} />
          {waiting.length ? (
            <ul className="mt-4 divide-y divide-black/[0.06]">
              {waiting.map((x) => (
                <li key={x.title}>
                  <Link href={x.href} className="group flex items-center gap-3 py-3">
                    <span className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums ${x.tone}`}>{x.n}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.95rem] font-medium text-ink">{x.n === 1 ? `1 ${x.one}` : `${x.n} ${x.title}`}</span>
                      <span className="block text-sm text-muted">{x.note}</span>
                    </span>
                    <Chevron className="size-4 text-muted transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 flex flex-col items-start">
              <span className="grid size-11 place-items-center rounded-full bg-[#e9f3ea] text-[#2f6b3a]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <p className="mt-4 text-[0.95rem] font-medium text-ink">Nothing is waiting.</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">New messages, book orders and reader feedback appear here until someone marks them as handled.</p>
              <Link href="/admin/inbox" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-bronze">
                Open the inbox
                <Chevron />
              </Link>
            </div>
          )}
        </Card>

        {/* 7. Literature table */}
        <Card className="lg:col-span-8">
          <div id="literature" className="scroll-mt-6" />
          <CardHead title="Literature performance" note="Completion = books finished ÷ reading starts. A click never counts as a completed reading." />
          <div className="-mx-2 mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted">
                  {["Book", "Views", "Starts", "25%", "50%", "75%", "Finished", "Rate", "Notes", "Amazon"].map((h) => (
                    <th key={h} className="px-2 py-2 font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {d.literature.map((b) => (
                  <tr key={b.slug} className="border-t border-black/[0.06]">
                    <td className="max-w-[14rem] truncate px-2 py-3 font-medium text-ink">{b.title}</td>
                    {[b.pageViews, b.starts, b.p25, b.p50, b.p75, b.completes].map((v, i) => (
                      <td key={i} className="px-2 py-3 text-body">
                        {fmt(v)}
                      </td>
                    ))}
                    <td className="px-2 py-3 text-body">{pct(b.completion)}</td>
                    <td className="px-2 py-3 text-body">{fmt(b.notes)}</td>
                    <td className="px-2 py-3 text-body">{fmt(b.amazon)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 8. Support */}
        <Card className="lg:col-span-4">
          <CardHead title="Support" note={p.label} action={<HeadLink href="/admin/donations">Record</HeadLink>} />
          <div className="mt-4">
            <StatRow label="Confirmed donations" value={fmt(o.donationsConfirmed)} />
            <StatRow label="Checkouts started" value={fmt(o.donateClicks)} />
            <StatRow label="Institutional orders" value={`${fmt(o.orders)} · ${fmt(o.copiesRequested)} copies`} />
            <StatRow label="Newsletter sign-ups" value={fmt(o.newsletterSignups)} />
          </div>
          {Object.keys(d.support.donationTotals).length > 0 && (
            <div className="mt-3 rounded-2xl bg-[#faf7f2] p-4 text-sm">
              {Object.entries(d.support.donationTotals).map(([k, v]) => (
                <p key={k} className="flex justify-between gap-3 py-0.5">
                  <span className="text-body">{k}</span>
                  <span className="font-medium tabular-nums">{v.toLocaleString("en-NG", { maximumFractionDigits: 2 })}</span>
                </p>
              ))}
            </div>
          )}
          {Object.keys(d.support.enquiryTopics).length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-muted">Messages by type</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(d.support.enquiryTopics).map(([k, v]) => (
                  <span key={k} className="rounded-full bg-[#faf7f2] px-2.5 py-1 text-xs text-body ring-1 ring-black/[0.05]">
                    {enquiryTypes.find((t) => t.id === k)?.label ?? k} <span className="font-medium text-ink">{v}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* 9. Traffic */}
        {LOOKER ? (
          <Card className="lg:col-span-12">
            <CardHead title="Website traffic" note="Google Analytics and Search Console, through Looker Studio" />
            <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-black/[0.06]">
              <iframe src={LOOKER} title="Looker Studio traffic report" className="h-[900px] w-full" loading="lazy" allowFullScreen sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" />
            </div>
          </Card>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-dashed border-black/10 px-5 py-4 text-sm text-muted lg:col-span-12">
            <span>Visitors, sources, devices and search queries for everyone (not only readers) are in Google Analytics.</span>
            <a href="https://analytics.google.com" target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-medium text-ink hover:text-bronze">
              Open Google Analytics
              <Chevron />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
