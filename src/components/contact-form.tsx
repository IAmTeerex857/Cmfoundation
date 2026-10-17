"use client";

import { useState } from "react";
import { type EnquiryType, enquiryTypes } from "@/lib/enquiries";
import { Icon } from "./icons";

export function ContactForm({ initialEnquiry, initialMessage = "" }: { initialEnquiry?: EnquiryType; initialMessage?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Your message could not be sent.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your message could not be sent.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="tile p-8 text-center">
        <Icon name="check" className="mx-auto size-10 text-bronze" strokeWidth={2} />
        <h3 className="display-sm mt-4">Thank you — your message has been sent.</h3>
        <p className="mt-2 text-muted">We aim to respond within 1–2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input name="name" required maxLength={120} placeholder="Your Name *" autoComplete="name" className="field" aria-label="Your name" />
      <input name="email" type="email" required maxLength={254} placeholder="Your Email Address *" autoComplete="email" className="field" aria-label="Your email address" />
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink">Nature of Enquiry *</span>
        <select name="enquiry" required defaultValue={initialEnquiry ?? ""} className="field">
          <option value="" disabled>
            Select an option
          </option>
          {enquiryTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <textarea
        name="message"
        required
        rows={5}
        maxLength={5000}
        defaultValue={initialMessage}
        placeholder="Your Message *"
        className="field resize-y"
        aria-label="Your message"
      />
      {/* Honeypot: hidden from people, often filled by bots. */}
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2.5 rounded-xl bg-bronze px-7 py-3.5 font-medium text-white hover:bg-bronze-dark disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
        <Icon name="arrowUpRight" className="size-4" strokeWidth={2} />
      </button>
    </form>
  );
}
