import { TextLines, Working } from "@/components/loaders";

// Shown while the dashboard's figures load: the bento's own shapes, shimmering in place.

function Tile({ className = "", blocks = 2, tall = false }: { className?: string; blocks?: number; tall?: boolean }) {
  return (
    <div className={`rounded-[22px] bg-white p-6 ring-1 ring-black/[0.05] ${tall ? "min-h-[22rem]" : "min-h-[15rem]"} ${className}`}>
      <div className="h-3.5 w-32 rounded-full bg-black/[0.06]" />
      <div className="mt-6 text-ink">
        <TextLines blocks={blocks} size="1.5rem" label="Loading figures" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div aria-busy="true">
      <div className="flex items-end justify-between gap-4">
        <div className="h-12 w-52 rounded-2xl bg-black/[0.06]" />
        <span className="flex items-center gap-2 text-sm text-muted">
          <Working label="Loading the dashboard" />
          Loading figures
        </span>
      </div>
      <div className="mt-7 grid gap-4 lg:grid-cols-12">
        <Tile className="lg:col-span-4" blocks={3} tall />
        <Tile className="lg:col-span-5" blocks={4} tall />
        <div className="min-h-[22rem] rounded-[22px] bg-navy/90 lg:col-span-3" />
        <Tile className="lg:col-span-4" />
        <Tile className="lg:col-span-5" />
        <Tile className="lg:col-span-3" />
      </div>
    </div>
  );
}
