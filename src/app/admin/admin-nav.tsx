"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Sidebar navigation for the management dashboard. The active page is a navy pill, as in the
// Foundation's other dark accents; everything else stays quiet.

const icons = {
  overview: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  inbox: "M4 13l2.5-7.5A2 2 0 0 1 8.4 4h7.2a2 2 0 0 1 1.9 1.5L20 13M4 13v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M4 13h4.5l1 2h5l1-2H20",
  support: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  readers: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.2a6.5 6.5 0 0 1 3.5 5.8",
  site: "M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4",
} as const;

export type NavIcon = keyof typeof icons;

export function NavGlyph({ name, className = "size-[1.15rem]" }: { name: NavIcon; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={icons[name]} />
    </svg>
  );
}

const items: { href: string; label: string; icon: NavIcon }[] = [
  { href: "/admin", label: "Overview", icon: "overview" },
  { href: "/admin/inbox", label: "Inbox", icon: "inbox" },
  { href: "/admin/donations", label: "Donations", icon: "support" },
  { href: "/admin/readers", label: "Readers", icon: "readers" },
];

export function AdminNav({ badge, orientation = "vertical" }: { badge?: number; orientation?: "vertical" | "horizontal" }) {
  const path = usePathname();
  const horizontal = orientation === "horizontal";
  return (
    <nav aria-label="Dashboard" className={horizontal ? "flex gap-1 overflow-x-auto" : "grid gap-1"}>
      {items.map((it) => {
        const active = it.href === "/admin" ? path === "/admin" : path.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.95rem] whitespace-nowrap transition-colors ${
              active ? "bg-navy text-white shadow-[0_8px_20px_-12px_rgba(14,33,50,0.8)]" : "text-body hover:bg-black/[0.04] hover:text-ink"
            }`}
          >
            <NavGlyph name={it.icon} />
            <span className="flex-1">{it.label}</span>
            {it.icon === "inbox" && !!badge && (
              <span className={`grid min-w-5 place-items-center rounded-full px-1.5 text-[0.7rem] font-semibold tabular-nums ${active ? "bg-gold text-navy" : "bg-bronze text-white"}`}>
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
