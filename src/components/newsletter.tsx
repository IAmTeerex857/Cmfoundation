"use client";

import { useState } from "react";
import { Icon } from "./icons";

// Sign-ups go to /api/newsletter, which adds the address to Resend (or emails the Foundation inbox).
export function Newsletter() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), company: data.get("company") }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Something went wrong. Please try again.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done") return <p className="text-gold">Thank you — you&rsquo;re on the list.</p>;

  return (
    <form onSubmit={submit} className="max-w-sm">
      <label className="relative block">
        <span className="sr-only">Email address</span>
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="Enter your email"
          className="w-full rounded-full border border-white/35 bg-transparent py-3.5 pr-14 pl-5 text-white placeholder:text-white/60 focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          aria-label="Subscribe"
          className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-bronze text-white hover:bg-bronze-dark disabled:opacity-60"
        >
          <Icon name="arrow" className="size-4" strokeWidth={2} />
        </button>
      </label>
      {/* Honeypot: hidden from people, often filled by bots. */}
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state === "error" && (
        <p role="alert" className="mt-2 text-sm text-[#f3b9a8]">
          {error}
        </p>
      )}
    </form>
  );
}
