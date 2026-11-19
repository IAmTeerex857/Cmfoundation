import { type BookStatus, statusLabels } from "@/lib/books";

const tones: Record<BookStatus, string> = {
  "read-free": "bg-bronze text-white",
  "coming-soon": "border border-bronze text-bronze bg-white",
  forthcoming: "border border-line text-muted bg-white",
  "in-preparation": "border border-line text-muted bg-white",
};

/** The accurate status label for a title (instructions §5.1). */
export function StatusBadge({ status, className = "" }: { status: BookStatus; className?: string }) {
  return (
    <span className={`inline-block rounded-[2px] px-2.5 py-1 text-[0.66rem] font-semibold tracking-[0.1em] whitespace-nowrap uppercase ${tones[status]} ${className}`}>
      {statusLabels[status]}
    </span>
  );
}
