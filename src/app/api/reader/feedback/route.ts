import { bad, field, readJson, sendFailure, validEmail } from "@/lib/api";
import { getBook } from "@/lib/books";
import { countMetric, db, tryDb } from "@/lib/db";
import { sendToFoundation, sendToReader } from "@/lib/email";
import { currentReader } from "@/lib/reader-auth";
import { site } from "@/lib/site";

// "Send Feedback to CMF" (instructions §6.3). Separate from private notes: only what the reader
// writes here, deliberately, reaches the Foundation. Signed-in readers also receive a copy.
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return bad("Invalid request.");
  if (body.company) return Response.json({ ok: true });

  const reader = await currentReader();
  const message = field(body, "message", 5000);
  const name = reader?.name ?? field(body, "name", 120);
  const email = reader?.email ?? field(body, "email", 254).toLowerCase();
  const book = getBook(field(body, "book", 80));
  const section = field(body, "section", 200);
  if (!message) return bad("Please write your comment or question.");
  if (email && !validEmail(email)) return bad("Please enter a valid email address, or leave it blank.");

  await tryDb("feedback", () => db.insert("feedback", { reader_id: reader?.rid ?? null, book: book?.slug ?? null, section: section || null, name: name || null, email: email || null, message }));
  await countMetric("feedback_submit", book?.slug ?? "");

  const context = `${book ? `Book: ${book.title}` : "Book: (none)"}${section ? `\nSection: ${section}` : ""}`;
  try {
    await sendToFoundation({
      subject: `[CMF website] Reader feedback${book ? `: ${book.title}` : ""}`,
      text: `From: ${name || "(name not given)"} ${email ? `<${email}>` : "(no email given)"}${reader ? " (verified reader)" : ""}\n${context}\n\n${message}`,
      replyTo: email || undefined,
    });
  } catch (err) {
    return sendFailure(err, "reader/feedback");
  }
  let copied = false;
  if (reader) {
    try {
      await sendToReader({
        to: reader.email,
        subject: "Your feedback to the Chinwoke Mbadinuju Foundation",
        text: `Thank you for writing to us. This is a copy of what you sent.\n\n${context}\n\n${message}\n\n${site.name}\n${site.url}`,
      });
      copied = true;
    } catch (err) {
      console.error("[reader/feedback] copy to reader failed", err);
    }
  }
  return Response.json({ ok: true, copied });
}
