// Measurement events (instructions §9). Events go to the Google Tag Manager data layer, and also to
// gtag when GA4 is installed directly. Nothing is sent until the visitor accepts analytics cookies
// (components/analytics.tsx loads no tags before that), and events never carry names, email
// addresses, notes or anything else that identifies a reader (§9.5).
//
// The full list of events, with their parameters, is in docs/ANALYTICS.md.

export type AnalyticsEvent =
  | "book_page_view"
  | "reading_start"
  | "chapter_reached"
  | "chapter_complete"
  | "reading_progress"
  | "book_complete"
  | "registration_invite_shown"
  | "registration_invite_continue"
  | "registration_submitted"
  | "sign_up"
  | "login"
  | "bookmark_create"
  | "note_create"
  | "notes_emailed"
  | "feedback_submit"
  | "audiobook_start"
  | "audiobook_progress"
  | "amazon_click"
  | "institutional_order_submit"
  | "donate_click"
  | "donation_page_view"
  | "generate_lead"
  | "newsletter_signup";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Events also counted, without cookies or identifiers, in the Foundation's own dashboard (api/metrics).
const COUNTED = new Set<AnalyticsEvent>([
  "book_page_view",
  "reading_start",
  "chapter_complete",
  "book_complete",
  "registration_invite_shown",
  "registration_invite_continue",
  "bookmark_create",
  "note_create",
  "notes_emailed",
  "audiobook_start",
  "amazon_click",
  "donate_click",
  "donation_page_view",
]);

function count(event: string, book: unknown) {
  try {
    const body = JSON.stringify({ event, book: typeof book === "string" ? book : "" });
    if (!navigator.sendBeacon?.("/api/metrics", new Blob([body], { type: "application/json" }))) {
      fetch("/api/metrics", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  } catch {}
}

export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
  if (COUNTED.has(event)) count(event, params.book ?? params.category);
  if (event === "reading_progress") count(`reading_progress_${params.percent}`, params.book);
  try {
    if (window.gtag) window.gtag("event", event, clean);
    else (window.dataLayer ??= []).push({ event, ...clean });
  } catch {
    // Measurement must never break the page.
  }
}
