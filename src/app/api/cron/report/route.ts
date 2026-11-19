import { dashboard, type Dashboard, period } from "@/lib/admin-data";
import { db, dbConfigured } from "@/lib/db";
import { sendToReader } from "@/lib/email";
import { site } from "@/lib/site";

// Automated management reports (instructions §9.9), run by Vercel Cron each morning (vercel.json):
// - every day: the daily management summary (yesterday's figures are in "last 7 days" context)
// - Mondays: the weekly reader-engagement report
// - the 1st of each month: the monthly strategic performance report
// Recipients: REPORT_TO (comma-separated). Vercel sends CRON_SECRET as a bearer token; anything else is refused.

export const dynamic = "force-dynamic";

const n = (v: number) => v.toLocaleString("en-GB");
const pct = (v: number | null) => (v === null ? "–" : `${Math.round(v * 100)}%`);

function report(title: string, label: string, d: Dashboard, detailed: boolean) {
  const o = d.overview;
  const lines = [
    `${title}`,
    `${site.name} · ${label}`,
    "",
    "OVERVIEW",
    `  Reading starts ............ ${n(o.readingStarts)}`,
    `  Book page views ........... ${n(o.bookPageViews)}`,
    `  Chapters completed ........ ${n(o.chaptersCompleted)}`,
    `  Books completed ........... ${n(o.booksCompleted)}`,
    `  New reader registrations .. ${n(o.registrations)}`,
    `  Enquiries ................. ${n(o.enquiries)}`,
    `  Institutional orders ...... ${n(o.orders)} (${n(o.copiesRequested)} copies)`,
    `  Reader feedback ........... ${n(o.feedback)}`,
    `  Newsletter opt-ins ........ ${n(o.newsletterSignups)}`,
    `  Checkout starts ........... ${n(o.donateClicks)}`,
    `  Confirmed donations ....... ${n(o.donationsConfirmed)}`,
  ];
  if (detailed) {
    lines.push("", "LITERATURE PERFORMANCE (starts / 50% / completed / completion estimate)");
    for (const b of d.literature) lines.push(`  ${b.title.padEnd(32)} ${n(b.starts)} / ${n(b.p50)} / ${n(b.completes)} / ${pct(b.completion)}`);
    lines.push("", "AUDIENCE", `  Registered readers: ${n(d.audience.readers)} (${n(d.audience.newReaders)} new, ${n(d.audience.activeReaders)} returning)`, `  Newsletter list: ${n(d.audience.newsletter)}`);
    if (d.audience.byCountry.length) lines.push(`  Top countries: ${d.audience.byCountry.slice(0, 6).map(([c, v]) => `${c} ${v}`).join(", ")}`);
    const totals = Object.entries(d.support.donationTotals);
    if (totals.length) lines.push("", "CONFIRMED DONATIONS", ...totals.map(([k, v]) => `  ${k}: ${v.toLocaleString("en-NG")}`));
  }
  lines.push(
    "",
    "Figures come from the website's own records (counts only, no personal data). Website traffic, sources and devices are in Google Analytics / Looker Studio.",
    `Dashboard: ${site.url}/admin`,
  );
  return lines.join("\n");
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorised", { status: 401 });
  if (!dbConfigured()) return Response.json({ skipped: "database not configured" });

  // Retention rules from the Privacy Policy (§10.2), applied daily.
  const ago = (days: number) => encodeURIComponent(new Date(Date.now() - days * 86400000).toISOString());
  await Promise.allSettled([
    db.remove("used_links", { used_at: `lt.${ago(1)}` }),
    db.remove("readers", { last_seen_at: `lt.${ago(3 * 365)}` }),
    db.remove("enquiries", { created_at: `lt.${ago(2 * 365)}`, status: "in.(done,archived)" }),
    db.remove("feedback", { created_at: `lt.${ago(2 * 365)}`, status: "in.(replied,archived)" }),
  ]);
  const to = (process.env.REPORT_TO ?? process.env.CONTACT_TO ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!to.length) return Response.json({ skipped: "no REPORT_TO" });

  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" }));
  const forced = new URL(req.url).searchParams.get("period");
  const jobs: [string, string, number, boolean][] = [];
  if (!forced || forced === "daily") jobs.push(["CMF daily management summary", "Last 24 hours and the past 7 days", 7, false]);
  if (forced === "weekly" || (!forced && now.getDay() === 1)) jobs.push(["CMF weekly reader-engagement report", "Last 7 days", 7, true]);
  if (forced === "monthly" || (!forced && now.getDate() === 1)) jobs.push(["CMF monthly strategic performance report", "Last 30 days", 30, true]);

  const sent: string[] = [];
  for (const [title, label, days, detailed] of jobs) {
    const d = await dashboard(period(days));
    const text = report(title, `${label} (to ${now.toLocaleDateString("en-GB")})`, d, detailed);
    for (const addr of to) await sendToReader({ to: addr, subject: `${title}: ${now.toLocaleDateString("en-GB")}`, text });
    sent.push(title);
  }
  return Response.json({ sent });
}
