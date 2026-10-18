import "server-only";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { books, getBook } from "./books";

// Book PDFs live in <project root>/books/<slug>.pdf, deliberately outside /public, so there is no
// public URL to download them from. They are streamed only to the on-site reader by
// app/api/books/[slug]/route.ts. A book becomes readable as soon as its PDF is added and the site
// is redeployed. See books/README.md.

export const BOOKS_DIR = path.join(process.cwd(), "books");

/** Header the reader sends with every request; direct visits to the file URL don't have it. */
export const READER_HEADER = "x-cmf-reader";

/** Absolute path of a book's PDF, or null when the slug is unknown or the file isn't there yet. */
export function manuscriptPath(slug: string) {
  // Only catalogue slugs resolve to a path, so request input can never reach the file system.
  if (!getBook(slug)) return null;
  const file = path.join(BOOKS_DIR, `${slug}.pdf`);
  try {
    return existsSync(file) && statSync(file).isFile() ? file : null;
  } catch {
    return null;
  }
}

export function isReadable(slug: string) {
  return manuscriptPath(slug) !== null;
}

/** Slugs of every catalogue title whose PDF has been supplied. */
export function readableSlugs() {
  return books.filter((b) => isReadable(b.slug)).map((b) => b.slug);
}
