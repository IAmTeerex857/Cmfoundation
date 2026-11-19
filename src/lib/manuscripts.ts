import "server-only";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { books, getBook } from "./books";

// Book files live in <project root>/books, deliberately outside /public:
//
//   books/<slug>/edition.json   the text edition, imported from the publisher's EPUB with
//                               `npm run import-book`. Read as text in the reader (preferred).
//   books/<slug>.pdf            a PDF edition, streamed to the page-image reader by
//                               app/api/books/[slug]/route.ts (used when there is no text edition).
//
// A book becomes readable as soon as either file is added and the site is redeployed. See books/README.md.

export const BOOKS_DIR = path.join(process.cwd(), "books");

/** Header the PDF reader sends with every request; direct visits to the file URL don't have it. */
export const READER_HEADER = "x-cmf-reader";

export type EditionSection = {
  id: string;
  kind: "front" | "prologue" | "part" | "chapter" | "back";
  number?: number;
  title: string;
  subtitle?: string;
  words: number;
  html: string;
};

export type TextEdition = {
  slug: string;
  source: string;
  importedAt: string;
  title: string;
  creator: string;
  publisher: string;
  /** Section after which the registration invitation is shown (the Prologue or its equivalent). */
  introEnds: string;
  words: number;
  sections: EditionSection[];
};

function file(p: string) {
  try {
    return existsSync(p) && statSync(p).isFile() ? p : null;
  } catch {
    return null;
  }
}

/** Absolute path of a book's PDF, or null when the slug is unknown or the file isn't there yet. */
export function manuscriptPath(slug: string) {
  // Only catalogue slugs resolve to a path, so request input can never reach the file system.
  if (!getBook(slug)) return null;
  return file(path.join(BOOKS_DIR, `${slug}.pdf`));
}

function editionPath(slug: string) {
  if (!getBook(slug)) return null;
  return file(path.join(BOOKS_DIR, slug, "edition.json"));
}

const cache = new Map<string, TextEdition>();

/** The text edition of a book, or null when it has none. */
export function textEdition(slug: string): TextEdition | null {
  const p = editionPath(slug);
  if (!p) return null;
  // The path is limited to books/<catalogue slug>/edition.json (checked above). Those files ship with
  // the routes that read them through outputFileTracingIncludes in next.config.ts.
  if (!cache.has(slug)) cache.set(slug, JSON.parse(readFileSync(/*turbopackIgnore: true*/ p, "utf8")) as TextEdition);
  return cache.get(slug)!;
}

export function isReadable(slug: string) {
  return editionPath(slug) !== null || manuscriptPath(slug) !== null;
}

/** Slugs of every catalogue title that can be read online. */
export function readableSlugs() {
  return books.filter((b) => isReadable(b.slug)).map((b) => b.slug);
}
