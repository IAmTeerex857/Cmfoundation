import "server-only";

// Cloudflare Email Service (https://developers.cloudflare.com/email-service/): the only email provider
// the site uses. Mail to @cm.foundation is received by Cloudflare Email Routing and forwarded to the
// Foundation's inbox; the website sends through the Email Sending REST API.
//   CLOUDFLARE_ACCOUNT_ID    the Cloudflare account that has cm.foundation onboarded for sending
//   CLOUDFLARE_EMAIL_TOKEN   API token with the "Email Sending: Edit" permission
//   CONTACT_TO               inbox(es) that receive website messages, comma-separated
//   CONTACT_FROM             sender on the onboarded domain, e.g. "CMF Website <website@cm.foundation>"

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class EmailNotConfigured extends Error {}

function config() {
  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_EMAIL_TOKEN, CONTACT_TO, CONTACT_FROM } = process.env;
  return { accountId: CLOUDFLARE_ACCOUNT_ID?.trim(), token: CLOUDFLARE_EMAIL_TOKEN?.trim(), to: CONTACT_TO, from: CONTACT_FROM };
}

export function emailConfigured() {
  const { accountId, token, to, from } = config();
  return Boolean(accountId && token && to && from);
}

/** "CMF Website <website@cm.foundation>" → { name, email }; a bare address stays a string. */
function sender(value: string) {
  const match = value.trim().match(/^(.*?)\s*<([^>]+)>$/);
  if (!match) return value.trim();
  const name = match[1].replace(/^"|"$/g, "").trim();
  return name ? { email: match[2].trim(), name } : match[2].trim();
}

/** Sends a plain-text message to the Foundation inbox. */
export async function sendToFoundation({ subject, text, replyTo }: { subject: string; text: string; replyTo?: string }) {
  const { accountId, token, to, from } = config();
  if (!accountId || !token || !to || !from) throw new EmailNotConfigured("CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_EMAIL_TOKEN / CONTACT_TO / CONTACT_FROM not set");

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/email/sending/send`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: sender(from),
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      text,
    }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as { success?: boolean; errors?: { code: number; message: string }[] } | null;
  if (!res.ok || !data?.success) throw new Error(`Cloudflare email ${res.status}: ${JSON.stringify(data?.errors ?? data)}`);
}

/** Newsletter sign-ups are emailed to the Foundation inbox, which keeps the subscriber list. */
export async function subscribe(email: string) {
  await sendToFoundation({ subject: "[CMF website] Newsletter sign-up", text: `Please add ${email} to the CMF newsletter.`, replyTo: email });
}
