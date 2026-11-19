import "server-only";
import { EMAIL_PATTERN, EmailNotConfigured } from "./email";
import { site } from "./site";

// Small helpers shared by the form endpoints.

export function bad(error: string, status = 400) {
  return Response.json({ error }, { status });
}

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  // Same-site browsers only: a cross-site page cannot post to these endpoints.
  if (req.headers.get("sec-fetch-site") === "cross-site") return null;
  const body = await req.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
}

export const field = (body: Record<string, unknown>, key: string, max: number) => String(body[key] ?? "").trim().slice(0, max);

export const validEmail = (email: string) => EMAIL_PATTERN.test(email);

/** Turns a failed send into the right response; in development an unconfigured mailer counts as success. */
export function sendFailure(err: unknown, label: string) {
  if (err instanceof EmailNotConfigured) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[${label}] email not configured; accepted in development only`);
      return Response.json({ ok: true, dev: true });
    }
    console.error(`[${label}]`, err.message);
    return bad(`This is temporarily unavailable. Please email ${site.contact.email}.`, 503);
  }
  console.error(`[${label}] send failed`, err);
  return bad(`Something went wrong. Please try again or email ${site.contact.email}.`, 502);
}
