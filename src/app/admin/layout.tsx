import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { dbConfigured } from "@/lib/db";
import { currentAdmin, currentReader } from "@/lib/reader-auth";

export const metadata: Metadata = { title: "CMF Management Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/donations", label: "Donations & sponsorships" },
  { href: "/admin/readers", label: "Readers & exports" },
];

// Restricted to authorised CMF management (ADMIN_EMAILS), who sign in with the same emailed link as readers.
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await currentAdmin();
  const reader = admin ? null : await currentReader();
  return (
    <div className="min-h-dvh bg-[#f6f5f2] text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold tracking-[0.1em] text-white uppercase">Management</span>
          </div>
          {admin && (
            <nav className="flex flex-wrap gap-1 text-sm">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="rounded-full px-3 py-2 hover:bg-black/5">
                  {n.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        {!admin ? (
          <div className="mx-auto max-w-md rounded-[4px] border border-line bg-white p-8">
            <h1 className="font-display text-2xl">Authorised CMF staff only</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {reader
                ? `You are signed in as ${reader.email}, which is not on the list of authorised management accounts.`
                : "Sign in with your authorised CMF email address. We will email you a sign-in link."}
            </p>
            <Link href="/reader/sign-in?next=/admin" className="mt-6 inline-block rounded-[3px] bg-bronze px-5 py-3 text-sm font-semibold text-white">
              Sign in
            </Link>
          </div>
        ) : !dbConfigured() ? (
          <p className="rounded-[4px] border border-line bg-white p-6">
            The database is not connected yet. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the hosting settings and redeploy (see docs/SETUP.md).
          </p>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
