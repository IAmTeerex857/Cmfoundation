"use client";

import { useMemo, useState } from "react";
import { availableBooks, type Collection, topics } from "@/lib/books";
import { BookCard } from "./book-card";
import { Icon } from "./icons";

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
              className="rounded-lg px-5 py-2.5 text-sm whitespace-nowrap text-ink aria-selected:bg-ink aria-selected:text-white"
            >
              {t.label}
            </button>
          ))}
          <a href="#forthcoming" className="rounded-lg px-5 py-2.5 text-sm whitespace-nowrap text-ink hover:text-bronze">
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
              className="rounded-full border border-ink/25 px-4 py-1.5 text-sm text-ink hover:border-bronze aria-pressed:border-bronze aria-pressed:bg-bronze aria-pressed:text-white"
            >
              {t}
            </button>
          </li>
        ))}
      </ul>

      {results.length === 0 ? (
        <p className="mt-12 text-center text-muted">No books match your search. Try another topic or clear the filters.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.slice(0, limit).map((b) => (
            <BookCard key={b.slug} book={b} readable={readable.includes(b.slug)} />
          ))}
        </div>
      )}

      {results.length > limit && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setLimit(limit + PAGE)}
            className="inline-flex items-center gap-2 rounded-xl border border-ink px-6 py-3.5 text-ink hover:bg-ink hover:text-white"
          >
            Load more books <Icon name="arrowDown" className="size-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
