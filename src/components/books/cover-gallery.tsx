"use client";

import Image from "next/image";
import { useState } from "react";
import type { CoverImage } from "@/lib/books";

// Front and back covers on a book's page (instructions §5.3 A and B). The spine is never shown.
export function CoverGallery({ title, author, front, back }: { title: string; author: string; front: CoverImage; back?: CoverImage }) {
  const [side, setSide] = useState<"front" | "back">("front");
  const shown = side === "back" && back ? back : front;
  return (
    <div>
      <div className="relative mx-auto w-full max-w-[22rem]">
        <div
          className="relative overflow-hidden rounded-[3px] bg-white shadow-[0_30px_60px_-30px_rgba(12,31,66,0.55)] ring-1 ring-black/5"
          style={{ aspectRatio: `${shown.width} / ${shown.height}` }}
        >
          <Image
            key={shown.image}
            src={shown.image}
            alt={side === "back" ? `Back cover of ${title}` : `Front cover of ${title} by ${author}`}
            fill
            priority={side === "front"}
            sizes="(min-width: 1024px) 352px, 80vw"
            className="animate-[page-in_0.4s_ease-out] object-contain"
          />
        </div>
      </div>
      {back && (
        <div role="group" aria-label="Choose cover" className="mt-5 flex justify-center gap-3">
          {(["front", "back"] as const).map((s) => {
            const img = s === "front" ? front : back;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                aria-pressed={side === s}
                aria-label={`Show the ${s} cover`}
                className="group flex flex-col items-center gap-1.5 text-xs font-semibold tracking-[0.1em] text-muted uppercase aria-pressed:text-bronze"
              >
                <span className="relative block h-20 overflow-hidden rounded-[2px] ring-1 ring-line transition group-aria-pressed:ring-2 group-aria-pressed:ring-bronze" style={{ aspectRatio: `${img.width} / ${img.height}` }}>
                  <Image src={img.image} alt="" fill sizes="60px" className="object-cover" />
                </span>
                {s} cover
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
