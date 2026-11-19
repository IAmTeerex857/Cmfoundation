import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db, dbConfigured } from "@/lib/db";
import { currentAdmin, currentReader } from "@/lib/reader-auth";
import { AdminNav, NavGlyph } from "./admin-nav";
import { AdminSignInForm } from "./sign-in-form";
import { adminSignOut } from "./sign-in-actions";

export const metadata: Metadata = { title: "CMF Management Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Restricted to authorised CMF management (ADMIN_EMAILS), who sign in with email and password (ADMIN_PASSWORD).
// One rounded workspace on a warm ground: sidebar on the left, the page on the right.

function Mark({ size = 36 }: { size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-xl bg-navy" style={{ width: size, height: size }}>
      <Image src="/images/logo-mark.png" alt="" width={419} height={312} className="w-[70%]" />
    </span>
  );
}

async function unread() {
  try {
    const [m, o, f] = await Promise.all([
      db.count("enquiries", { kind: "eq.contact", status: "eq.new" }),
      db.count("enquiries", { kind: "eq.order", status: "eq.new" }),
      db.count("feedback", { status: "eq.new" }),
    ]);
    return m + o + f;
  } catch {
    return 0;
  }
}

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await currentAdmin();

  if (!admin) {
    const reader = await currentReader();
    return (
      <div className="grid min-h-dvh place-items-center bg-[#efe9df] px-4 py-10 text-ink">
        <div className="w-full max-w-[25rem] rounded-[26px] bg-white p-7 shadow-[0_30px_80px_-40px_rgba(14,33,50,0.45)] ring-1 ring-black/[0.05] sm:p-9">
          <Mark size={44} />
          <h1 className="mt-6 text-[1.6rem] font-medium tracking-[-0.02em]">Welcome back</h1>
          <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">
            {reader ? `${reader.email} is a reader account. Sign in with a management account.` : "Sign in to the CMF management dashboard."}
          </p>
          <AdminSignInForm />
        </div>
        <Link href="/" className="mt-6 text-sm text-muted hover:text-ink">
          Back to cm.foundation
        </Link>
      </div>
    );
  }

  const badge = dbConfigured() ? await unread() : 0;
  const initials = admin.email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-dvh bg-[#efe9df] text-ink lg:p-3">
      <div className="mx-auto flex min-h-dvh max-w-[1500px] bg-[#f8f5ef] lg:min-h-[calc(100dvh-1.5rem)] lg:rounded-[30px] lg:ring-1 lg:ring-black/[0.04]">
        {/* Sidebar */}
        <aside className="sticky top-3 hidden h-[calc(100dvh-1.5rem)] w-[15.5rem] shrink-0 flex-col px-4 py-6 lg:flex">
          <Link href="/admin" className="flex items-center gap-3 px-2">
            <Mark />
            <span className="leading-tight">
              <span className="block text-[0.95rem] font-semibold">CMF</span>
              <span className="block text-xs text-muted">Management</span>
            </span>
          </Link>
          <div className="mt-8">
            <AdminNav badge={badge} />
          </div>
          <p className="mt-8 px-3.5 text-[0.7rem] font-semibold tracking-[0.12em] text-muted uppercase">Website</p>
          <a href="/" target="_blank" rel="noopener" className="mt-2 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.95rem] text-body hover:bg-black/[0.04] hover:text-ink">
            <NavGlyph name="site" />
            View the site
          </a>

          <div className="mt-auto border-t border-black/[0.06] px-2 pt-4">
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-parchment text-xs font-semibold text-bronze-dark">{initials}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium" title={admin.email}>
                  {admin.email}
                </span>
                <span className="block text-xs text-muted">Administrator</span>
              </span>
            </div>
            <form action={adminSignOut} className="mt-3">
              <button type="submit" className="w-full rounded-xl px-3 py-2 text-left text-sm text-muted ring-1 ring-black/[0.06] hover:bg-white hover:text-ink">
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Compact header for phones and tablets */}
          <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-[#f8f5ef]/95 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <Link href="/admin" className="flex items-center gap-2.5">
                <Mark size={30} />
                <span className="text-sm font-semibold">CMF Management</span>
              </Link>
              <form action={adminSignOut}>
                <button type="submit" className="text-xs text-muted">
                  Sign out
                </button>
              </form>
            </div>
            <div className="mt-3">
              <AdminNav badge={badge} orientation="horizontal" />
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:py-8 lg:pr-8 lg:pl-4">
            {dbConfigured() ? (
              children
            ) : (
              <p className="rounded-2xl bg-white p-6 ring-1 ring-black/[0.05]">
                The database is not connected yet. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the hosting settings and redeploy (see docs/SETUP.md).
              </p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
