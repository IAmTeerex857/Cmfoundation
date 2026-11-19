import { bad, field, readJson, sendFailure, validEmail } from "@/lib/api";
import { sendToReader } from "@/lib/email";
import { AuthNotConfigured, createLinkToken, safeNext } from "@/lib/reader-auth";
import { site } from "@/lib/site";

// Returning readers (or a new device): email a 30-minute sign-in link. The response is the same
// whether or not the address has registered before, so it reveals nothing about who reads here.
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return bad("Invalid request.");
  if (body.company) return Response.json({ ok: true });
  const email = field(body, "email", 254).toLowerCase();
  if (!validEmail(email)) return bad("Please enter a valid email address.");

  let link: string;
  try {
    link = `${new URL(req.url).origin}/reader/verify?token=${createLinkToken({ purpose: "sign-in", email, next: safeNext(body.next) })}`;
  } catch (err) {
    if (err instanceof AuthNotConfigured) return bad(`Reader accounts are not available yet. Please email ${site.contact.email}.`, 503);
    throw err;
  }
  try {
    await sendToReader({
      to: email,
      subject: "Your CMF reader sign-in link",
      text: `Hello,\n\nOpen this link within 30 minutes to sign in to your free CMF reader account:\n\n${link}\n\nIf you did not ask to sign in, you can ignore this email.\n\n${site.name}\n${site.url}`,
    });
  } catch (err) {
    const res = sendFailure(err, "reader/sign-in");
    if (res.status === 200) return Response.json({ ok: true, devLink: link });
    return res;
  }
  return Response.json({ ok: true });
}
