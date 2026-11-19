"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { Icon, type IconName } from "../icons";

// The online reader for books with a text edition (instructions §5.4 to §6.5).
//
// - Reading starts with the book itself: the title page, front matter and Prologue. "Go to the
//   Prologue" jumps straight there. A saved position resumes automatically.
// - One section is loaded at a time from /api/books/<slug>/sections/<id>, so it is light on mobile data.
// - Reading preferences, position, bookmarks and personal notes are kept on this device. Notes are
//   private: nothing reaches the Foundation unless the reader uses "Send feedback to CMF".
// - After the introductory section, an invitation offers "Continue Reading Free" or a free account,
//   once per book. Reading never requires an account or payment.

export type SectionMeta = { id: string; kind: "front" | "prologue" | "part" | "chapter" | "back"; number?: number; title: string; subtitle?: string; words: number };

type Props = { slug: string; title: string; author: string; sections: SectionMeta[]; introEnds: string };

type Theme = "light" | "sepia" | "night";
type Prefs = { size: number; spacing: number; theme: Theme; font: "serif" | "sans" };
type Note = { id: string; section: string; sectionTitle: string; quote?: string; text: string; created: number };
type Bookmark = { id: string; section: string; sectionTitle: string; ratio: number; created: number };
type Reader = { email: string; name: string | null } | null;
type Panel = "contents" | "settings" | "notes" | null;

const SIZES = [16, 17, 18, 20, 22, 25];
const SPACINGS = [1.55, 1.75, 1.95];
const DEFAULT_PREFS: Prefs = { size: 2, spacing: 1, theme: "light", font: "serif" };
const THEMES: Record<Theme, { label: string; page: string; chrome: string; muted: string; rule: string }> = {
  light: { label: "Light", page: "bg-[#fffdf9] text-[#1d2433]", chrome: "bg-white/95 border-[#ece4d6]", muted: "text-[#69707f]", rule: "border-[#ece4d6]" },
  sepia: { label: "Sepia", page: "bg-[#f5ecd9] text-[#3a2e20]", chrome: "bg-[#efe4cc]/95 border-[#dfcfae]", muted: "text-[#7a6a52]", rule: "border-[#dfcfae]" },
  night: { label: "Night", page: "bg-[#121820] text-[#d9dde3]", chrome: "bg-[#0d1218]/95 border-[#253040]", muted: "text-[#8f9aab]", rule: "border-[#253040]" },
};

/* ---------- Device storage (never required: the reader works without it) ---------- */

function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ({ ...(fallback as object), ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}
function loadList<T>(key: string): T[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
const uid = () => `local-${Math.random().toString(36).slice(2, 10)}`;
const isLocal = (id: string) => id.startsWith("local-");

/** Sends a change to the signed-in reader's account (cross-device sync). Failures leave the device copy intact. */
async function push(body: object): Promise<{ id?: string } | null> {
  try {
    const res = await fetch("/api/reader/state", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

type ServerNote = { id: string; section: string; section_title: string; quote: string | null; body: string; created_at: string };
type ServerBookmark = { id: string; section: string; section_title: string; ratio: number; created_at: string };

function sectionLabel(s: SectionMeta) {
  if (s.kind === "chapter" && s.number) return `Chapter ${s.number}`;
  return "";
}

export function TextReader({ slug, title, author, sections, introEnds }: Props) {
  const total = useMemo(() => sections.reduce((n, s) => n + s.words, 0) || 1, [sections]);
  const before = useMemo(() => sections.map((_, i) => sections.slice(0, i).reduce((n, s) => n + s.words, 0)), [sections]);
  const prologueIndex = sections.findIndex((s) => s.id === introEnds);
  const introIndex = prologueIndex;
  // The end of the main text: the last chapter, or the Epilogue/Conclusion when there is one.
  const finalIndex = useMemo(() => {
    let last = sections.length - 1;
    sections.forEach((s, i) => {
      if (s.kind === "chapter" || /^(epilogue|conclusion)$/i.test(s.title)) last = i;
    });
    return last;
  }, [sections]);

  const [index, setIndex] = useState<number | null>(null);
  const [html, setHtml] = useState<Record<string, string>>({});
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [panel, setPanel] = useState<Panel>(null);
  const [notesTab, setNotesTab] = useState<"notes" | "bookmarks" | "feedback">("notes");
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [reader, setReader] = useState<Reader>(null);
  const [inviteDismissed, setInviteDismissed] = useState(true);
  const [resumed, setResumed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selection, setSelection] = useState<{ text: string; section: string } | null>(null);

  const articleRef = useRef<HTMLElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inviteRef = useRef<HTMLDivElement>(null);
  const ratioRef = useRef(0);
  const syncing = useRef(false);
  const lastPush = useRef(0);
  const pendingRatio = useRef<number | null>(null);
  const completed = useRef(new Set<string>());
  const milestones = useRef(new Set<number>());

  const key = (k: string) => `cmf:reader:${slug}:${k}`;
  const section = index !== null ? sections[index] : null;

  /* ---------- Start: preferences, saved position, account ---------- */

  useEffect(() => {
    // Device storage can only be read in the browser, after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefs(load("cmf:reader:prefs", DEFAULT_PREFS));
    setNotes(loadList<Note>(key("notes")));
    setBookmarks(loadList<Bookmark>(key("bookmarks")));
    setInviteDismissed(load(key("invite"), { done: false }).done);
    milestones.current = new Set(loadList<number>(key("milestones")));

    const hash = decodeURIComponent(window.location.hash.slice(1));
    const fromHash = sections.findIndex((s) => s.id === hash);
    const saved = load<{ section?: string; ratio?: number }>(key("position"), {});
    const savedIndex = sections.findIndex((s) => s.id === saved.section);
    if (fromHash >= 0) setIndex(fromHash);
    else if (savedIndex > 0 || (savedIndex === 0 && (saved.ratio ?? 0) > 0.05)) {
      pendingRatio.current = saved.ratio ?? 0;
      setResumed(true);
      setIndex(savedIndex);
    } else setIndex(0);

    fetch("/api/reader/me", { cache: "no-store" })
      .then((r) => r.json())
      .then(async (d) => {
        setReader(d.reader ?? null);
        if (!d.reader) return;
        const remote = await fetch(`/api/reader/state?book=${slug}`, { cache: "no-store" })
          .then((r) => r.json())
          .catch(() => null);
        if (!remote?.sync) return;
        syncing.current = true;
        // Upload anything written on this device before signing in, then adopt the account's copy.
        const localNotes = loadList<Note>(key("notes")).filter((n) => isLocal(n.id));
        const localMarks = loadList<Bookmark>(key("bookmarks")).filter((b) => isLocal(b.id));
        await Promise.all([
          ...localNotes.map((n) => push({ op: "note.add", book: slug, note: n })),
          ...localMarks.map((b) => push({ op: "bookmark.add", book: slug, bookmark: b })),
        ]);
        const fresh = localNotes.length || localMarks.length ? await fetch(`/api/reader/state?book=${slug}`, { cache: "no-store" }).then((r) => r.json()) : remote;
        const serverNotes: Note[] = (fresh.notes as ServerNote[]).map((n) => ({ id: n.id, section: n.section, sectionTitle: n.section_title, quote: n.quote ?? undefined, text: n.body, created: Date.parse(n.created_at) }));
        const serverMarks: Bookmark[] = (fresh.bookmarks as ServerBookmark[]).map((b) => ({ id: b.id, section: b.section, sectionTitle: b.section_title, ratio: b.ratio, created: Date.parse(b.created_at) }));
        setNotes(serverNotes);
        setBookmarks(serverMarks);
        save(key("notes"), serverNotes);
        save(key("bookmarks"), serverMarks);
        if (fresh.prefs) setPrefs({ ...DEFAULT_PREFS, ...fresh.prefs });
        // Continue from another device when it is further on in time than this one.
        const local = load<{ updated?: number }>(key("position"), {});
        const st = fresh.state as { section?: string; ratio?: number; updated_at?: string } | null;
        if (!hash && st?.section && Date.parse(st.updated_at ?? "") > (local.updated ?? 0) + 5000) {
          const i = sections.findIndex((s) => s.id === st.section);
          if (i >= 0) {
            pendingRatio.current = st.ratio ?? 0;
            setResumed(true);
            setIndex(i);
          }
        }
      })
      .catch(() => {});

    track("reading_start", { book: slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    save("cmf:reader:prefs", prefs);
    if (!syncing.current) return;
    const t = setTimeout(() => push({ op: "prefs", prefs }), 800);
    return () => clearTimeout(t);
  }, [prefs]);

  /* ---------- Load the current section ---------- */

  useEffect(() => {
    if (!section || html[section.id]) return;
    let cancelled = false;
    fetch(`/api/books/${slug}/sections/${encodeURIComponent(section.id)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => !cancelled && setHtml((h) => ({ ...h, [d.id]: d.html })))
      .catch(() => !cancelled && setError(true));
    // Fetch the next section in the background so turning the page is instant.
    const next = index !== null ? sections[index + 1] : undefined;
    if (next && !html[next.id]) {
      fetch(`/api/books/${slug}/sections/${encodeURIComponent(next.id)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d && !cancelled && setHtml((h) => ({ ...h, [d.id]: d.html })))
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section?.id, attempt]);

  // Section shown: update the address, the reading record and analytics; restore the scroll position.
  const ready = section ? Boolean(html[section.id]) : false;
  useEffect(() => {
    if (!section || !ready || index === null) return;
    window.history.replaceState(null, "", `#${section.id}`);
    const ratio = pendingRatio.current ?? 0;
    pendingRatio.current = null;
    requestAnimationFrame(() => {
      const el = articleRef.current;
      if (!el) return;
      const top = el.offsetTop - 80;
      const span = Math.max(el.offsetHeight - window.innerHeight + 160, 0);
      window.scrollTo({ top: ratio > 0 ? top + span * ratio : 0 });
    });
    track("chapter_reached", { book: slug, section: section.id, section_index: index + 1, sections_total: sections.length });
    const library = load<Record<string, unknown>>("cmf:library", {});
    const entry = (library[slug] as { started?: number; completed?: boolean } | undefined) ?? {};
    save("cmf:library", { ...library, [slug]: { ...entry, title, started: entry.started ?? Date.now(), updated: Date.now(), section: section.title } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section?.id, ready]);

  /* ---------- Scrolling: position, progress, milestones ---------- */

  useEffect(() => {
    if (!section || !ready || index === null) return;
    let frame = 0;
    let saveTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = articleRef.current;
        if (!el) return;
        const span = Math.max(el.offsetHeight - window.innerHeight + 160, 1);
        const ratio = Math.min(Math.max((window.scrollY - (el.offsetTop - 80)) / span, 0), 1);
        ratioRef.current = ratio;
        const overall = (before[index] + section.words * ratio) / total;
        setProgress(overall);
        for (const m of [25, 50, 75]) {
          if (overall * 100 >= m && !milestones.current.has(m)) {
            milestones.current.add(m);
            save(key("milestones"), [...milestones.current]);
            track("reading_progress", { book: slug, percent: m });
          }
        }
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
          save(key("position"), { section: section.id, ratio, updated: Date.now() });
          if (syncing.current && Date.now() - lastPush.current > 5000) {
            lastPush.current = Date.now();
            push({ op: "position", book: slug, section: section.id, ratio, percent: Math.round(overall * 100) });
          }
          const library = load<Record<string, { percent?: number }>>("cmf:library", {});
          if (library[slug]) save("cmf:library", { ...library, [slug]: { ...library[slug], percent: Math.max(library[slug].percent ?? 0, Math.round(overall * 100)) } });
        }, 400);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      clearTimeout(saveTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section?.id, ready, index]);

  // Reaching the end of a section completes it. A click alone never counts as reading.
  useEffect(() => {
    const end = endRef.current;
    if (!section || !ready || !end || index === null) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || completed.current.has(section.id)) return;
      completed.current.add(section.id);
      track("chapter_complete", { book: slug, section: section.id, section_index: index + 1 });
      if (index === finalIndex) {
        track("book_complete", { book: slug });
        if (syncing.current) push({ op: "position", book: slug, section: section.id, ratio: 1, percent: 100, completed: true });
        const library = load<Record<string, object>>("cmf:library", {});
        save("cmf:library", { ...library, [slug]: { ...library[slug], completed: true, percent: 100 } });
      }
    });
    io.observe(end);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section?.id, ready]);

  // The registration invitation, recorded once when it is actually seen.
  const showInvite = index === introIndex && !inviteDismissed && !reader;
  useEffect(() => {
    const el = inviteRef.current;
    if (!showInvite || !el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        track("registration_invite_shown", { book: slug });
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [showInvite, ready, slug]);

  // Remember text the reader selects in the book, to attach to a note.
  useEffect(() => {
    const onSelect = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() ?? "";
      if (!text || !articleRef.current || !sel?.anchorNode || !articleRef.current.contains(sel.anchorNode)) return;
      if (section) setSelection({ text: text.slice(0, 600), section: section.id });
    };
    document.addEventListener("selectionchange", onSelect);
    return () => document.removeEventListener("selectionchange", onSelect);
  }, [section]);

  /* ---------- Navigation ---------- */

  const go = useCallback(
    (i: number, ratio = 0) => {
      if (i < 0 || i >= sections.length) return;
      pendingRatio.current = ratio;
      setResumed(false);
      setError(false);
      setIndex(i);
      if (window.innerWidth < 1024) setPanel(null);
      if (ratio === 0) window.scrollTo({ top: 0 });
    },
    [sections.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "Escape") setPanel(null);
      if (index === null) return;
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  const dismissInvite = () => {
    setInviteDismissed(true);
    save(key("invite"), { done: true });
  };

  /* ---------- Notes and bookmarks (private, on this device) ---------- */

  const addNote = (text: string, quote?: string) => {
    if (!section) return;
    const note: Note = { id: uid(), section: section.id, sectionTitle: section.title, quote, text, created: Date.now() };
    const next = [note, ...notes];
    setNotes(next);
    save(key("notes"), next);
    setSelection(null);
    track("note_create", { book: slug });
    if (syncing.current)
      push({ op: "note.add", book: slug, note }).then((res) => {
        if (!res?.id) return;
        setNotes((list) => {
          const updated = list.map((n) => (n.id === note.id ? { ...n, id: res.id! } : n));
          save(key("notes"), updated);
          return updated;
        });
      });
  };
  const removeNote = (id: string) => {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    save(key("notes"), next);
    if (syncing.current && !isLocal(id)) push({ op: "note.delete", book: slug, id });
  };
  const addBookmark = () => {
    if (!section) return;
    const b: Bookmark = { id: uid(), section: section.id, sectionTitle: section.title, ratio: ratioRef.current, created: Date.now() };
    const next = [b, ...bookmarks];
    setBookmarks(next);
    save(key("bookmarks"), next);
    track("bookmark_create", { book: slug });
    if (syncing.current)
      push({ op: "bookmark.add", book: slug, bookmark: b }).then((res) => {
        if (!res?.id) return;
        setBookmarks((list) => {
          const updated = list.map((x) => (x.id === b.id ? { ...x, id: res.id! } : x));
          save(key("bookmarks"), updated);
          return updated;
        });
      });
  };
  const removeBookmark = (id: string) => {
    const next = bookmarks.filter((b) => b.id !== id);
    setBookmarks(next);
    save(key("bookmarks"), next);
    if (syncing.current && !isLocal(id)) push({ op: "bookmark.delete", book: slug, id });
  };

  const theme = THEMES[prefs.theme];
  const bodyStyle = {
    fontSize: `${SIZES[prefs.size]}px`,
    lineHeight: SPACINGS[prefs.spacing],
  };
  const onFrontBeforePrologue = index !== null && prologueIndex > 0 && index < prologueIndex;
  const prologue = prologueIndex >= 0 ? sections[prologueIndex] : null;
  const prev = index !== null && index > 0 ? sections[index - 1] : null;
  const next = index !== null && index < sections.length - 1 ? sections[index + 1] : null;
  const marked = section ? bookmarks.some((b) => b.section === section.id) : false;

  return (
    <div className={`min-h-dvh ${theme.page} ${prefs.theme === "night" ? "reader-night" : ""}`}>
      <a href="#book-text" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:bg-white focus:px-4 focus:py-2 focus:text-ink">
        Skip to the text
      </a>

      {/* Top bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur ${theme.chrome}`}>
        <div className="flex h-14 items-center gap-2 px-3 sm:px-5">
          <Link href={`/books/${slug}`} className={`flex items-center gap-1.5 rounded-full px-2 py-2 text-sm ${theme.muted} hover:opacity-80`}>
            <Icon name="arrowLeft" className="size-4" />
            <span className="hidden sm:inline">Book details</span>
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate font-display text-[1.02rem] leading-tight">{title}</p>
            <p className={`truncate text-[0.72rem] ${theme.muted}`}>{section ? section.title : author}</p>
          </div>
          <ToolButton icon="menu" label="Contents" active={panel === "contents"} onClick={() => setPanel(panel === "contents" ? null : "contents")} />
          <ToolButton icon="contrast" label="Reading settings" active={panel === "settings"} onClick={() => setPanel(panel === "settings" ? null : "settings")} text="Aa" />
          <ToolButton icon="pen" label="Notes, bookmarks and feedback" active={panel === "notes"} onClick={() => setPanel(panel === "notes" ? null : "notes")} />
        </div>
        <div className="h-[3px] w-full bg-black/5" aria-hidden="true">
          <div className="h-full bg-bronze transition-[width] duration-300" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      </header>

      <div className={`transition-[padding] duration-300 ${panel ? "lg:pr-[24rem]" : ""}`}>
        <main id="book-text" className="mx-auto max-w-[40rem] px-5 pt-8 pb-24 sm:px-8 sm:pt-12">
          {resumed && section && (
            <p className={`mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[3px] border px-4 py-3 text-sm ${theme.rule} ${theme.muted}`}>
              Welcome back. You are reading <strong className="font-semibold">{section.title}</strong>.
              <button type="button" className="text-bronze underline underline-offset-2" onClick={() => go(0)}>
                Start from the beginning
              </button>
            </p>
          )}
          {onFrontBeforePrologue && prologue && (
            <div className="mb-8 flex justify-end">
              <button
                type="button"
                onClick={() => go(prologueIndex)}
                className="inline-flex items-center gap-2 rounded-full border border-bronze px-4 py-2 text-[0.78rem] font-semibold tracking-[0.06em] text-bronze uppercase hover:bg-bronze hover:text-white"
              >
                Go to the {prologue.title} <Icon name="arrow" className="size-3.5" />
              </button>
            </div>
          )}

          {section && (
            <article ref={articleRef} aria-labelledby="section-title" className={prefs.font === "serif" ? "font-display" : "font-sans"}>
              {section.id !== "title-page" && (
                <header className={`mb-10 border-b pb-8 text-center ${theme.rule}`}>
                  {sectionLabel(section) && <p className="text-[0.75rem] font-semibold tracking-[0.2em] text-bronze uppercase">{sectionLabel(section)}</p>}
                  <h1 id="section-title" className="mt-2 text-[clamp(1.8rem,5vw,2.5rem)] leading-tight font-medium text-balance">
                    {section.title}
                  </h1>
                  {section.subtitle && <p className={`mt-3 text-[1.15rem] italic ${theme.muted}`}>{section.subtitle}</p>}
                </header>
              )}
              {section.id === "title-page" && <h1 id="section-title" className="sr-only">{title}</h1>}

              {html[section.id] ? (
                <div className="reader-prose" style={bodyStyle} dangerouslySetInnerHTML={{ __html: html[section.id] }} />
              ) : error ? (
                <p className="py-16 text-center">
                  This section could not be loaded. Please check your connection and{" "}
                  <button type="button" className="text-bronze underline" onClick={() => {
                      setError(false);
                      setAttempt((a) => a + 1);
                    }}>
                    try again
                  </button>
                  .
                </p>
              ) : (
                <div className="space-y-4 py-6" aria-busy="true" aria-label="Loading">
                  {[92, 100, 96, 88, 100, 70].map((w, i) => (
                    <div key={i} className="h-4 animate-pulse rounded bg-current opacity-10" style={{ width: `${w}%` }} />
                  ))}
                </div>
              )}
              <div ref={endRef} aria-hidden="true" className="h-px" />
            </article>
          )}

          {/* Registration invitation, after the introduction (instructions §5.5) */}
          {showInvite && ready && (
            <div ref={inviteRef} className={`mt-14 rounded-[4px] border p-6 sm:p-8 ${theme.rule}`}>
              <p className="text-[0.75rem] font-semibold tracking-[0.2em] text-bronze uppercase">You have finished the introduction</p>
              <p className="mt-2 font-display text-2xl leading-snug">How would you like to continue?</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    dismissInvite();
                    track("registration_invite_continue", { book: slug });
                    if (index !== null) go(index + 1);
                  }}
                  className="rounded-[3px] border border-bronze p-5 text-left transition-colors hover:bg-bronze hover:text-white"
                >
                  <span className="block font-semibold">Continue Reading Free</span>
                  <span className="mt-1 block text-sm opacity-80">Read the complete book without an account.</span>
                </button>
                <Link
                  href={`/reader/register?book=${slug}&next=${encodeURIComponent(`/read/${slug}#${next?.id ?? ""}`)}`}
                  onClick={dismissInvite}
                  className="rounded-[3px] bg-bronze p-5 text-left text-white transition-colors hover:bg-bronze-dark"
                >
                  <span className="block font-semibold">Create a Free Reader Account</span>
                  <span className="mt-1 block text-sm opacity-90">Optional. Unlock reading and reflection tools.</span>
                </Link>
              </div>
              <p className={`mt-4 text-xs ${theme.muted}`}>No payment or donation is needed to read, now or later.</p>
            </div>
          )}

          {/* Previous and next */}
          {section && (
            <nav aria-label="Sections" className={`mt-16 grid grid-cols-2 gap-3 border-t pt-6 ${theme.rule}`}>
              <div>
                {prev && (
                  <button type="button" onClick={() => index !== null && go(index - 1)} className="group w-full text-left">
                    <span className={`flex items-center gap-1.5 text-xs tracking-[0.12em] uppercase ${theme.muted}`}>
                      <Icon name="chevronLeft" className="size-3.5" /> Previous
                    </span>
                    <span className="mt-1 block font-display text-[1.05rem] leading-snug group-hover:text-bronze">{prev.title}</span>
                  </button>
                )}
              </div>
              <div className="text-right">
                {next ? (
                  <button type="button" onClick={() => index !== null && go(index + 1)} className="group w-full text-right">
                    <span className={`flex items-center justify-end gap-1.5 text-xs tracking-[0.12em] uppercase ${theme.muted}`}>
                      Next <Icon name="chevronRight" className="size-3.5" />
                    </span>
                    <span className="mt-1 block font-display text-[1.05rem] leading-snug group-hover:text-bronze">{next.title}</span>
                  </button>
                ) : (
                  <Link href={`/books/${slug}`} className="group block">
                    <span className={`text-xs tracking-[0.12em] uppercase ${theme.muted}`}>The end</span>
                    <span className="mt-1 block font-display text-[1.05rem] group-hover:text-bronze">Back to the book</span>
                  </Link>
                )}
              </div>
            </nav>
          )}
          <p className={`mt-10 text-center text-xs ${theme.muted}`}>
            {Math.round(progress * 100)}% of {title} · Use ← and → to turn sections
          </p>
        </main>
      </div>

      {/* Side panel on desktop; a drawer on phones */}
      {panel && (
        <>
          <button type="button" aria-label="Close panel" className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setPanel(null)} />
          <aside
            aria-label={panel === "contents" ? "Contents" : panel === "settings" ? "Reading settings" : "Notes, bookmarks and feedback"}
            className={`fixed inset-x-0 bottom-0 z-50 max-h-[82dvh] overflow-y-auto rounded-t-[12px] border-t p-5 shadow-2xl lg:top-[59px] lg:right-0 lg:bottom-0 lg:left-auto lg:max-h-none lg:w-[24rem] lg:rounded-none lg:border-t-0 lg:border-l lg:shadow-none ${theme.page} ${theme.rule}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-xl">{panel === "contents" ? "Contents" : panel === "settings" ? "Reading settings" : "Your reading tools"}</p>
              <button type="button" onClick={() => setPanel(null)} aria-label="Close" className="rounded-full p-2 hover:bg-black/5">
                <Icon name="close" className="size-5" />
              </button>
            </div>

            {panel === "contents" && (
              <ol className="space-y-0.5">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={i === index ? "true" : undefined}
                      className={`w-full rounded-[3px] px-3 py-2 text-left text-[0.95rem] leading-snug hover:bg-black/5 aria-[current]:bg-bronze aria-[current]:text-white ${
                        s.kind === "chapter" ? "pl-6" : s.kind === "part" ? "mt-3 font-semibold" : ""
                      }`}
                    >
                      {s.kind === "chapter" && s.number ? <span className="mr-2 opacity-60">{s.number}.</span> : null}
                      {s.title}
                      {s.subtitle && s.kind === "part" ? <span className="block text-sm font-normal opacity-70">{s.subtitle}</span> : null}
                    </button>
                  </li>
                ))}
              </ol>
            )}

            {panel === "settings" && (
              <div className="space-y-7">
                <Setting label="Text size">
                  <div className="flex items-center gap-3">
                    <Stepper label="Smaller text" disabled={prefs.size === 0} onClick={() => setPrefs({ ...prefs, size: prefs.size - 1 })} icon="minus" />
                    <span className="w-14 text-center tabular-nums">{SIZES[prefs.size]}px</span>
                    <Stepper label="Larger text" disabled={prefs.size === SIZES.length - 1} onClick={() => setPrefs({ ...prefs, size: prefs.size + 1 })} icon="plus" />
                  </div>
                </Setting>
                <Setting label="Line spacing">
                  <Choice options={["Compact", "Comfortable", "Airy"]} value={prefs.spacing} onChange={(v) => setPrefs({ ...prefs, spacing: v })} />
                </Setting>
                <Setting label="Page colour">
                  <Choice options={(["light", "sepia", "night"] as Theme[]).map((t) => THEMES[t].label)} value={["light", "sepia", "night"].indexOf(prefs.theme)} onChange={(v) => setPrefs({ ...prefs, theme: (["light", "sepia", "night"] as Theme[])[v] })} />
                </Setting>
                <Setting label="Typeface">
                  <Choice options={["Book serif", "Clean sans"]} value={prefs.font === "serif" ? 0 : 1} onChange={(v) => setPrefs({ ...prefs, font: v ? "sans" : "serif" })} />
                </Setting>
                <p className={`text-xs ${theme.muted}`}>Your settings are saved on this device.</p>
              </div>
            )}

            {panel === "notes" && (
              <ToolsPanel
                slug={slug}
                title={title}
                section={section}
                notes={notes}
                bookmarks={bookmarks}
                marked={marked}
                tab={notesTab}
                setTab={setNotesTab}
                selection={selection && selection.section === section?.id ? selection.text : null}
                clearSelection={() => setSelection(null)}
                reader={reader}
                muted={theme.muted}
                rule={theme.rule}
                onAddNote={addNote}
                onRemoveNote={removeNote}
                onAddBookmark={addBookmark}
                onRemoveBookmark={removeBookmark}
                onOpen={(sectionId, ratio) => go(Math.max(sections.findIndex((s) => s.id === sectionId), 0), ratio)}
              />
            )}
          </aside>
        </>
      )}
    </div>
  );
}

/* ---------- Pieces ---------- */

function ToolButton({ icon, label, active, onClick, text }: { icon: IconName; label: string; active: boolean; onClick: () => void; text?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-black/5 aria-pressed:bg-bronze aria-pressed:text-white"
    >
      {text ? <span className="font-display text-[1.05rem] font-semibold">{text}</span> : <Icon name={icon} className="size-[1.15rem]" strokeWidth={1.8} />}
    </button>
  );
}

function Setting({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-[0.14em] uppercase opacity-70">{label}</p>
      {children}
    </div>
  );
}

function Stepper({ label, icon, disabled, onClick }: { label: string; icon: IconName; disabled: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className="flex size-10 items-center justify-center rounded-full border border-current/30 disabled:opacity-30">
      <Icon name={icon} className="size-4" />
    </button>
  );
}

function Choice({ options, value, onChange }: { options: string[]; value: number; onChange: (v: number) => void }) {
  return (
    <div role="radiogroup" className="grid gap-1 rounded-[4px] bg-black/5 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((o, i) => (
        <button key={o} type="button" role="radio" aria-checked={i === value} onClick={() => onChange(i)} className="rounded-[3px] px-2 py-2 text-sm aria-checked:bg-bronze aria-checked:text-white">
          {o}
        </button>
      ))}
    </div>
  );
}

function ToolsPanel(props: {
  slug: string;
  title: string;
  section: SectionMeta | null;
  notes: Note[];
  bookmarks: Bookmark[];
  marked: boolean;
  tab: "notes" | "bookmarks" | "feedback";
  setTab: (t: "notes" | "bookmarks" | "feedback") => void;
  selection: string | null;
  clearSelection: () => void;
  reader: Reader;
  muted: string;
  rule: string;
  onAddNote: (text: string, quote?: string) => void;
  onRemoveNote: (id: string) => void;
  onAddBookmark: () => void;
  onRemoveBookmark: (id: string) => void;
  onOpen: (section: string, ratio?: number) => void;
}) {
  const { slug, section, notes, bookmarks, tab, setTab, selection, reader, muted, rule } = props;
  const [draft, setDraft] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const emailNotes = async () => {
    setEmailState("sending");
    const res = await fetch("/api/reader/notes-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book: slug, notes: notes.map((n) => ({ section: n.sectionTitle, quote: n.quote, text: n.text })) }),
    }).catch(() => null);
    setEmailState(res?.ok ? "sent" : "error");
    if (res?.ok) track("notes_emailed", { book: slug });
  };

  return (
    <div>
      <div role="tablist" className="mb-5 grid grid-cols-3 gap-1 rounded-[4px] bg-black/5 p-1">
        {(["notes", "bookmarks", "feedback"] as const).map((t) => (
          <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)} className="rounded-[3px] px-2 py-2 text-sm capitalize aria-selected:bg-bronze aria-selected:text-white">
            {t}
          </button>
        ))}
      </div>

      {tab === "notes" && (
        <div>
          <p className={`text-xs ${muted}`}>
            <Icon name="lock" className="mr-1 inline size-3.5 align-[-2px]" />
            {reader ? "Private. Your notes are kept in your account so they follow you to your other devices. Only you can see them." : "Private. Your notes are saved on this device and are never sent to the Foundation."}
          </p>
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              props.onAddNote(draft.trim(), selection ?? undefined);
              setDraft("");
            }}
          >
            {selection && (
              <blockquote className={`mb-2 border-l-2 border-bronze pl-3 text-sm italic ${muted}`}>
                &ldquo;{selection.length > 220 ? `${selection.slice(0, 220)}…` : selection}&rdquo;
                <button type="button" className="ml-2 text-xs not-italic underline" onClick={props.clearSelection}>
                  remove
                </button>
              </blockquote>
            )}
            <label className="block text-sm">
              <span className="sr-only">Your note</span>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={4}
                placeholder={section ? `A reflection, observation or question on ${section.title}…` : "Write a note…"}
                className="w-full rounded-[3px] border border-current/20 bg-transparent p-3 text-[0.95rem] outline-none focus:border-bronze"
              />
            </label>
            {!selection && <p className={`mt-1 text-xs ${muted}`}>Tip: select a passage in the book first to attach it to your note.</p>}
            <button type="submit" disabled={!draft.trim()} className="mt-3 rounded-[3px] bg-bronze px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
              Save note
            </button>
          </form>

          <ul className="mt-6 space-y-3">
            {notes.map((n) => (
              <li key={n.id} className={`rounded-[3px] border p-3 text-sm ${rule}`}>
                <button type="button" onClick={() => props.onOpen(n.section)} className="text-xs font-semibold tracking-[0.06em] text-bronze uppercase hover:underline">
                  {n.sectionTitle}
                </button>
                {n.quote && <p className={`mt-1 italic ${muted}`}>&ldquo;{n.quote}&rdquo;</p>}
                <p className="mt-1 whitespace-pre-wrap">{n.text}</p>
                <button type="button" onClick={() => props.onRemoveNote(n.id)} className={`mt-2 text-xs underline ${muted}`}>
                  Delete
                </button>
              </li>
            ))}
          </ul>

          {notes.length > 0 && (
            <div className={`mt-6 border-t pt-4 text-sm ${rule}`}>
              {reader ? (
                <button type="button" disabled={emailState === "sending"} onClick={emailNotes} className="rounded-[3px] border border-bronze px-4 py-2.5 font-semibold text-bronze hover:bg-bronze hover:text-white">
                  {emailState === "sent" ? "Sent to your email" : emailState === "sending" ? "Sending…" : "Email my notes"}
                </button>
              ) : (
                <p className={muted}>
                  <Link href={`/reader/register?book=${slug}&next=${encodeURIComponent(`/read/${slug}`)}`} className="text-bronze underline">
                    Create a free reader account
                  </Link>{" "}
                  to have your notes emailed to you.
                </p>
              )}
              {emailState === "error" && <p className="mt-2 text-red-700">Your notes could not be sent. Please try again later.</p>}
            </div>
          )}
        </div>
      )}

      {tab === "bookmarks" && (
        <div>
          <button type="button" onClick={props.onAddBookmark} disabled={!section} className="rounded-[3px] bg-bronze px-4 py-2.5 text-sm font-semibold text-white">
            {props.marked ? "Bookmark this place again" : "Bookmark this place"}
          </button>
          <p className={`mt-2 text-xs ${muted}`}>{reader ? "Bookmarks are saved to your account." : "Bookmarks are saved on this device."}</p>
          <ul className="mt-5 space-y-2">
            {bookmarks.map((b) => (
              <li key={b.id} className={`flex items-center justify-between gap-3 rounded-[3px] border px-3 py-2 text-sm ${rule}`}>
                <button type="button" onClick={() => props.onOpen(b.section, b.ratio)} className="text-left hover:text-bronze">
                  {b.sectionTitle}
                  <span className={`block text-xs ${muted}`}>{Math.round(b.ratio * 100)}% through · {new Date(b.created).toLocaleDateString("en-GB")}</span>
                </button>
                <button type="button" aria-label={`Remove bookmark at ${b.sectionTitle}`} onClick={() => props.onRemoveBookmark(b.id)} className="p-1 opacity-60 hover:opacity-100">
                  <Icon name="close" className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "feedback" && <Feedback slug={slug} section={section?.title} reader={reader} muted={muted} />}

      <div className={`mt-8 border-t pt-4 text-xs ${rule} ${muted}`}>
        {reader ? (
          <>
            Signed in as {reader.name ?? reader.email}.{" "}
            <Link href="/reader" className="underline">
              Your reader account
            </Link>
          </>
        ) : (
          <>
            Reading as a guest.{" "}
            <Link href={`/reader/sign-in?next=${encodeURIComponent(`/read/${slug}`)}`} className="underline">
              Sign in
            </Link>{" "}
            or{" "}
            <Link href={`/reader/register?book=${slug}&next=${encodeURIComponent(`/read/${slug}`)}`} className="underline">
              create a free account
            </Link>
            .
          </>
        )}
      </div>
    </div>
  );
}

function Feedback({ slug, section, reader, muted }: { slug: string; section?: string; reader: Reader; muted: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  if (state === "sent")
    return (
      <div className="text-sm">
        <p className="font-semibold">Thank you. Your message has reached the Foundation.</p>
        <p className={`mt-1 ${muted}`}>{copied ? "A copy has been sent to your email." : "If you gave an email address, we may reply to you there."}</p>
        <button type="button" className="mt-3 text-bronze underline" onClick={() => setState("idle")}>
          Send another
        </button>
      </div>
    );

  return (
    <form
      className="space-y-3 text-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        setState("sending");
        const res = await fetch("/api/reader/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, message, book: slug, section }),
        }).catch(() => null);
        const json = await res?.json().catch(() => null);
        if (res?.ok) {
          setCopied(Boolean(json?.copied));
          setMessage("");
          setState("sent");
          track("feedback_submit", { book: slug });
        } else {
          setError(json?.error ?? "Your message could not be sent. Please try again.");
          setState("error");
        }
      }}
    >
      <p className={muted}>Comments, questions or observations for CMF. Only what you write here is sent; your private notes are not.</p>
      <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-[3px] border border-current/20 bg-transparent p-3 outline-none focus:border-bronze" aria-label="Your message to CMF" />
      {!reader && (
        <div className="grid gap-2 sm:grid-cols-2">
          <input name="name" placeholder="Name (optional)" className="rounded-[3px] border border-current/20 bg-transparent p-2.5 outline-none focus:border-bronze" aria-label="Your name (optional)" />
          <input name="email" type="email" placeholder="Email (optional)" className="rounded-[3px] border border-current/20 bg-transparent p-2.5 outline-none focus:border-bronze" aria-label="Your email (optional)" />
        </div>
      )}
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button type="submit" disabled={state === "sending" || !message.trim()} className="rounded-[3px] bg-bronze px-4 py-2.5 font-semibold text-white disabled:opacity-40">
        {state === "sending" ? "Sending…" : "Send feedback to CMF"}
      </button>
      {state === "error" && <p className="text-red-700">{error}</p>}
      {section && <p className={`text-xs ${muted}`}>We&rsquo;ll note that you were reading {section}.</p>}
    </form>
  );
}
