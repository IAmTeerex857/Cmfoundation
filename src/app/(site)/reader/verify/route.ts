import { countMetric, dbConfigured } from "@/lib/db";
import { sendToFoundation } from "@/lib/email";
import { isAdminEmail, readLinkToken, safeNext, startSession } from "@/lib/reader-auth";
import { consumeLink, findReader, saveRegistration, touchReader } from "@/lib/readers";

// Step 2: the reader follows the emailed link. A valid, unexpired, unused link starts a session.
// Each link works once. A new registration is saved to the reader database (and, without one, emailed
// to the Foundation inbox as the register of readers).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const payload = readLinkToken(url.searchParams.get("token") ?? undefined);
  const expired = () => Response.redirect(new URL("/reader/sign-in?expired=1", url), 303);
  if (!payload) return expired();
  try {
    if (!(await consumeLink(payload.n))) return expired();
  } catch (err) {
    console.error("[reader/verify] link check failed", err);
    return expired();
  }

  const dest = new URL(safeNext(payload.next), url);

  if (payload.purpose === "register") {
    const { reg } = payload;
    let rid: string | undefined;
    let isNew = true;
    if (dbConfigured()) {
      try {
        const saved = await saveRegistration(reg);
        rid = saved.row.id;
        isNew = saved.isNew;
      } catch (err) {
        console.error("[reader/verify] could not save registration", err);
      }
    }
    await startSession({ email: reg.email, rid, name: reg.name, country: reg.country });
    if (isNew) await countMetric("registration_verified");
    if (reg.subscribe) await countMetric("newsletter_optin", "registration");
    // Without a database, the Foundation inbox is the register of readers.
    if (!dbConfigured() || reg.subscribe) {
      try {
        await sendToFoundation({
          subject: `[CMF website] ${dbConfigured() ? "Reader newsletter opt-in" : "New verified reader"}${reg.subscribe ? " (newsletter: yes)" : ""}`,
          text: [
            `Name: ${reg.name}`,
            `Email: ${reg.email}`,
            `Country: ${reg.country}`,
            `City or state: ${reg.city ?? "(not given)"}`,
            `Newsletter and publication emails: ${reg.subscribe ? "YES, opted in" : "No (do not add to mailing lists)"}`,
            `Verified: ${new Date().toISOString()}`,
          ].join("\n"),
          replyTo: reg.email,
        });
      } catch (err) {
        console.error("[reader/verify] could not notify the Foundation", err);
      }
    }
    dest.searchParams.set("welcome", "1");
  } else {
    const reader = await findReader(payload.email).catch(() => null);
    if (!reader && dbConfigured() && !isAdminEmail(payload.email)) {
      return Response.redirect(new URL(`/reader/register?unknown=1&next=${encodeURIComponent(safeNext(payload.next))}`, url), 303);
    }
    await startSession({ email: payload.email, rid: reader?.id, name: reader?.name, country: reader?.country });
    if (reader) await touchReader(reader.id).catch(() => null);
    dest.searchParams.set("signedin", "1");
  }
  return Response.redirect(dest, 303);
}
