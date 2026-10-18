"use client";

import { InlineLoader, TextLoader } from "generative-loaders";
import Link from "next/link";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist/legacy/build/pdf.mjs";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../icons";

// Online reader for the CMF Literature Series. Pages are drawn onto <canvas> with PDF.js, fetched in
// byte ranges from /api/books/<slug>, and only the pages around the reader's position are kept in
// memory, so long books stay light on phones. There is deliberately no download or print control.

type Theme = "light" | "sepia" | "night";

const themes: Record<Theme, { label: string; stage: string; filter: string }> = {
  light: { label: "Light", stage: "bg-[#e9e3d8]", filter: "none" },
  sepia: { label: "Sepia", stage: "bg-[#e3d5bb]", filter: "sepia(0.38) saturate(1.15) brightness(0.97)" },
  night: { label: "Night", stage: "bg-[#0b141d]", filter: "invert(0.88) hue-rotate(180deg) brightness(0.95)" },
};
const themeOrder: Theme[] = ["light", "sepia", "night"];

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;
const MAX_PAGE_WIDTH = 860;
/** Pages within this distance of the current page are rendered; others are released. */
const NEAR = 2;
/** iOS Safari refuses canvases above ~16.7M pixels. */
const MAX_CANVAS_PIXELS = 16_000_000;

type Pdfjs = typeof import("pdfjs-dist/legacy/build/pdf.mjs");
let pdfjsReady: Promise<Pdfjs> | null = null;

// The legacy build supports the older Android and iOS browsers many readers use.
function loadPdfjs() {
  pdfjsReady ??= import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerPort = new Worker(new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url), { type: "module" });
    return pdfjs;
  });
  return pdfjsReady;
}

function load(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function save(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private browsing or blocked storage: the reader still works, it just won't remember.
  }
}

type Book = { slug: string; title: string; author: string };

export function BookReader({ book }: { book: Book }) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [defaultRatio, setDefaultRatio] = useState(1.5);
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(1);
  const [zoom, setZoom] = useState(1);
  // This component only renders in the browser (see reader-loader.tsx), so preferences can be read up front.
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = load("cmf-reader:theme");
    return saved && saved in themes ? (saved as Theme) : "light";
  });
  const [canFullscreen] = useState(() => Boolean(document.fullscreenEnabled));
  const [fullscreen, setFullscreen] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  /** What the reader is typing into the page box; null shows the current page. */
  const [pageDraft, setPageDraft] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const anchor = useRef<{ page: number; fraction: number } | null>(null);
  const pageKey = `cmf-reader:${book.slug}:page`;
  const numPages = doc?.numPages ?? 0;

  // Open the book.
  useEffect(() => {
    let cancelled = false;
    let task: ReturnType<Pdfjs["getDocument"]> | undefined;
    loadPdfjs()
      .then(async (pdfjs) => {
        if (cancelled) return;
        task = pdfjs.getDocument({
          url: `/api/books/${book.slug}`,
          httpHeaders: { "X-CMF-Reader": "1" },
          // Fetch only the byte ranges the visible pages need.
          disableStream: true,
          disableAutoFetch: true,
          rangeChunkSize: 256 * 1024,
        });
        const pdf = await task.promise;
        const first = await pdf.getPage(1);
        if (cancelled) return;
        const { width, height } = first.getViewport({ scale: 1 });
        setDefaultRatio(height / width);
        setDoc(pdf);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[reader] could not open book", err);
        setStatus("error");
      });
    return () => {
      cancelled = true;
      void task?.destroy();
    };
  }, [book.slug]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Track the available width.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const gutter = containerWidth < 640 ? 16 : 64;
  const pageWidth = containerWidth ? Math.round(Math.min(containerWidth - gutter, MAX_PAGE_WIDTH) * zoom) : 0;

  const goTo = useCallback(
    (page: number, behavior: ScrollBehavior = "smooth") => {
      const target = Math.min(Math.max(1, Math.round(page)), numPages || 1);
      const el = slots.current[target - 1];
      const scroller = scrollRef.current;
      if (el && scroller) scroller.scrollTo({ top: el.offsetTop - 16, behavior });
    },
    [numPages],
  );

  // Resume where the reader left off.
  useEffect(() => {
    if (status !== "ready" || !pageWidth) return;
    const saved = Number(load(pageKey));
    if (saved > 1 && saved <= numPages) requestAnimationFrame(() => goTo(saved, "instant"));
    // Run once, when the book first becomes ready and laid out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pageWidth > 0]);

  // Work out which page is in view.
  useEffect(() => {
    const scroller = scrollRef.current;
    if (status !== "ready" || !scroller) return;
    const visible = new Map<number, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(Number((e.target as HTMLElement).dataset.page), e.isIntersecting ? e.intersectionRect.height : 0);
        let best = 0;
        let bestHeight = 0;
        for (const [page, h] of visible) if (h > bestHeight || (h === bestHeight && h > 0 && page < best)) [best, bestHeight] = [page, h];
        if (best) setCurrent(best);
      },
      { root: scroller, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    for (const el of slots.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, [status, numPages]);

  // Remember the reader's place.
  useEffect(() => {
    if (status === "ready") save(pageKey, String(current));
  }, [current, status, pageKey]);

  // Keep the reader's place when the zoom changes.
  useLayoutEffect(() => {
    const a = anchor.current;
    const el = a && slots.current[a.page - 1];
    if (a && el && scrollRef.current) scrollRef.current.scrollTop = el.offsetTop + a.fraction * el.offsetHeight;
    anchor.current = null;
  }, [pageWidth]);

  const changeZoom = useCallback(
    (next: number) => {
      const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(next / ZOOM_STEP) * ZOOM_STEP));
      const el = slots.current[current - 1];
      const scroller = scrollRef.current;
      if (el && scroller) anchor.current = { page: current, fraction: (scroller.scrollTop - el.offsetTop) / el.offsetHeight };
      setZoom(clamped);
    },
    [current],
  );

  const cycleTheme = () => {
    const next = themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length];
    setTheme(next);
    save("cmf-reader:theme", next);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void rootRef.current?.requestFullscreen().catch(() => {});
  };

  // Keyboard: ←/→ turn pages, +/− zoom, 0 resets, F toggles full screen. Save and print are blocked.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === "s" || e.key === "p")) {
        e.preventDefault();
        return;
      }
      if (mod || e.altKey || (e.target as HTMLElement).closest("input, textarea, select")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") goTo(current + 1);
      else if (e.key === "ArrowLeft" || e.key === "PageUp") goTo(current - 1);
      else if (e.key === "Home") goTo(1);
      else if (e.key === "End") goTo(numPages);
      else if (e.key === "+" || e.key === "=") changeZoom(zoom + ZOOM_STEP);
      else if (e.key === "-") changeZoom(zoom - ZOOM_STEP);
      else if (e.key === "0") changeZoom(1);
      else if (e.key === "f" && canFullscreen) toggleFullscreen();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onRatio = useCallback((page: number, ratio: number) => {
    setRatios((r) => (Math.abs((r[page] ?? 0) - ratio) < 0.001 ? r : { ...r, [page]: ratio }));
  }, []);

  const t = themes[theme];

  return (
    <div ref={rootRef} className="fixed inset-0 flex flex-col bg-navy print:hidden">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-white/10 px-2 text-white sm:h-16 sm:gap-4 sm:px-4">
        <Link href="/literature#library" className="flex items-center gap-2 rounded-lg p-2 text-white/85 hover:text-gold" aria-label="Back to the library">
          <Icon name="arrowLeft" className="size-5" strokeWidth={1.8} />
          <span className="hidden text-sm md:inline">Library</span>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-base leading-tight font-semibold tracking-[-0.02em] sm:text-lg">{book.title}</h1>
          <p className="truncate text-xs text-tan">{book.author}</p>
        </div>

        {status === "ready" && (
          <div className="flex items-center gap-1 sm:gap-2">
            <ToolButton icon="chevronLeft" label="Previous page" onClick={() => goTo(current - 1)} disabled={current <= 1} className="hidden sm:flex" />
            <form
              className="flex items-center gap-1.5 text-sm text-white/85"
              onSubmit={(e) => {
                e.preventDefault();
                const n = Number(pageDraft);
                if (pageDraft && Number.isFinite(n)) goTo(n);
                setPageDraft(null);
                (e.currentTarget.elements.namedItem("page") as HTMLInputElement | null)?.blur();
              }}
            >
              <label className="sr-only" htmlFor="reader-page">
                Page number
              </label>
              <input
                id="reader-page"
                name="page"
                value={pageDraft ?? String(current)}
                onFocus={(e) => {
                  setPageDraft(String(current));
                  e.currentTarget.select();
                }}
                onChange={(e) => setPageDraft(e.target.value.replace(/\D/g, "").slice(0, 5))}
                onBlur={() => setPageDraft(null)}
                inputMode="numeric"
                className="w-12 rounded-md border border-white/20 bg-white/10 px-1.5 py-1 text-center text-white focus:border-gold focus:outline-none"
              />
              <span className="whitespace-nowrap">/ {numPages}</span>
            </form>
            <ToolButton icon="chevronRight" label="Next page" onClick={() => goTo(current + 1)} disabled={current >= numPages} className="hidden sm:flex" />

            <span className="mx-1 hidden h-6 w-px bg-white/15 md:block" />
            <ToolButton icon="minus" label="Zoom out" onClick={() => changeZoom(zoom - ZOOM_STEP)} disabled={zoom <= ZOOM_MIN} className="hidden md:flex" />
            <button type="button" onClick={() => changeZoom(1)} className="hidden w-14 text-center text-sm text-white/85 hover:text-gold md:block" title="Fit to width">
              {Math.round(zoom * 100)}%
            </button>
            <ToolButton icon="plus" label="Zoom in" onClick={() => changeZoom(zoom + ZOOM_STEP)} disabled={zoom >= ZOOM_MAX} className="hidden md:flex" />
            <ToolButton icon="contrast" label={`Page colour: ${t.label}. Change`} onClick={cycleTheme} />
            {canFullscreen && <ToolButton icon={fullscreen ? "collapse" : "expand"} label={fullscreen ? "Exit full screen" : "Full screen"} onClick={toggleFullscreen} />}
          </div>
        )}
      </header>

      {status === "ready" && (
        <div className="h-0.5 shrink-0 bg-white/10" aria-hidden="true">
          <div className="h-full bg-gold transition-[width] duration-300" style={{ width: `${(current / numPages) * 100}%` }} />
        </div>
      )}

      <div ref={scrollRef} className={`relative flex-1 overflow-auto overscroll-contain ${t.stage}`} onContextMenu={(e) => e.preventDefault()}>
        {status === "loading" && <Notice title={book.title} spinner />}
        {status === "error" && (
          <Notice title="This book couldn't be opened." body="Please check your connection and try again. If the problem continues, let us know.">
            <button type="button" onClick={() => window.location.reload()} className="rounded-xl bg-bronze px-5 py-3 text-white hover:bg-bronze-dark">
              Try again
            </button>
            <Link href={`/contact?enquiry=books&book=${book.slug}`} className="rounded-xl border border-ink/40 px-5 py-3 text-ink hover:bg-ink hover:text-white">
              Contact us
            </Link>
          </Notice>
        )}

        {doc && pageWidth > 0 && (
          <div className="mx-auto flex w-fit min-w-full flex-col items-center gap-3 px-2 py-4 select-none sm:gap-5 sm:py-8">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
              <PageSlot
                key={n}
                ref={(el) => {
                  slots.current[n - 1] = el;
                }}
                doc={doc}
                page={n}
                width={pageWidth}
                ratio={ratios[n] ?? defaultRatio}
                near={Math.abs(n - current) <= NEAR}
                filter={t.filter}
                onRatio={onRatio}
              />
            ))}
            <EndCard title={book.title} dark={theme === "night"} />
          </div>
        )}
      </div>
    </div>
  );
}

function ToolButton({ icon, label, onClick, disabled, className = "" }: { icon: IconName; label: string; onClick: () => void; disabled?: boolean; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex size-9 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-gold disabled:opacity-30 disabled:hover:bg-transparent ${className}`}
    >
      <Icon name={icon} className="size-5" strokeWidth={1.8} />
    </button>
  );
}

function PageSlot({
  ref,
  doc,
  page,
  width,
  ratio,
  near,
  filter,
  onRatio,
}: {
  ref: (el: HTMLDivElement | null) => void;
  doc: PDFDocumentProxy;
  page: number;
  width: number;
  ratio: number;
  near: boolean;
  filter: string;
  onRatio: (page: number, ratio: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderedWidth, setRenderedWidth] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!near) {
      // Release the bitmap of pages far from view.
      canvas.width = 0;
      canvas.height = 0;
      return;
    }
    let cancelled = false;
    let task: RenderTask | null = null;
    (async () => {
      const pdfPage = await doc.getPage(page);
      if (cancelled) return;
      const base = pdfPage.getViewport({ scale: 1 });
      onRatio(page, base.height / base.width);
      let scale = (width / base.width) * Math.min(window.devicePixelRatio || 1, 2);
      const pixels = base.width * base.height * scale * scale;
      if (pixels > MAX_CANVAS_PIXELS) scale *= Math.sqrt(MAX_CANVAS_PIXELS / pixels);
      const viewport = pdfPage.getViewport({ scale });
      // Draw off screen, then swap in, so a zoom never flashes a blank page.
      const off = document.createElement("canvas");
      off.width = Math.floor(viewport.width);
      off.height = Math.floor(viewport.height);
      task = pdfPage.render({ canvas: off, viewport });
      await task.promise;
      if (cancelled) return;
      canvas.width = off.width;
      canvas.height = off.height;
      canvas.getContext("2d")?.drawImage(off, 0, 0);
      off.width = 0;
      setRenderedWidth(width);
    })().catch((err) => {
      if (!cancelled && err?.name !== "RenderingCancelledException") console.error(`[reader] page ${page} failed`, err);
    });
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [doc, page, width, near, onRatio]);

  const ready = near && renderedWidth > 0;

  return (
    <div
      ref={ref}
      data-page={page}
      className="relative shrink-0 bg-white shadow-[0_6px_24px_-8px_rgba(14,33,50,0.35)]"
      style={{ width, height: Math.round(width * ratio) }}
    >
      <canvas ref={canvasRef} role="img" aria-label={`Page ${page}`} className={`absolute inset-0 size-full transition-opacity duration-200 ${ready ? "opacity-100" : "opacity-0"}`} style={{ filter }} />
      {!ready && <span className="absolute inset-0 flex items-center justify-center text-sm text-muted">{page}</span>}
    </div>
  );
}

function Notice({ title, body, spinner, children }: { title: string; body?: string; spinner?: boolean; children?: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="max-w-md rounded-3xl bg-cream p-8 text-center shadow-lg" role={spinner ? undefined : "alert"}>
        {spinner ? (
          <>
            <InlineLoader variant="fold" size={34} color="var(--color-bronze)" className="mx-auto mb-5 block" />
            <p className="eyebrow">Opening</p>
            <p className="display-sm mt-2 text-2xl">
              <TextLoader text={title} variant="decode" color="var(--color-ink)" aria-label={`Opening ${title}`} />
            </p>
          </>
        ) : (
          <p className="display-sm text-2xl">{title}</p>
        )}
        {body && <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>}
        {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </div>
  );
}

function EndCard({ title, dark }: { title: string; dark: boolean }) {
  return (
    <div className={`my-6 w-full max-w-[560px] rounded-2xl p-8 text-center ${dark ? "bg-navy-soft text-white" : "bg-cream text-ink"}`}>
      <p className={`text-sm ${dark ? "text-gold" : "text-bronze"}`}>{"//"}The end</p>
      <p className={`display-sm mt-2 text-3xl ${dark ? "text-white" : ""}`}>Thank you for reading {title}</p>
      <p className={`mx-auto mt-3 max-w-sm text-sm leading-relaxed ${dark ? "text-white/75" : "text-muted"}`}>
        Every CMF book is free to read. Gifts from readers help keep it that way and put printed copies in schools, churches and communities.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/support" className="rounded-xl bg-bronze px-5 py-3 text-white hover:bg-bronze-dark">
          Support the Series
        </Link>
        <Link href="/literature#library" className={`rounded-xl border px-5 py-3 ${dark ? "border-white/40 hover:bg-white hover:text-ink" : "border-ink/40 hover:bg-ink hover:text-white"}`}>
          More books
        </Link>
      </div>
    </div>
  );
}
