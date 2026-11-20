import { EMAIL_PATTERN, EmailNotConfigured, readerEmailConfigured, sendToFoundation, sendToReader } from "@/lib/email";
import { collaborationTypes } from "@/lib/enquiries";
import { countMetric, recordEnquiry } from "@/lib/db";
import { site } from "@/lib/site";

function bad(error: string, status = 400) {
  return Response.json({ error }, { status });
}

const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

// "Propose a Collaboration" (further instructions, 20 November 2026, §5). Saved to the dashboard inbox
// first, then emailed to the Foundation; the proposer gets an acknowledgement when reader email is set up.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return bad("Invalid request.");
  if (body.company) return Response.json({ ok: true }); // honeypot

  const organisation = clip(body.organisation, 160);
  const name = clip(body.name, 120);
  const email = clip(body.email, 254);
  const type = collaborationTypes.find((t) => t === body.type);
  const objective = clip(body.objective, 600);
  const message = clip(body.message, 5000);

  if (!organisation || !name || !email || !type || !objective || !message) return bad("Please complete all required fields.");
  if (!EMAIL_PATTERN.test(email)) return bad("Please enter a valid email address.");

  await recordEnquiry({ kind: "contact", topic: "collaboration", name, email, payload: { organisation, type, objective, message } });
  await countMetric("enquiry_collaboration");

  try {
    await sendToFoundation({
      subject: `[CMF website] Collaboration proposal: ${organisation}`,
      text: `Organisation: ${organisation}\nContact: ${name}\nEmail: ${email}\nType of collaboration: ${type}\n\nObjective:\n${objective}\n\nMessage:\n${message}`,
      replyTo: email,
    });
  } catch (err) {
    // The proposal is already in the dashboard inbox, so the proposer is not asked to send it again.
    console.error("[collaborate] send failed", err instanceof EmailNotConfigured ? err.message : err);
  }

  if (readerEmailConfigured()) {
    await sendToReader({
      to: email,
      subject: "We have received your collaboration proposal",
      text: `Dear ${name},\n\nThank you for proposing a collaboration with the ${site.name} on behalf of ${organisation}. We have received it, and the right person at the Foundation will reply.\n\nEach proposal is assessed and approved by the Foundation before any project is represented as a CMF initiative.\n\nYour proposal\nType: ${type}\nObjective: ${objective}\n\nWith thanks,\n${site.name}\n${site.url}`,
    }).catch((err) => console.error("[collaborate] acknowledgement failed", err));
  }

  return Response.json({ ok: true });
}
