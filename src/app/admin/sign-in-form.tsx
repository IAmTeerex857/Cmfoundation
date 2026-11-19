"use client";

import { useActionState } from "react";
import { adminSignIn, type AdminSignInState } from "./sign-in-actions";

const field = "mt-1 w-full rounded-[3px] border border-line bg-white px-3 py-2.5 text-[0.95rem] outline-none focus:border-bronze";

export function AdminSignInForm() {
  const [state, action, pending] = useActionState<AdminSignInState, FormData>(adminSignIn, {});
  return (
    <form action={action} className="mt-6 grid gap-4">
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
      <button type="submit" disabled={pending} className="rounded-[3px] bg-bronze px-5 py-3 text-sm font-semibold text-white hover:bg-bronze-dark disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
