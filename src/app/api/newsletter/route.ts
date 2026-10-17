import { EMAIL_PATTERN, EmailNotConfigured, subscribe } from "@/lib/email";

function bad(error: string, status = 400) {
  return Response.json({ error }, { status });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return bad("Invalid request.");
  if (body.company) return Response.json({ ok: true }); // honeypot tripped — pretend success

  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 254);
  if (!EMAIL_PATTERN.test(email)) return bad("Please enter a valid email address.");

  try {
    await subscribe(email);
  } catch (err) {
    if (err instanceof EmailNotConfigured && process.env.NODE_ENV !== "production") {
      console.info("[newsletter] email not configured — sign-up accepted in development only");
      return Response.json({ ok: true });
    }
    console.error("[newsletter] sign-up failed", err);
    return bad("Sign-up is temporarily unavailable. Please try again later.", 503);
  }
  return Response.json({ ok: true });
}
