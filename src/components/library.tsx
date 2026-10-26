"use client";

import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { books, type Collection, topics } from "@/lib/books";
import { BookCard } from "./book-card";
import { Icon } from "./icons";
import { smoothScroll } from "./motion/smooth-scroll";
import { SplitWords } from "./motion/split-words";
import { Button, SlideIcon } from "./ui";

type Tab = "all" | Collection;

const tabs: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "founder", label: "Founder's Library" },
  { id: "current", label: "Current Series" },
  { id: "forthcoming", label: "Forthcoming" },
];

const isTab = (v: string | null): v is Tab => tabs.some((t) => t.id === v);

const PAGE = 12;

// Links elsewhere on the page (the author cards) open the library on one collection.
const SELECT_EVENT = "cmf:library-collection";

/** A button that scrolls to the library and switches it to one collection. */
export function LibraryLink({ collection, children }: { collection: Tab; children: ReactNode }) {
  return (
    <Button
      href="#library"
      variant="outline"
      className="whitespace-nowrap"
      scroll={false}
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(SELECT_EVENT, { detail: collection }));
        // Scroll after the library has re-rendered with the new collection.
        requestAnimationFrame(() => {
          const target = document.getElementById("library");
          if (!target) return;
          if (smoothScroll.current) smoothScroll.current.scrollTo(target, { offset: -96 });
          else target.scrollIntoView({ behavior: "smooth" });
        });
      }}
    >
      {children}
    </Button>
  );
}

const tabClass =
  "border border-line px-5 py-2.5 text-[0.75rem] font-semibold tracking-[0.08em] whitespace-nowrap uppercase transition-colors duration-300 -ml-px first:ml-0 first:rounded-l-[3px] last:rounded-r-[3px]";

export function Library({ readable }: { readable: string[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [topic, setTopic] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest" | "title">("latest");
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    const select = (e: Event) => {
      setTab((e as CustomEvent<Tab>).detail);
      setTopic(null);
      setQuery("");
      setLimit(PAGE);
    };
    window.addEventListener(SELECT_EVENT, select);
    // Links from other pages can open one collection: /literature?collection=forthcoming#library
    const requested = new URLSearchParams(window.location.search).get("collection");
    if (isTab(requested)) window.dispatchEvent(new CustomEvent(SELECT_EVENT, { detail: requested }));
    return () => window.removeEventListener(SELECT_EVENT, select);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books
      .filter((b) => tab === "all" || b.collection === tab)
      .filter((b) => !topic || b.topics.includes(topic))
      .filter((b) => !q || `${b.title} ${b.subtitle ?? ""} ${b.author}`.toLowerCase().includes(q))
      .sort((a, b) => {
        // Published titles come before forthcoming ones.
        const upcoming = Number(a.collection === "forthcoming") - Number(b.collection === "forthcoming");
        if (upcoming) return upcoming;
        if (sort === "title") return a.title.localeCompare(b.title);
        const diff = (a.year ?? 0) - (b.year ?? 0);
        return sort === "latest" ? -diff : diff;
      });
  }, [tab, topic, query, sort]);

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p data-reveal="fade" className="eyebrow">
            The free library
          </p>
          <h2 data-reveal="words" className="display-lg mt-3">
            <SplitWords>Read. Reflect. Share.</SplitWords>
          </h2>
        </div>
        <div className="flex gap-3">
          <label className="relative flex-1 lg:w-64">
            <span className="sr-only">Search books</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search books…" className="field py-3 pr-10" type="search" />
            <Icon name="search" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink" strokeWidth={2} />
          </label>
          <label>
            <span className="sr-only">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="field w-auto py-3 text-sm">
              <option value="latest">Sort by: Latest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="title">Sort by: Title</option>
            </select>
          </label>
        </div>
      </div>

      <div role="tablist" aria-label="Collection" className="mt-6 flex overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => {
              setTab(t.id);
              setLimit(PAGE);
            }}
            className={`${tabClass} bg-white text-ink hover:text-bronze aria-selected:border-bronze aria-selected:bg-bronze aria-selected:text-white`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-2" aria-label="Filter by topic">
        {topics.map((t) => (
          <li key={t}>
            <button
              aria-pressed={topic === t}
              onClick={() => setTopic(topic === t ? null : t)}
              className="border-b border-transparent py-1 text-sm text-ink transition-colors duration-300 hover:text-bronze aria-pressed:border-bronze aria-pressed:text-bronze"
            >
              {t}
            </button>
          </li>
        ))}
      </ul>

      {results.length === 0 ? (
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-center text-muted">
          No books match your search. Try another topic or clear the filters.
        </motion.p>
      ) : (
        <motion.ul layout className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.slice(0, limit).map((b) => (
              <motion.li
                key={b.slug}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <BookCard book={b} readable={readable.includes(b.slug)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {results.length > limit && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setLimit(limit + PAGE)}
            className="group inline-flex items-center gap-3 rounded-[3px] border border-bronze px-6 py-3.5 text-[0.82rem] leading-none font-semibold tracking-[0.08em] text-bronze uppercase transition-colors hover:bg-bronze hover:text-white"
          >
            Load more books <SlideIcon name="arrowDown" />
          </button>
        </div>
      )}
    </div>
  );
}
