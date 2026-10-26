"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

type Photo = { src: string; alt: string };

/** A grid of photographs; selecting one opens it full size, with previous and next controls. */
export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const show = (i: number) => {
    setOpen(i);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const step = useCallback((by: number) => setOpen((i) => (i === null ? i : (i + by + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!dialog.current?.open) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <ul className="columns-2 gap-3 sm:columns-3 lg:columns-4">
        {photos.map((p, i) => (
          <li key={p.src} className="mb-3 break-inside-avoid">
            <button type="button" onClick={() => show(i)} className="group block w-full overflow-hidden rounded-[3px] bg-sand" aria-label={`View larger: ${p.alt}`}>
              <Image
                src={p.src}
                alt={p.alt}
                width={600}
                height={600}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-navy/90"
        aria-label="Photo viewer"
      >
        {current && (
          <figure className="flex h-dvh w-screen flex-col items-center justify-center gap-4 p-4 sm:p-10" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="relative h-full max-h-[80dvh] w-full max-w-5xl">
              <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <figcaption className="text-center text-sm text-white/85">
              {current.alt} <span className="text-white/50">({(open ?? 0) + 1} of {photos.length})</span>
            </figcaption>
            <div className="flex gap-3">
              {[
                { label: "Previous photo", icon: "chevronLeft" as const, by: -1 },
                { label: "Next photo", icon: "chevronRight" as const, by: 1 },
              ].map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => step(b.by)}
                  aria-label={b.label}
                  className="flex size-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-ink"
                >
                  <Icon name={b.icon} className="size-5" />
                </button>
              ))}
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex size-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-ink"
              >
                <Icon name="close" className="size-5" />
              </button>
            </div>
          </figure>
        )}
      </dialog>
    </>
  );
}
