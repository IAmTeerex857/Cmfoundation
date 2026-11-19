import Link from "next/link";
import { type Book, bookHref, bookStatus } from "@/lib/books";
import { BookCover } from "./book-cover";
import { StatusBadge } from "./books/status-badge";

const button =
  "flex w-full items-center justify-center rounded-[3px] px-3 py-3 text-[0.76rem] leading-none font-semibold tracking-[0.08em] uppercase transition-colors duration-300";

/**
 * A title in the free library: cover, status, title, author and year. The cover and title open the
 * book's own page (instructions §5.2); "Read Free" goes straight into the reader for readable titles.
 */
export function BookCard({ book, readable = false }: { book: Book; readable?: boolean }) {
  const status = bookStatus(book, readable);
  const href = bookHref(book.slug);
  return (
    <article data-reveal className="group flex h-full flex-col">
      <Link href={href} className="relative flex aspect-[5/8] items-end" aria-label={`${book.title}: book details`}>
        <BookCover book={book} className="book-tilt w-full" />
      </Link>
      <StatusBadge status={status} className="mt-3 self-start" />
      <h3 className="mt-2 font-display text-[1.15rem] leading-snug text-ink">
        <Link href={href} className="transition-colors group-hover:text-bronze">
          {book.title}
        </Link>
      </h3>
      <p className="mt-0.5 text-[0.92rem] text-body">{book.author}</p>
      {book.year && <p className="text-sm text-muted">{book.collection === "forthcoming" ? `Expected ${book.year}` : book.year}</p>}
      <div className="mt-auto pt-4">
        {status === "read-free" ? (
          <Link href={`/read/${book.slug}`} className={`${button} bg-bronze text-white hover:bg-bronze-dark`} aria-label={`Read ${book.title} free online`}>
            Read Free
          </Link>
        ) : (
          <Link href={href} className={`${button} border border-bronze text-bronze hover:bg-bronze hover:text-white`} aria-label={`${book.title}: book details`}>
            Details
          </Link>
        )}
      </div>
    </article>
  );
}
