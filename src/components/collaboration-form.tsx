"use client";

import { InlineLoader } from "generative-loaders";
import { motion } from "motion/react";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { collaborationTypes } from "@/lib/enquiries";
import { Icon } from "./icons";
import { SlideIcon } from "./ui";

// "Propose a Collaboration" (further instructions §5): organisation and contact, email, the kind of
// collaboration, its objective and a message. No attachments: documents can follow by email once CMF replies.
export function CollaborationForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch("/api/collaborate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error ?? "Your proposal could not be sent.");
      track("generate_lead", { enquiry: "collaboration" });
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your proposal could not be sent.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="tile p-8 text-center"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-bronze text-white">
          <Icon name="check" className="size-7" strokeWidth={2} />
        </span>
        <h3 className="display-sm mt-4">Thank you. Your proposal has been received.</h3>
        <p className="mt-2 text-muted">It has gone to the Foundation&rsquo;s team, who will reply to you by email. Supporting documents can follow then.</p>
      </motion.div>
    );
  }

  const label = "mb-2 block text-sm font-medium text-ink";
  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className={label}>Organisation *</span>
        <input name="organisation" required maxLength={160} autoComplete="organization" className="field" />
      </label>
      <label className="block">
        <span className={label}>Contact person *</span>
        <input name="name" required maxLength={120} autoComplete="name" className="field" />
      </label>
      <label className="block">
        <span className={label}>Email *</span>
        <input name="email" type="email" required maxLength={254} autoComplete="email" className="field" />
      </label>
      <label className="block">
        <span className={label}>Type of collaboration *</span>
        <span className="relative block">
          <select name="type" required defaultValue="" className="field appearance-none pr-11">
            <option value="" disabled>
              Select an option
            </option>
            {collaborationTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <Icon name="chevronRight" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 rotate-90 text-bronze" strokeWidth={2} />
        </span>
      </label>
      <label className="block sm:col-span-2">
        <span className={label}>Objective *</span>
        <input name="objective" required maxLength={600} placeholder="What would the collaboration achieve, and for whom?" className="field" />
      </label>
      <label className="block sm:col-span-2">
        <span className={label}>Message *</span>
        <textarea name="message" required rows={5} maxLength={5000} placeholder="Scope, timing, and what your organisation would contribute." className="field resize-y" />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {status === "error" && (
        <p role="alert" className="rounded-[3px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:col-span-2">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-3 rounded-[3px] bg-ink px-7 py-4 text-[0.82rem] leading-none font-semibold tracking-[0.08em] text-white uppercase transition-colors duration-300 hover:bg-navy-soft disabled:opacity-80"
        >
          {status === "sending" ? (
            <>
              <InlineLoader variant="orbit" size={18} label="Sending your proposal" /> Sending
            </>
          ) : (
            <>
              Send Proposal <SlideIcon name="arrow" />
            </>
          )}
        </button>
        <p className="text-sm text-muted">Please don&rsquo;t attach documents here; the team will ask for them when they reply.</p>
      </div>
    </form>
  );
}
