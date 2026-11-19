import Link from "next/link";
import type { ReactNode } from "react";

// Building blocks for the management dashboard: soft white cards on a warm ground, big tabular
// figures, hatched bronze bars and quiet labels. Brand colours only (navy, bronze, gold, paper).

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`min-w-0 rounded-[22px] bg-white p-5 ring-1 ring-black/[0.05] sm:p-6 ${className}`}>{children}</section>;
}

export function CardHead({ title, note, action }: { title: string; note?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-[1.15rem] font-medium tracking-[-0.01em] text-ink">{title}</h2>
        {note && <p className="mt-0.5 text-sm text-muted">{note}</p>}
      </div>
      {action}
    </div>
  );
}

export function HeadLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-ink hover:text-bronze">
      {children}
      <Chevron />
    </Link>
  );
}

export function Chevron({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

/** Change against the previous period of the same length, as a small pill. */
export function Delta({ now, before, unit = "" }: { now: number; before: number; unit?: string }) {
  if (!now && !before) return <span className="rounded-full bg-sand px-2.5 py-1 text-[0.8rem] text-muted">No activity yet</span>;
  const diff = now - before;
  const up = diff >= 0;
  const label = before ? `${Math.abs(Math.round((diff / before) * 100))}%` : `${Math.abs(diff)}${unit}`;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.8rem] font-medium tabular-nums ${up ? "bg-[#e9f3ea] text-[#2f6b3a]" : "bg-[#f8e9e4] text-[#9a3b25]"}`}>
      <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden="true">
        <path d={up ? "M5 1.5 9 8H1z" : "M5 8.5 1 2h8z"} fill="currentColor" />
      </svg>
      {label}
    </span>
  );
}

/** Hatched bronze fill, the dashboard's bar texture; `solid` marks the current or leading value. */
export const hatch = (solid = false) =>
  solid
    ? { background: "var(--color-bronze)" }
    : { backgroundImage: "repeating-linear-gradient(135deg, rgba(162,96,26,0.55) 0 2px, rgba(162,96,26,0.12) 2px 6px)" };

/** A label and value on one line, separated by a hairline: the stat rows under a headline figure. */
export function StatRow({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-black/[0.06] py-3 first:border-t-0">
      <span className="text-[0.95rem] text-body" title={hint}>
        {label}
      </span>
      <span className="text-[0.95rem] font-medium text-ink tabular-nums">{value}</span>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-[#faf7f2] px-4 py-5 text-sm text-muted">{children}</p>;
}

export const fmt = (n: number) => n.toLocaleString("en-GB");
