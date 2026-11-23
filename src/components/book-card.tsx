import Link from "next/link";
import { type Book, type BookStatus, bookHref, bookStatus } from "@/lib/books";
import { BookCover } from "./book-cover";
import { StatusBadge } from "./books/status-badge";
import { SlideIcon } from "./ui";

/**
 * The one action under a title: "Read free" straight into the reader for readable books, otherwise
 * "Details" for the book's page. Readable books carry no separate badge, so the label never repeats.
 */
export function BookAction({ book, status, className = "" }: { book: Book; status: BookStatus; className?: string }) {
  const readable = status === "read-free";
  return (
    <Link
      href={readable ? `/read/${book.slug}` : bookHref(book.slug)}
      aria-label={readable ? `Read ${book.title} free online` : `${book.title}: book details`}
      className={`group inline-flex items-center gap-2 border-b pb-1 text-[0.76rem] leading-none font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${
        readable ? "border-bronze/40 text-bronze hover:border-bronze hover:text-bronze-dark" : "border-line text-muted hover:border-ink hover:text-ink"
      } ${className}`}
    >
      {readable ? "Read free" : "Details"}
      <SlideIcon name="arrow" className="size-3.5" />
    </Link>
  );
}

/**
 * A title in the free library: cover, status (only when it cannot be read yet), title, author and
 * year. The cover and title open the book's own page (instructions §5.2).
 */
export function BookCard({ book, readable = false }: { book: Book; readable?: boolean }) {
  const status = bookStatus(book, readable);
  const href = bookHref(book.slug);
  return (
    <article data-reveal className="group flex h-full flex-col">
      <Link href={href} className="relative flex aspect-[5/8] items-end" aria-label={`${book.title}: book details`}>
        <BookCover book={book} className="book-tilt w-full" />
      </Link>
      {status !== "read-free" && <StatusBadge status={status} book={book} className="mt-3 self-start" />}
      <h3 className={`${status === "read-free" ? "mt-4" : "mt-2"} font-display text-[1.15rem] leading-snug text-ink`}>
        <Link href={href} className="transition-colors group-hover:text-bronze">
          {book.title}
        </Link>
      </h3>
      <p className="mt-0.5 text-[0.92rem] text-body">{book.author}</p>
      {book.year && <p className="text-sm text-muted">{book.collection === "forthcoming" ? `Expected ${book.release?.label ?? book.year}` : book.year}</p>}
      <div className="mt-auto pt-4">
        <BookAction book={book} status={status} />
      </div>
    </article>
  );
}
