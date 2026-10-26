"use client";

import { InlineLoader } from "generative-loaders";
import { motion } from "motion/react";
import { useState } from "react";
import { type EnquiryType, enquiryTypes } from "@/lib/enquiries";
import { Icon } from "./icons";
import { SlideIcon } from "./ui";

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
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="tile p-8 text-center">
        <motion.span
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.15 }}
          className="mx-auto flex size-14 items-center justify-center rounded-full bg-bronze text-white"
        >
          <Icon name="check" className="size-7" strokeWidth={2} />
        </motion.span>
        <h3 className="display-sm mt-4">Thank you. Your message has been sent.</h3>
        <p className="mt-2 text-muted">We aim to respond within 1–2 business days.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input name="name" required maxLength={120} placeholder="Your Name *" autoComplete="name" className="field" aria-label="Your name" />
      <input name="email" type="email" required maxLength={254} placeholder="Your Email Address *" autoComplete="email" className="field" aria-label="Your email address" />
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-ink">Nature of Enquiry *</span>
        <span className="relative block">
          <select name="enquiry" required defaultValue={initialEnquiry ?? ""} className="field appearance-none pr-11">
            <option value="" disabled>
              Select an option
            </option>
            {enquiryTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <Icon name="chevronRight" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 rotate-90 text-bronze" strokeWidth={2} />
        </span>
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
        <p role="alert" className="rounded-[3px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex items-center gap-3 rounded-[3px] bg-bronze px-7 py-4 text-[0.82rem] leading-none font-semibold tracking-[0.08em] text-white uppercase transition-colors duration-300 hover:bg-bronze-dark disabled:opacity-80"
      >
        {status === "sending" ? (
          <>
            <InlineLoader variant="orbit" size={18} label="Sending your message" /> Sending
          </>
        ) : (
          <>
            Send Message <SlideIcon name="arrow" />
          </>
        )}
      </button>
    </form>
  );
}
