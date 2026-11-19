import { bad, field, readJson, sendFailure, validEmail } from "@/lib/api";
import { isCountry } from "@/lib/countries";
import { sendToReader } from "@/lib/email";
import { AuthNotConfigured, createLinkToken, safeNext } from "@/lib/reader-auth";
import { site } from "@/lib/site";

// Step 1 of a free reader account: check the details and email a sign-in link that expires in 30
// minutes. Nothing is stored until the reader follows the link (see /reader/verify).
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return bad("Invalid request.");
  if (body.company) return Response.json({ ok: true }); // honeypot

  const name = field(body, "name", 120);
  const email = field(body, "email", 254).toLowerCase();
  const country = field(body, "country", 80);
  const city = field(body, "city", 120) || undefined;
  if (!name || !email || !country) return bad("Please enter your name, country and email address.");
  if (!validEmail(email)) return bad("Please enter a valid email address.");
  if (!isCountry(country)) return bad("Please choose your country from the list.");
  if (body.acknowledge !== true) return bad("Please confirm that you have read the Privacy Policy.");

  let link: string;
  try {
    const token = createLinkToken({ purpose: "register", reg: { name, email, country, city, subscribe: body.subscribe === true }, next: safeNext(body.next) });
    link = `${new URL(req.url).origin}/reader/verify?token=${token}`;
  } catch (err) {
    if (err instanceof AuthNotConfigured) return bad(`Reader accounts are not available yet. Please email ${site.contact.email}.`, 503);
    throw err;
  }

  try {
    await sendToReader({
      to: email,
      subject: "Confirm your free CMF reader account",
      text: `Dear ${name},\n\nThank you for creating a free reader account with the ${site.name}.\n\nPlease confirm your email address by opening this link within 30 minutes:\n\n${link}\n\nIf you did not ask for an account, you can ignore this email and nothing will be created.\n\nWith every good wish,\n${site.name}\n${site.url}`,
    });
  } catch (err) {
    const res = sendFailure(err, "reader/register");
    // In development, hand the link back so the flow can be tested without an email provider.
    if (res.status === 200) return Response.json({ ok: true, devLink: link });
    return res;
  }
  return Response.json({ ok: true });
}
