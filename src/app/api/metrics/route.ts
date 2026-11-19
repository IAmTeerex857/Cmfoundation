import { getBook } from "@/lib/books";
import { countMetric } from "@/lib/db";

// Aggregate daily counts for the management dashboard (instructions §9.4 to §9.6). Each call adds 1
// to a count for the day, event and book. Nothing about the visitor is stored: no cookie, IP
// address, identifier or text. This lets the dashboard show reading activity even for visitors who
// decline analytics cookies. Only the events below are accepted.
const allowed = new Set([
  "book_page_view",
  "reading_start",
  "chapter_complete",
  "book_complete",
  "registration_invite_shown",
  "registration_invite_continue",
  "reading_progress_25",
  "reading_progress_50",
  "reading_progress_75",
  "bookmark_create",
  "note_create",
  "notes_emailed",
  "audiobook_start",
  "audiobook_complete",
  "amazon_click",
  "donate_click",
  "donation_page_view",
]);

export async function POST(req: Request) {
  if (req.headers.get("sec-fetch-site") === "cross-site") return new Response(null, { status: 204 });
  const body = (await req.json().catch(() => null)) as { event?: string; book?: string } | null;
  const event = String(body?.event ?? "");
  const book = String(body?.book ?? "");
  if (allowed.has(event)) await countMetric(event, getBook(book) ? book : book.match(/^[a-z]+$/) ? book : "");
  return new Response(null, { status: 204 });
}
