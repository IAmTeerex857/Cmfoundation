import "server-only";
import { launchTitles, getBook } from "./books";
import { db, gte } from "./db";

// Figures for the management dashboard and the automated reports (instructions §9.8, §9.9).
// All figures come from the Foundation's own database: aggregate daily counts (no personal data),
// reader registrations, enquiries and confirmed donations. Website traffic (visitors, sources,
// devices) comes from Google Analytics and is shown through Looker Studio.

type Metric = { day: string; event: string; book: string; count: number };

export type Period = { days: number; since: string; prevSince: string; label: string };

const lagosDay = (ms: number) => new Date(ms).toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });

export function period(days: number): Period {
  const d = [1, 7, 30, 90, 365].includes(days) ? days : 30;
  const since = lagosDay(Date.now() - (d - 1) * 86400000);
  const prevSince = lagosDay(Date.now() - (2 * d - 1) * 86400000);
  return { days: d, since, prevSince, label: d === 1 ? "Today" : `Last ${d} days` };
}

export async function dashboard(p: Period) {
  const sinceTs = `${p.since}T00:00:00+01:00`;
  const prevTs = `${p.prevSince}T00:00:00+01:00`;
  const [allMetrics, readersAll, readersNew, enquiries, feedback, donations, newsletter, returning, countries, readersPrev, newMessages, newOrders, newFeedback] = await Promise.all([
    db.select<Metric>("daily_metrics", { day: gte(p.prevSince) }),
    db.count("readers", { deleted_at: "is.null" }),
    db.count("readers", { created_at: gte(sinceTs) }),
    db.select<{ kind: string; topic: string | null; book: string | null; quantity: number | null; created_at: string }>("enquiries", {
      select: "kind,topic,book,quantity,created_at",
      created_at: gte(sinceTs),
    }),
    db.count("feedback", { created_at: gte(sinceTs) }),
    db.select<{ amount: number; currency: string; category: string; received_on: string }>("donations", { select: "amount,currency,category,received_on", received_on: gte(p.since) }),
    db.count("readers", { newsletter: "is.true", deleted_at: "is.null" }),
    db.count("readers", { last_seen_at: gte(sinceTs), deleted_at: "is.null" }),
    db.select<{ country: string }>("readers", { select: "country", deleted_at: "is.null" }),
    db.count("readers", { and: `(created_at.gte.${encodeURIComponent(prevTs)},created_at.lt.${encodeURIComponent(sinceTs)})` }),
    db.count("enquiries", { kind: "eq.contact", status: "eq.new" }),
    db.count("enquiries", { kind: "eq.order", status: "eq.new" }),
    db.count("feedback", { status: "eq.new" }),
  ]);
  const metrics = allMetrics.filter((m) => m.day >= p.since);
  const prevSum = (event: string) => allMetrics.filter((m) => m.day < p.since && m.event === event).reduce((n, m) => n + m.count, 0);

  const sum = (event: string, book?: string) => metrics.filter((m) => m.event === event && (book === undefined || m.book === book)).reduce((n, m) => n + m.count, 0);

  const literature = launchTitles.map((slug) => {
    const starts = sum("reading_start", slug);
    const completes = sum("book_complete", slug);
    return {
      slug,
      title: getBook(slug)?.title ?? slug,
      pageViews: sum("book_page_view", slug),
      starts,
      p25: sum("reading_progress_25", slug),
      p50: sum("reading_progress_50", slug),
      p75: sum("reading_progress_75", slug),
      chapters: sum("chapter_complete", slug),
      completes,
      completion: starts ? completes / starts : null,
      notes: sum("note_create", slug),
      bookmarks: sum("bookmark_create", slug),
      amazon: sum("amazon_click", slug),
    };
  });

  const byCountry = Object.entries(countries.reduce<Record<string, number>>((acc, r) => ((acc[r.country] = (acc[r.country] ?? 0) + 1), acc), {}))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  const days: Record<string, { starts: number; registrations: number; enquiries: number }> = {};
  for (let i = 0; i < p.days; i++) {
    const d = new Date(Date.parse(`${p.since}T12:00:00Z`) + i * 86400000).toISOString().slice(0, 10);
    days[d] = { starts: 0, registrations: 0, enquiries: 0 };
  }
  for (const m of metrics) {
    if (!days[m.day]) continue;
    if (m.event === "reading_start") days[m.day].starts += m.count;
    if (m.event === "registration_verified") days[m.day].registrations += m.count;
  }
  for (const e of enquiries) {
    const d = new Date(e.created_at).toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
    if (days[d] && e.kind !== "newsletter") days[d].enquiries += 1;
  }

  const donationTotals = donations.reduce<Record<string, number>>((acc, d) => ((acc[`${d.currency} · ${d.category}`] = (acc[`${d.currency} · ${d.category}`] ?? 0) + Number(d.amount)), acc), {});
  const enquiryTopics = enquiries
    .filter((e) => e.kind === "contact")
    .reduce<Record<string, number>>((acc, e) => ((acc[e.topic ?? "other"] = (acc[e.topic ?? "other"] ?? 0) + 1), acc), {});
  const donateClicks = metrics.filter((m) => m.event === "donate_click").reduce<Record<string, number>>((acc, m) => ((acc[m.book || "general"] = (acc[m.book || "general"] ?? 0) + m.count), acc), {});

  return {
    previous: { readingStarts: prevSum("reading_start"), bookPageViews: prevSum("book_page_view"), registrations: readersPrev },
    needs: { messages: newMessages, orders: newOrders, feedback: newFeedback },
    overview: {
      readingStarts: sum("reading_start"),
      bookPageViews: sum("book_page_view"),
      chaptersCompleted: sum("chapter_complete"),
      booksCompleted: sum("book_complete"),
      registrations: readersNew,
      invitesShown: sum("registration_invite_shown"),
      enquiries: enquiries.filter((e) => e.kind === "contact").length,
      orders: enquiries.filter((e) => e.kind === "order").length,
      copiesRequested: enquiries.filter((e) => e.kind === "order").reduce((n, e) => n + (e.quantity ?? 0), 0),
      feedback,
      newsletterSignups: enquiries.filter((e) => e.kind === "newsletter").length + sum("newsletter_optin", "registration"),
      donationsConfirmed: donations.length,
      donateClicks: sum("donate_click"),
    },
    literature,
    audience: { readers: readersAll, newReaders: readersNew, activeReaders: returning, newsletter, byCountry },
    support: { donationTotals, donateClicks, enquiryTopics },
    days,
  };
}

export type Dashboard = Awaited<ReturnType<typeof dashboard>>;
