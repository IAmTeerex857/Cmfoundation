import "server-only";

// Resend (https://resend.com) — the only email provider the site uses.
//   RESEND_API_KEY      API key with "sending" access (and "full access" if RESEND_SEGMENT_ID is used)
//   CONTACT_TO          inbox(es) that receive website messages, comma-separated
//   CONTACT_FROM        sender on a domain verified in Resend, e.g. "CMF Website <website@cm.foundation>"
//   RESEND_SEGMENT_ID   optional: newsletter sign-ups are added to this Resend segment

const API = "https://api.resend.com";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class EmailNotConfigured extends Error {}

function config() {
  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM, RESEND_SEGMENT_ID } = process.env;
  return { apiKey: RESEND_API_KEY, to: CONTACT_TO, from: CONTACT_FROM, segmentId: RESEND_SEGMENT_ID };
}

export function emailConfigured() {
  const { apiKey, to, from } = config();
  return Boolean(apiKey && to && from);
}

async function resend(path: string, body: unknown) {
  const { apiKey } = config();
  if (!apiKey) throw new EmailNotConfigured("RESEND_API_KEY is not set");
  return fetch(`${API}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
}

/** Sends a plain-text message to the Foundation inbox. */
export async function sendToFoundation({ subject, text, replyTo }: { subject: string; text: string; replyTo?: string }) {
  const { to, from } = config();
  if (!emailConfigured() || !to || !from) throw new EmailNotConfigured("RESEND_API_KEY / CONTACT_TO / CONTACT_FROM not set");
  const res = await resend("/emails", {
    from,
    to: to.split(",").map((s) => s.trim()),
    ...(replyTo ? { reply_to: replyTo } : {}),
    subject,
    text,
  });
  if (!res.ok) throw new Error(`Resend /emails ${res.status}: ${await res.text().catch(() => "")}`);
}

/**
 * Adds a newsletter subscriber. With RESEND_SEGMENT_ID set, the address becomes a Resend contact in
 * that segment (ready for Broadcasts). Without it, the sign-up is emailed to the Foundation inbox.
 */
export async function subscribe(email: string) {
  const { segmentId } = config();
  if (!segmentId) {
    await sendToFoundation({ subject: "[CMF website] Newsletter sign-up", text: `Please add ${email} to the CMF newsletter.`, replyTo: email });
    return;
  }
  const res = await resend("/contacts", { email, unsubscribed: false, segments: [{ id: segmentId }] });
  // An existing contact is not an error for the subscriber.
  if (res.ok || res.status === 409) return;
  const detail = await res.text().catch(() => "");
  if (res.status === 422 && /already exists/i.test(detail)) return;
  throw new Error(`Resend /contacts ${res.status}: ${detail}`);
}
