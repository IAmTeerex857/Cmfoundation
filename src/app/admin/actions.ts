"use server";

import { revalidatePath } from "next/cache";
import { db, eq } from "@/lib/db";
import { givingFocuses } from "@/lib/giving";
import { currentAdmin } from "@/lib/reader-auth";

// Dashboard actions. Each one checks the signed-in user is authorised CMF management first:
// server actions can be called directly, not only from the dashboard's forms.

async function admin() {
  const a = await currentAdmin();
  if (!a) throw new Error("Not authorised");
  return a;
}

const s = (f: FormData, k: string, max = 500) => String(f.get(k) ?? "").trim().slice(0, max);

export async function setFeedbackStatus(f: FormData) {
  await admin();
  const status = s(f, "status");
  if (!["new", "read", "replied", "archived"].includes(status)) return;
  await db.update("feedback", { id: eq(s(f, "id", 40)) }, { status });
  revalidatePath("/admin/inbox");
}

export async function setEnquiryStatus(f: FormData) {
  await admin();
  const status = s(f, "status");
  if (!["new", "in-progress", "done", "archived"].includes(status)) return;
  await db.update("enquiries", { id: eq(s(f, "id", 40)) }, { status });
  revalidatePath("/admin/inbox");
}

/** Records a donation confirmed in the payment provider's dashboard or bank statement (§9.6). */
export async function recordDonation(f: FormData) {
  const a = await admin();
  const amount = Number(s(f, "amount", 20).replace(/,/g, ""));
  const category = s(f, "category", 30);
  if (!(amount > 0) || !givingFocuses.some((g) => g.id === category)) throw new Error("Please enter an amount and category.");
  await db.insert("donations", {
    received_on: s(f, "received_on", 10) || new Date().toISOString().slice(0, 10),
    amount,
    currency: s(f, "currency", 3) || "NGN",
    category,
    method: s(f, "method", 20) || "online",
    reference: s(f, "reference", 120) || null,
    donor_name: s(f, "donor_name", 160) || null,
    donor_email: s(f, "donor_email", 254) || null,
    note: s(f, "note", 1000) || null,
    recorded_by: a.email,
  });
  revalidatePath("/admin/donations");
  revalidatePath("/admin");
}

export async function recordSponsorship(f: FormData) {
  await admin();
  const organisation = s(f, "organisation", 200);
  const arrangement = s(f, "arrangement", 200);
  if (!organisation || !arrangement) throw new Error("Please enter the organisation and arrangement.");
  const amount = Number(s(f, "amount", 20).replace(/,/g, ""));
  await db.insert("sponsorships", {
    organisation,
    arrangement,
    amount: amount > 0 ? amount : null,
    currency: s(f, "currency", 3) || "NGN",
    starts_on: s(f, "starts_on", 10) || null,
    status: s(f, "status", 20) || "proposed",
    note: s(f, "note", 1000) || null,
  });
  revalidatePath("/admin/donations");
}
