"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { availableBooks, type Collection, topics } from "@/lib/books";
import { BookCard } from "./book-card";
import { Icon } from "./icons";
import { SlideIcon } from "./ui";

const tabs: { id: "all" | Exclude<Collection, "forthcoming">; label: string }[] = [
  { id: "all", label: "All" },
  { id: "founder", label: "Founder's Library" },
  { id: "current", label: "Current Series" },
];

const PAGE = 12;

export function Library({ readable }: { readable: string[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");
  const [topic, setTopic] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest" | "title">("latest");
  const [limit, setLimit] = useState(PAGE);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return availableBooks
      .filter((b) => tab === "all" || b.collection === tab)
      .filter((b) => !topic || b.topics.includes(topic))
      .filter((b) => !q || `${b.title} ${b.subtitle ?? ""} ${b.author}`.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sort === "title") return a.title.localeCompare(b.title);
        const diff = (a.year ?? 0) - (b.year ?? 0);
        return sort === "latest" ? -diff : diff;
      });
  }, [tab, topic, query, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Collection" className="flex gap-1 overflow-x-auto rounded-xl bg-sand p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => {
                setTab(t.id);
                setLimit(PAGE);
              }}
              className="relative rounded-lg px-5 py-2.5 text-sm whitespace-nowrap text-ink transition-colors duration-300 hover:text-bronze aria-selected:text-white aria-selected:hover:text-white"
            >
              {tab === t.id && (
                <motion.span layoutId="library-tab" className="absolute inset-0 rounded-lg bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
          <a href="#forthcoming" className="rounded-lg px-5 py-2.5 text-sm whitespace-nowrap text-ink transition-colors hover:text-bronze">
            Forthcoming
          </a>
        </div>
        <div className="flex gap-3">
          <label className="relative flex-1 lg:w-72">
            <span className="sr-only">Search books</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search books…" className="field pr-10" type="search" />
            <Icon name="search" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink" strokeWidth={2} />
          </label>
          <label>
            <span className="sr-only">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="field w-auto">
              <option value="latest">Sort by: Latest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="title">Sort by: Title</option>
            </select>
          </label>
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Filter by topic">
        {topics.map((t) => (
          <li key={t}>
            <button
              aria-pressed={topic === t}
              onClick={() => setTopic(topic === t ? null : t)}
              className="rounded-full border border-ink/20 px-4 py-1.5 text-sm text-ink transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-bronze active:scale-95 aria-pressed:border-bronze aria-pressed:bg-bronze aria-pressed:text-white"
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
        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.slice(0, limit).map((b) => (
              <motion.div
                key={b.slug}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <BookCard book={b} readable={readable.includes(b.slug)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {results.length > limit && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setLimit(limit + PAGE)}
            className="group inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3.5 text-ink transition-colors hover:bg-ink hover:text-white active:scale-[0.97]"
          >
            Load more books <SlideIcon name="arrowDown" />
          </button>
        </div>
      )}
    </div>
  );
}
