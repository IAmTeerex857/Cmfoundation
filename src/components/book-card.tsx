import Link from "next/link";
import type { Book } from "@/lib/books";
import { BookCover } from "./book-cover";

const button =
  "flex w-full items-center justify-center rounded-[3px] px-3 py-3 text-[0.76rem] leading-none font-semibold tracking-[0.08em] uppercase transition-colors duration-300";

/**
 * A title in the free library, as in the Literature Series design: cover, title, author, year and one
 * button. Readable titles (their PDF is in books/) open the online reader; the rest offer a copy by
 * request until their online edition is added.
 */
export function BookCard({ book, readable = false }: { book: Book; readable?: boolean }) {
  const href = readable ? `/read/${book.slug}` : `/contact?enquiry=books&book=${book.slug}`;
  return (
    <article data-reveal className="group flex h-full flex-col">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="flex aspect-[2/3] items-end">
        <BookCover book={book} className="book-tilt w-full" />
      </Link>
      <h3 className="mt-4 font-display text-[1.1rem] leading-snug text-ink transition-colors group-hover:text-bronze">{book.title}</h3>
      <p className="text-sm text-muted">{book.author}</p>
      {book.year && <p className="text-sm text-muted">{book.year}</p>}
      {!readable && <p className="mt-1 text-xs text-muted">Online edition coming soon</p>}
      <div className="mt-auto pt-4">
        <Link
          href={href}
          className={`${button} bg-bronze text-white hover:bg-bronze-dark`}
          aria-label={`${readable ? "Read free" : "Request a copy of"} ${book.title}`}
        >
          {readable ? "Read Free" : "Request a Copy"}
        </Link>
      </div>
    </article>
  );
}

/** A forthcoming title: small cover beside its details and a "Coming soon" label. */
export function ForthcomingCard({ book, readable = false }: { book: Book; readable?: boolean }) {
  return (
    <article data-reveal className="flex items-end gap-3">
      <div className="w-[44%] max-w-28 shrink-0">
        <BookCover book={book} className="w-full" />
      </div>
      <div className="min-w-0 pb-1">
        <h3 className="font-display text-[1rem] leading-tight text-ink">{book.title}</h3>
        <p className="mt-1 text-[0.7rem] leading-snug text-muted">{book.author}</p>
        <p className="text-[0.7rem] text-bronze">Coming {book.year ?? "soon"}</p>
        {readable ? (
          <Link href={`/read/${book.slug}`} className={`mt-3 ${button} bg-bronze px-3 text-white hover:bg-bronze-dark`}>
            Read Free
          </Link>
        ) : (
          <span className={`mt-3 ${button} border border-bronze/70 px-2! py-2.5! text-[0.66rem]! whitespace-nowrap text-bronze`}>Coming Soon</span>
        )}
      </div>
    </article>
  );
}
