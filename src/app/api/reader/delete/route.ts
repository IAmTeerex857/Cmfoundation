import { bad, readJson, sendFailure } from "@/lib/api";
import { dbConfigured } from "@/lib/db";
import { sendToFoundation, sendToReader } from "@/lib/email";
import { currentReader, endSession } from "@/lib/reader-auth";
import { deleteReader, exportReader } from "@/lib/readers";
import { site } from "@/lib/site";

// Account deletion and data-access requests (instructions §10.2).
// - "access": the reader is emailed a copy of everything held about them.
// - "delete": the account and its notes, bookmarks and reading history are deleted at once.
// The Foundation is told about each request. Without a database, both become requests to the Foundation.
export async function POST(req: Request) {
  const body = await readJson(req);
  const reader = await currentReader();
  if (!body || !reader) return bad("Please sign in first.", 401);
  const kind = body.kind === "access" ? "access" : "delete";

  try {
    if (dbConfigured() && reader.rid) {
      if (kind === "access") {
        const data = await exportReader(reader.rid);
        await sendToReader({
          to: reader.email,
          subject: "Your personal information held by the Chinwoke Mbadinuju Foundation",
          text: `As you asked, this is all the personal information our website holds about you, in a structured format.\n\n${JSON.stringify(data, null, 2)}\n\nTo correct anything, reply to this email.\n\n${site.name}`,
        });
      } else {
        await deleteReader(reader.rid);
      }
    }
    await sendToFoundation({
      subject: `[CMF website] Reader ${kind === "delete" ? "account deleted" : "data access request"}`,
      text:
        dbConfigured() && reader.rid
          ? `${reader.email} ${kind === "delete" ? "deleted their reader account. Their data has been removed from the database. Please also remove them from any mailing list." : "requested their data. A copy was emailed to them automatically."}`
          : `Reader: ${reader.name ?? ""} <${reader.email}>\nRequest: ${kind === "delete" ? "Delete my reader account and the registration details you hold." : "Send me a copy of the personal information you hold about me."}\nPlease action within 30 days and reply to the reader.`,
      replyTo: reader.email,
    });
  } catch (err) {
    return sendFailure(err, "reader/delete");
  }
  if (kind === "delete") await endSession();
  return Response.json({ ok: true, automatic: dbConfigured() && Boolean(reader.rid) });
}
