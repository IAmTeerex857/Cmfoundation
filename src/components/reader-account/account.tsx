"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

type Reader = { email: string; name: string | null; country: string | null } | null;
type Entry = { title: string; started?: number; updated?: number; section?: string; percent?: number; completed?: boolean };

const btn = "rounded-[3px] px-5 py-3 text-[0.78rem] font-semibold tracking-[0.08em] uppercase";

/** The reader's account page: who is signed in, their library on this device, and their data choices. */
export function Account({ books, welcome, signedIn }: { books: { slug: string; title: string; author: string }[]; welcome: boolean; signedIn: boolean }) {
  const [reader, setReader] = useState<Reader | undefined>(undefined);
  const [library, setLibrary] = useState<Record<string, Entry>>({});
  const [message, setMessage] = useState("");
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    fetch("/api/reader/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setReader(d.reader ?? null))
      .catch(() => setReader(null));
    let local: Record<string, Entry> = {};
    try {
      local = JSON.parse(window.localStorage.getItem("cmf:library") ?? "{}");
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser storage is read after hydration
    setLibrary(local);
    // Signed in: the account's library from every device, merged with this device's.
    fetch("/api/reader/library", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { sync: boolean; books: { book: string; percent: number; updated_at: string; started_at: string; completed_at: string | null; section: string | null; saved: boolean }[] }) => {
        if (!d.sync) return;
        const merged = { ...local };
        for (const b of d.books) {
          const mine = merged[b.book];
          const updated = Date.parse(b.updated_at);
          merged[b.book] = {
            title: mine?.title ?? books.find((x) => x.slug === b.book)?.title ?? b.book,
            started: Math.min(mine?.started ?? Infinity, Date.parse(b.started_at)),
            updated: Math.max(mine?.updated ?? 0, updated),
            percent: Math.max(mine?.percent ?? 0, b.percent),
            completed: Boolean(mine?.completed || b.completed_at),
            section: mine && (mine.updated ?? 0) > updated ? mine.section : (mine?.section ?? undefined),
          };
        }
        setLibrary(merged);
        setSynced(true);
      })
      .catch(() => {});
  }, [books]);

  useEffect(() => {
    if (reader && welcome) track("sign_up", { method: "email_link" });
    if (reader && signedIn) track("login", { method: "email_link" });
  }, [reader, welcome, signedIn]);

  const request = async (kind: "delete" | "access") => {
    if (kind === "delete" && !window.confirm("Delete your reader account? Your notes, bookmarks and reading history will be permanently removed.")) return;
    const res = await fetch("/api/reader/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind }) }).catch(() => null);
    if (!res?.ok) return setMessage("Your request could not be sent. Please email hello@cm.foundation.");
    const { automatic } = (await res.json().catch(() => ({}))) as { automatic?: boolean };
    if (kind === "delete") {
      try {
        for (const k of Object.keys(window.localStorage)) if (k.startsWith("cmf:reader:") || k === "cmf:library") window.localStorage.removeItem(k);
      } catch {}
      setReader(null);
      setLibrary({});
      setMessage(
        automatic
          ? "Your account, notes, bookmarks and reading history have been deleted, and this device has been cleared."
          : "Your account has been closed and your deletion request sent to the Foundation. This device has been cleared.",
      );
    } else setMessage(automatic ? "A copy of all the information we hold about you has been emailed to you." : "Your request has been sent. The Foundation will email you a copy of the information it holds.");
  };

  const entries = books.filter((b) => library[b.slug]).map((b) => ({ ...b, ...library[b.slug] }));
  if (reader === undefined) return <p className="text-muted">Loading…</p>;

  return (
    <div className="space-y-12">
      {message && <p className="rounded-[3px] border border-line bg-blush px-4 py-3 text-sm text-ink">{message}</p>}
      {reader ? (
        <div className="tile p-6 sm:p-8">
          {welcome && <p className="mb-3 font-semibold text-bronze">Welcome. Your free reader account is ready.</p>}
          <p className="text-sm text-muted">Signed in as</p>
          <p className="font-display text-2xl text-ink">{reader.name ?? reader.email}</p>
          {reader.name && <p className="text-body">{reader.email}</p>}
          {reader.country && <p className="text-sm text-muted">{reader.country}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className={`${btn} border border-bronze text-bronze hover:bg-bronze hover:text-white`}
              onClick={async () => {
                await fetch("/api/reader/sign-out", { method: "POST" }).catch(() => null);
                setReader(null);
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <div className="tile p-6 sm:p-8">
          <p className="font-display text-2xl text-ink">You are reading as a guest</p>
          <p className="mt-2 max-w-xl leading-relaxed text-body">Every book is free to read without an account. A free account lets you have your notes emailed to you and receive a copy of any feedback you send.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/reader/register" className={`${btn} bg-bronze text-white hover:bg-bronze-dark`}>
              Create a free account
            </Link>
            <Link href="/reader/sign-in" className={`${btn} border border-bronze text-bronze hover:bg-bronze hover:text-white`}>
              Sign in
            </Link>
          </div>
        </div>
      )}

      <div>
        <h2 className="display-md">Your library</h2>
        {entries.length === 0 ? (
          <p className="mt-3 text-muted">
            Books you start reading will appear here.{" "}
            <Link href="/literature#library" className="text-bronze underline">
              Browse the free library
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {entries.map((e) => (
              <li key={e.slug} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-display text-xl text-ink">{e.title}</p>
                  <p className="text-sm text-muted">
                    {e.completed ? "Completed" : `${e.percent ?? 0}% read`}
                    {e.section ? ` · last at ${e.section}` : ""}
                    {e.updated ? ` · ${new Date(e.updated).toLocaleDateString("en-GB")}` : ""}
                  </p>
                </div>
                <Link href={`/read/${e.slug}`} className={`${btn} bg-bronze text-white hover:bg-bronze-dark`}>
                  {e.completed ? "Read again" : "Continue"}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted">
          {synced
            ? "Your reading position, notes and bookmarks are saved to your account and follow you to any device you sign in on."
            : "As a guest, your reading position, notes and bookmarks are stored in this browser. Sign in to keep them on every device."}
        </p>
      </div>

      {reader && (
        <div>
          <h2 className="display-sm">Your information</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            You can ask for a copy of the personal information we hold about you, or close your account and have your registration deleted. See our{" "}
            <Link href="/privacy" className="text-bronze underline">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => request("access")} className={`${btn} border border-line text-ink hover:border-bronze`}>
              Request my data
            </button>
            <button type="button" onClick={() => request("delete")} className={`${btn} border border-red-300 text-red-800 hover:bg-red-50`}>
              Delete my account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
