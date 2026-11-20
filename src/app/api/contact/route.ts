import { EMAIL_PATTERN, EmailNotConfigured, readerEmailConfigured, sendToFoundation, sendToReader } from "@/lib/email";
import { enquiryTypes, isEnquiryType } from "@/lib/enquiries";
import { countMetric, recordEnquiry } from "@/lib/db";
import { site } from "@/lib/site";

function bad(error: string, status = 400) {
  return Response.json({ error }, { status });
}

// Delivers contact-form messages to the Foundation inbox through Cloudflare Email Service (see lib/email.ts).
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return bad("Invalid request.");

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 254);
  const message = String(body.message ?? "").trim().slice(0, 5000);
  const enquiry = isEnquiryType(body.enquiry) && body.enquiry !== "collaboration" ? body.enquiry : null;

  if (body.company) return Response.json({ ok: true }); // honeypot tripped: pretend success
  if (!name || !email || !message || !enquiry) return bad("Please complete all required fields.");
  if (!EMAIL_PATTERN.test(email)) return bad("Please enter a valid email address.");

  const label = enquiryTypes.find((t) => t.id === enquiry)!.label;
  await recordEnquiry({ kind: "contact", topic: enquiry, name, email, payload: { message } });
  await countMetric(`enquiry_${enquiry}`);
  try {
    await sendToFoundation({
      subject: `[CMF website] ${label}: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nEnquiry: ${label}\n\n${message}`,
      replyTo: email,
    });
  } catch (err) {
    if (err instanceof EmailNotConfigured) {
      if (process.env.NODE_ENV !== "production") {
        console.info("[contact] email not configured; message accepted in development only:", { enquiry, name, email });
        return Response.json({ ok: true });
      }
      console.error("[contact]", err.message);
      return bad(`Our contact form is temporarily unavailable. Please email ${site.contact.email}.`, 503);
    }
    console.error("[contact] send failed", err);
    return bad(`Your message could not be sent. Please try again or email ${site.contact.email}.`, 502);
  }
  // Acknowledge receipt (further instructions §5). Never blocks the reply to the visitor.
  if (readerEmailConfigured()) {
    await sendToReader({
      to: email,
      subject: "We have received your message",
      text: `Dear ${name},\n\nThank you for writing to the ${site.name}. We have received your message (${label}), and the right person at the Foundation will reply.\n\nWith thanks,\n${site.name}\n${site.url}`,
    }).catch((err) => console.error("[contact] acknowledgement failed", err));
  }
  return Response.json({ ok: true });
}
