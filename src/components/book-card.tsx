import Link from "next/link";
import type { Book } from "@/lib/books";
import { BookCover } from "./book-cover";

const button =
  "flex w-full items-center justify-center rounded-[3px] px-3 py-3 text-[0.76rem] leading-none font-semibold tracking-[0.08em] uppercase transition-colors duration-300";

/**
 * A title in the free library, as in the Literature Series design: cover, title, author, year and one
 * button. Published titles open the online reader (which says when an edition is still being
 * prepared); forthcoming titles show when they are coming.
 */
export function BookCard({ book, readable = false }: { book: Book; readable?: boolean }) {
  const forthcoming = book.collection === "forthcoming" && !readable;
  const href = `/read/${book.slug}`;
  const cover = <BookCover book={book} className={forthcoming ? "w-full" : "book-tilt w-full"} />;
  return (
    <article data-reveal className="group flex h-full flex-col">
      {forthcoming ? (
        <div className="relative flex aspect-[2/3] items-end">
          {cover}
          <span className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded-[2px] bg-bronze px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.1em] text-white uppercase shadow">
            Coming {book.year ?? "soon"}
          </span>
        </div>
      ) : (
        <Link href={href} tabIndex={-1} aria-hidden="true" className="flex aspect-[2/3] items-end">
          {cover}
        </Link>
      )}
      <h3 className={`mt-4 font-display text-[1.15rem] leading-snug text-ink ${forthcoming ? "" : "transition-colors group-hover:text-bronze"}`}>{book.title}</h3>
      <p className="mt-0.5 text-[0.92rem] text-body">{book.author}</p>
      {forthcoming ? (
        <p className="text-sm font-medium text-bronze">Coming {book.year ?? "soon"}</p>
      ) : (
        <>
          {book.year && <p className="text-sm text-muted">{book.year}</p>}
        </>
      )}
      <div className="mt-auto pt-4">
        {forthcoming ? (
          <span className={`${button} border border-bronze text-bronze`}>Coming Soon</span>
        ) : (
          <Link
            href={href}
            className={`${button} bg-bronze text-white hover:bg-bronze-dark`}
            aria-label={`Read ${book.title} now`}
          >
            Read Now
          </Link>
        )}
      </div>
    </article>
  );
}
