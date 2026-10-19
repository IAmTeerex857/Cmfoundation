import "server-only";

// Website email: contact messages and newsletter sign-ups are sent to the Foundation inbox.
// Mail to @cm.foundation is received by Cloudflare Email Routing and forwarded to the Foundation's Gmail.
//
// Sending uses Resend when RESEND_API_KEY is set (cm.foundation is verified there, so mail passes
// SPF, DKIM and DMARC), otherwise Cloudflare Email Service:
//   RESEND_API_KEY           Resend API key with sending access for cm.foundation
//   CLOUDFLARE_ACCOUNT_ID    Cloudflare account with Email Routing on cm.foundation (fallback)
//   CLOUDFLARE_EMAIL_TOKEN   Cloudflare API token with the "Email Sending: Edit" permission (fallback)
//   CONTACT_TO               inbox(es) that receive website messages, comma-separated. With Cloudflare on
//                            the free plan, each must be a verified Email Routing destination.
//   CONTACT_FROM             sender on cm.foundation, e.g. "CMF Website <website@cm.foundation>"

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class EmailNotConfigured extends Error {}

type Message = { from: string; to: string[]; subject: string; text: string; replyTo?: string };

function config() {
  const { RESEND_API_KEY, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_EMAIL_TOKEN, CONTACT_TO, CONTACT_FROM } = process.env;
  return {
    resendKey: RESEND_API_KEY?.trim(),
    accountId: CLOUDFLARE_ACCOUNT_ID?.trim(),
    cfToken: CLOUDFLARE_EMAIL_TOKEN?.trim(),
    to: CONTACT_TO?.split(",").map((s) => s.trim()).filter(Boolean) ?? [],
    from: CONTACT_FROM?.trim(),
  };
}

export function emailConfigured() {
  const { resendKey, accountId, cfToken, to, from } = config();
  return Boolean((resendKey || (accountId && cfToken)) && to.length && from);
}

async function sendWithResend(key: string, m: Message) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: m.from, to: m.to, ...(m.replyTo ? { reply_to: m.replyTo } : {}), subject: m.subject, text: m.text }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text().catch(() => "")}`);
}

/** "CMF Website <website@cm.foundation>" → { address, name } (Cloudflare's named-address shape); a bare address stays a string. */
function cloudflareAddress(value: string) {
  const match = value.match(/^(.*?)\s*<([^>]+)>$/);
  if (!match) return value;
  const name = match[1].replace(/^"|"$/g, "").trim();
  return name ? { address: match[2].trim(), name } : match[2].trim();
}

async function sendWithCloudflare(accountId: string, token: string, m: Message) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/email/sending/send`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: cloudflareAddress(m.from), to: m.to, ...(m.replyTo ? { reply_to: m.replyTo } : {}), subject: m.subject, text: m.text }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as { success?: boolean; errors?: { code: number; message: string }[] } | null;
  if (!res.ok || !data?.success) throw new Error(`Cloudflare email ${res.status}: ${JSON.stringify(data?.errors ?? data)}`);
}

/** Sends a plain-text message to the Foundation inbox. */
export async function sendToFoundation({ subject, text, replyTo }: { subject: string; text: string; replyTo?: string }) {
  const { resendKey, accountId, cfToken, to, from } = config();
  if (!emailConfigured() || !from) throw new EmailNotConfigured("No email provider configured (RESEND_API_KEY, or CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_EMAIL_TOKEN), or CONTACT_TO / CONTACT_FROM missing");
  const message = { from, to, subject, text, replyTo };
  if (resendKey) await sendWithResend(resendKey, message);
  else await sendWithCloudflare(accountId!, cfToken!, message);
}

/** Newsletter sign-ups are emailed to the Foundation inbox, which keeps the subscriber list. */
export async function subscribe(email: string) {
  await sendToFoundation({ subject: "[CMF website] Newsletter sign-up", text: `Please add ${email} to the CMF newsletter.`, replyTo: email });
}
