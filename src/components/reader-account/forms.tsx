"use client";

import Link from "next/link";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { countries } from "@/lib/countries";
import { Icon } from "../icons";

const submitClass =
  "inline-flex items-center gap-3 rounded-[3px] bg-bronze px-7 py-4 text-[0.82rem] leading-none font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-bronze-dark disabled:opacity-70";

function Sent({ email, devLink }: { email: string; devLink?: string }) {
  return (
    <div className="tile p-8">
      <span className="flex size-12 items-center justify-center rounded-full bg-bronze text-white">
        <Icon name="mail" className="size-6" />
      </span>
      <h2 className="display-sm mt-4">Check your email</h2>
      <p className="mt-2 leading-relaxed text-body">
        We have sent a link to <strong>{email}</strong>. Open it within 30 minutes to confirm your address. If it hasn&rsquo;t arrived, check your spam or
        promotions folder.
      </p>
      {devLink && (
        <p className="mt-4 rounded bg-blush p-3 text-xs break-all text-muted">
          Development only (no email provider configured):{" "}
          <a className="text-bronze underline" href={devLink}>
            open the confirmation link
          </a>
        </p>
      )}
    </div>
  );
}

async function post(url: string, body: object) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
  return json as { devLink?: string };
}

export function RegisterForm({ next, book }: { next: string; book?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [devLink, setDevLink] = useState<string>();

  if (state === "sent") return <Sent email={email} devLink={devLink} />;

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setError("");
        setState("sending");
        try {
          const res = await post("/api/reader/register", {
            name: f.get("name"),
            country: f.get("country"),
            city: f.get("city"),
            email: f.get("email"),
            acknowledge: f.get("acknowledge") === "on",
            subscribe: f.get("subscribe") === "on",
            company: f.get("company"),
            next,
          });
          setEmail(String(f.get("email")));
          setDevLink(res.devLink);
          setState("sent");
          track("registration_submitted", { book: book ?? "none" });
        } catch (err) {
          setError((err as Error).message);
          setState("idle");
        }
      }}
    >
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink">
          Name <span className="text-bronze">*</span>
        </span>
        <input name="name" required maxLength={120} autoComplete="name" className="field" />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">
            Country <span className="text-bronze">*</span>
          </span>
          <span className="relative block">
            <select name="country" required defaultValue="" className="field appearance-none pr-11" autoComplete="country-name">
              <option value="" disabled>
                Choose your country
              </option>
              {countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <Icon name="chevronRight" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 rotate-90 text-bronze" strokeWidth={2} />
          </span>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">
            City or state <span className="font-normal text-muted">(optional)</span>
          </span>
          <input name="city" maxLength={120} className="field" autoComplete="address-level2" />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink">
          Email address <span className="text-bronze">*</span>
        </span>
        <input name="email" type="email" required maxLength={254} autoComplete="email" className="field" />
        <span className="mt-1.5 block text-xs text-muted">We&rsquo;ll email you a link to confirm it. No password is needed.</span>
      </label>

      <label className="flex gap-3 text-[0.95rem] leading-snug text-body">
        <input type="checkbox" name="acknowledge" required className="mt-1 size-4 shrink-0 accent-[var(--color-bronze)]" />
        <span>
          I have read the{" "}
          <Link href="/privacy" target="_blank" className="text-bronze underline">
            Privacy Policy
          </Link>{" "}
          and understand how my account information will be processed. <span className="text-bronze">*</span>
        </span>
      </label>
      <label className="flex gap-3 text-[0.95rem] leading-snug text-body">
        <input type="checkbox" name="subscribe" className="mt-1 size-4 shrink-0 accent-[var(--color-bronze)]" />
        <span>
          I would like to receive occasional emails about new books, publications and Foundation activities. <span className="text-muted">(optional)</span>
        </span>
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {error && (
        <p role="alert" className="rounded-[3px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}
      <button type="submit" disabled={state === "sending"} className={submitClass}>
        {state === "sending" ? "Sending…" : "Create My Free Account"}
      </button>
      <p className="text-sm text-muted">
        Already registered?{" "}
        <Link href={`/reader/sign-in?next=${encodeURIComponent(next)}`} className="text-bronze underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export function SignInForm({ next }: { next: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [devLink, setDevLink] = useState<string>();
  if (state === "sent") return <Sent email={email} devLink={devLink} />;
  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setState("sending");
        setError("");
        try {
          const res = await post("/api/reader/sign-in", { email: f.get("email"), company: f.get("company"), next });
          setEmail(String(f.get("email")));
          setDevLink(res.devLink);
          setState("sent");
        } catch (err) {
          setError((err as Error).message);
          setState("idle");
        }
      }}
    >
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink">Email address</span>
        <input name="email" type="email" required maxLength={254} autoComplete="email" className="field" />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {error && (
        <p role="alert" className="rounded-[3px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}
      <button type="submit" disabled={state === "sending"} className={submitClass}>
        {state === "sending" ? "Sending…" : "Email Me a Sign-in Link"}
      </button>
    </form>
  );
}
