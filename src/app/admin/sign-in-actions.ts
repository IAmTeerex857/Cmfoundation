"use server";

import { redirect } from "next/navigation";
import { ADMIN_SESSION_TTL, checkAdminPassword, endSession, startSession } from "@/lib/reader-auth";

export type AdminSignInState = { error?: string };

/** Management sign-in with email and password (ADMIN_EMAILS + ADMIN_PASSWORD). */
export async function adminSignIn(_: AdminSignInState, form: FormData): Promise<AdminSignInState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const password = String(form.get("password") ?? "").slice(0, 200);
  if (!checkAdminPassword(email, password)) {
    // A short pause makes guessing slow.
    await new Promise((r) => setTimeout(r, 1200));
    return { error: "That email and password do not match an authorised account." };
  }
  await startSession({ email }, ADMIN_SESSION_TTL);
  redirect("/admin");
}

export async function adminSignOut() {
  await endSession();
  redirect("/admin");
}
