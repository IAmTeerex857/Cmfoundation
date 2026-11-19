"use client";

import { useActionState } from "react";
import { Working } from "@/components/loaders";
import { adminSignIn, type AdminSignInState } from "./sign-in-actions";

const field = "mt-1.5 w-full rounded-xl border border-black/[0.08] bg-[#faf7f2] px-3.5 py-3 text-[0.95rem] outline-none transition-colors focus:border-bronze focus:bg-white";

export function AdminSignInForm() {
  const [state, action, pending] = useActionState<AdminSignInState, FormData>(adminSignIn, {});
  return (
    <form action={action} className="mt-7 grid gap-4">
      <label className="text-sm font-medium">
        Email
        <input name="email" type="email" autoComplete="username" required className={field} />
      </label>
      <label className="text-sm font-medium">
        Password
        <input name="password" type="password" autoComplete="current-password" required className={field} />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-bronze px-5 py-3.5 text-[0.95rem] font-semibold text-white transition-colors hover:bg-bronze-dark disabled:opacity-70">
        {pending && <Working label="Signing in" color="#ffffff" />}
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
