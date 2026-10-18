import Image from "next/image";
import type { Book, CoverMotif } from "@/lib/books";

// The SVG motifs remain as a resilient fallback for titles without supplied artwork.
function Motif({ motif, ink }: { motif: CoverMotif; ink: string }) {
  const s = { stroke: ink, fill: "none", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (motif) {
    case "sunrise":
      return (
        <g>
          <circle cx="60" cy="70" r="16" fill="#fff3c4" opacity="0.9" />
          <path d="M0 95 30 70l20 14 22-22 48 33v25H0z" fill="#2f5b2e" opacity="0.85" />
          <path d="M0 105 40 86l30 12 50-14v36H0z" fill="#1f3f20" />
        </g>
      );
    case "silhouettes":
      return (
        <g fill="#2b1406">
          <circle cx="60" cy="72" r="20" fill="#ffd27a" opacity="0.8" />
          {[22, 42, 60, 78, 98].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i % 2 ? 80 : 76})`}>
              <circle r="5" />
              <path d="M-8 34V14a8 8 0 0 1 16 0v20z" transform="translate(0 0)" />
            </g>
          ))}
        </g>
      );
    case "cross":
      return <path d="M60 50v62M42 68h36" stroke={ink} strokeWidth="6" strokeLinecap="square" />;
    case "rings":
      return (
        <g {...s} stroke="#d4a82a" strokeWidth="5">
          <circle cx="60" cy="68" r="17" />
          <circle cx="49" cy="86" r="17" />
          <circle cx="71" cy="86" r="17" />
        </g>
      );
    case "sunset-cross":
      return (
        <g>
          <circle cx="60" cy="88" r="26" fill="#ffb15c" opacity="0.6" />
          <path d="M60 58v56M46 74h28" stroke="#1a0603" strokeWidth="6" />
        </g>
      );
    case "crosses":
      return (
        <g stroke="#0b111b" strokeWidth="4">
          <circle cx="60" cy="70" r="20" fill="#f4d9a0" opacity="0.5" stroke="none" />
          <path d="M60 52v58M50 66h20M32 70v40M25 80h14M88 70v40M81 80h14" />
        </g>
      );
    case "tree":
      return (
        <g {...s}>
          <path d="M60 112V70M60 84 44 70M60 78l17-14M44 70l-8-10M44 70l-2-12M77 64l8-9M77 64l2-12M60 70l-3-14M60 70l5-15" />
          <path d="M40 112h40" />
        </g>
      );
    case "scales":
      return (
        <g {...s}>
          <path d="M60 52v58M44 110h32M36 62h48M36 62l-10 22h20zM84 62l-10 22h20z" />
          <circle cx="60" cy="52" r="3" fill={ink} />
        </g>
      );
    case "gavel":
      return (
        <g fill="#3a2410">
          <rect x="44" y="60" width="34" height="16" rx="3" transform="rotate(-25 61 68)" />
          <rect x="60" y="72" width="7" height="34" rx="2" transform="rotate(-25 63 89)" />
          <rect x="30" y="104" width="60" height="7" rx="2" />
        </g>
      );
    case "trumpet":
      return (
        <g {...s} stroke="#c58a1e" strokeWidth="3">
          <path d="M28 100 72 64M66 56c8 2 14 8 16 16l-6 2c-2-6-6-10-12-12z" />
          <path d="M40 90l6 6M50 82l6 6" />
        </g>
      );
    case "path":
      return (
        <g>
          <path d="M0 80c30-10 60-10 120 0v40H0z" fill="#2f4a28" />
          <path d="M56 120c2-16 6-28 4-40 0 0 4 12 8 40z" fill="#e8dcc0" />
        </g>
      );
  }
}

export function BookCover({ book, className = "", style }: { book: Book; className?: string; style?: React.CSSProperties }) {
  // Supplied covers already contain their typography. Preserve the full artwork.
  if (book.cover.type === "official") {
    return (
      <div
        className={`relative overflow-hidden rounded-[3px] shadow-[0_10px_24px_-10px_rgba(10,34,56,0.45)] ring-1 ring-black/5 ${className}`}
        style={{ aspectRatio: `${book.cover.width} / ${book.cover.height}`, ...style }}
      >
        <Image
          src={book.cover.image}
          alt={`Cover of ${book.title} by ${book.author}`}
          fill
          sizes="(min-width: 1024px) 18vw, 44vw"
          className="object-contain"
        />
      </div>
    );
  }

  const { from, to, ink, motif, image } = book.cover;
  const darkText = ink !== "#ffffff" && ink !== "#e5b94e";
  const readability = darkText
    ? "linear-gradient(to bottom, rgba(255,255,255,.9) 0%, rgba(255,255,255,.42) 28%, transparent 48%, transparent 72%, rgba(255,255,255,.76) 100%)"
    : "linear-gradient(to bottom, rgba(0,0,0,.66) 0%, rgba(0,0,0,.22) 30%, transparent 52%, transparent 70%, rgba(0,0,0,.58) 100%)";

  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden [container-type:inline-size] rounded-[3px] shadow-[0_10px_24px_-10px_rgba(10,34,56,0.45)] ring-1 ring-black/5 ${className}`}
      style={{ background: `linear-gradient(170deg, ${from}, ${to})`, ...style }}
      role="img"
      aria-label={`Cover of ${book.title} by ${book.author}`}
    >
      {image && <Image src={image} alt="" fill sizes="(min-width: 1024px) 18vw, 44vw" className="object-cover" />}
      {image && <div className="absolute inset-0" style={{ background: readability }} />}
      <div className="absolute inset-y-0 left-0 w-[4%] bg-black/20 shadow-[2px_0_5px_rgba(0,0,0,.16)]" />
      <div className="relative flex h-full flex-col px-[9cqi] pt-[10cqi] pb-[8cqi] text-center" style={{ color: ink }}>
        <p className="font-display text-[11cqi] leading-[1.02] font-semibold tracking-[-0.02em] uppercase [text-wrap:balance] [text-shadow:0_1px_3px_rgba(0,0,0,.12)]">{book.title}</p>
        {book.subtitle && <p className="mt-1 font-display text-[6.5cqi] italic opacity-80">{book.subtitle}</p>}
        {!image && (
          <svg viewBox="0 0 120 120" className="mx-auto mt-auto w-full" aria-hidden="true">
            <Motif motif={motif} ink={ink} />
          </svg>
        )}
        <p className="mt-auto text-[5.5cqi] font-semibold tracking-wider uppercase opacity-95 [text-shadow:0_1px_3px_rgba(0,0,0,.14)]">{book.author}</p>
      </div>
    </div>
  );
}
