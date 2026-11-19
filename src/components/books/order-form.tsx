"use client";

import { InlineLoader } from "generative-loaders";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { countries } from "@/lib/countries";
import { orderPurposes } from "@/lib/orders";
import { Icon } from "../icons";
import { SlideIcon } from "../ui";

type Option = { slug: string; title: string };

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">
        {label} {required ? <span className="text-bronze">*</span> : <span className="font-normal text-muted">(optional)</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function Select({ name, required, defaultValue, children }: { name: string; required?: boolean; defaultValue?: string; children: React.ReactNode }) {
  return (
    <span className="relative block">
      <select name={name} required={required} defaultValue={defaultValue ?? ""} className="field appearance-none pr-11">
        {children}
      </select>
      <Icon name="chevronRight" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 rotate-90 text-bronze" strokeWidth={2} />
    </span>
  );
}

export function OrderForm({ books, initialBook }: { books: Option[]; initialBook?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch("/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Your enquiry could not be sent.");
      track("institutional_order_submit", { book: String(data.book), purpose: String(data.purpose) });
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your enquiry could not be sent.");
      setStatus("error");
    }
  }

  if (status === "sent")
    return (
      <div className="tile p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-bronze text-white">
          <Icon name="check" className="size-7" strokeWidth={2} />
        </span>
        <h2 className="display-sm mt-4">Thank you. Your enquiry has been received.</h2>
        <p className="mt-2 text-muted">The Foundation will reply by email with pricing, delivery arrangements and availability.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Your name" required>
        <input name="name" required maxLength={120} autoComplete="name" className="field" />
      </Field>
      <Field label="Organisation">
        <input name="organisation" maxLength={160} autoComplete="organization" className="field" />
      </Field>
      <Field label="Email" required>
        <input name="email" type="email" required maxLength={254} autoComplete="email" className="field" />
      </Field>
      <Field label="Country" required>
        <Select name="country" required defaultValue="Nigeria">
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Delivery destination" required hint="Town or city and state. We will ask for the full delivery address when we reply.">
          <input name="destination" required maxLength={200} className="field" />
        </Field>
      </div>
      <Field label="Book title" required>
        <Select name="book" required defaultValue={initialBook}>
          <option value="" disabled>
            Choose a book
          </option>
          {books.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.title}
            </option>
          ))}
          <option value="several">Several titles (list them below)</option>
        </Select>
      </Field>
      <Field label="Quantity" required>
        <input name="quantity" type="number" min={1} max={100000} required inputMode="numeric" className="field" />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Intended purpose" required>
          <Select name="purpose" required>
            <option value="" disabled>
              Choose one
            </option>
            {orderPurposes.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Additional instructions">
          <textarea name="instructions" rows={4} maxLength={3000} className="field resize-y" placeholder="Dates needed by, dedications or inscriptions, other titles…" />
        </Field>
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {status === "error" && (
        <p role="alert" className="rounded-[3px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:col-span-2">
          {error}
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-3 rounded-[3px] bg-bronze px-7 py-4 text-[0.82rem] leading-none font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-bronze-dark disabled:opacity-80"
        >
          {status === "sending" ? (
            <>
              <InlineLoader variant="orbit" size={18} label="Sending" /> Sending
            </>
          ) : (
            <>
              Send Order Enquiry <SlideIcon name="arrow" />
            </>
          )}
        </button>
        <p className="mt-3 text-xs text-muted">This is an enquiry, not a payment. Book orders are separate from donations.</p>
      </div>
    </form>
  );
}
