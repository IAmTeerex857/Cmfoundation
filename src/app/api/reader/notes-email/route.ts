import { bad, readJson, sendFailure } from "@/lib/api";
import { getBook } from "@/lib/books";
import { sendToReader } from "@/lib/email";
import { currentReader } from "@/lib/reader-auth";
import { site } from "@/lib/site";

// "Email My Notes": sends the reader's own notes to their verified address. The notes come from
// the reader's device; they are not stored or copied to the Foundation.
export async function POST(req: Request) {
  const reader = await currentReader();
  if (!reader) return bad("Please sign in to email your notes.", 401);
  const body = await readJson(req);
  const book = getBook(String(body?.book ?? ""));
  const notes = Array.isArray(body?.notes) ? (body!.notes as unknown[]).slice(0, 300) : [];
  if (!book || notes.length === 0) return bad("There are no notes to send.");

  const lines = notes
    .map((n) => {
      const note = n as { section?: unknown; quote?: unknown; text?: unknown; created?: unknown };
      const section = String(note.section ?? "").slice(0, 200);
      const quote = String(note.quote ?? "").slice(0, 1000);
      const text = String(note.text ?? "").slice(0, 5000);
      return `${section ? `[${section}]\n` : ""}${quote ? `“${quote}”\n` : ""}${text}`;
    })
    .filter((l) => l.trim());
  const text = `Your notes on ${book.title} by ${book.author}\n${"=".repeat(40)}\n\n${lines.join("\n\n---\n\n")}\n\nRead the book free at ${site.url}/books/${book.slug}`;
  if (text.length > 200_000) return bad("Your notes are too long to email at once.");
  try {
    await sendToReader({ to: reader.email, subject: `Your notes: ${book.title}`, text });
  } catch (err) {
    return sendFailure(err, "reader/notes-email");
  }
  return Response.json({ ok: true });
}
