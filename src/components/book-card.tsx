import Link from "next/link";
import type { Book } from "@/lib/books";
import { BookCover } from "./book-cover";
import { CircleArrow } from "./ui";

/**
 * Three states: readable (its PDF is in books/) opens the online reader; an available title without
 * its PDF yet offers a copy by request; forthcoming titles are display-only.
 */
export function BookCard({ book, readable = false }: { book: Book; readable?: boolean }) {
  const forthcoming = book.collection === "forthcoming" && !readable;
  const href = readable ? `/read/${book.slug}` : `/contact?enquiry=books&book=${book.slug}`;
  const action = readable ? "Read online — free" : forthcoming ? `Coming ${book.year ?? "soon"}` : "Online edition coming soon";

  const body = (
    <>
      <div className="relative flex justify-center rounded-xl bg-cream px-8 py-7">
        <BookCover book={book} className="w-full max-w-44" />
        {readable && <span className="absolute top-3 left-3 rounded-full bg-bronze px-2.5 py-1 text-[0.7rem] font-medium tracking-wide text-white uppercase">Read free</span>}
      </div>
      <div className="flex flex-1 flex-col px-1 pt-4 pb-1">
        <p className="text-xs text-bronze">
          {"//"}
          {book.year ?? (book.collection === "founder" ? "Founder's Library" : "CMF Literature Series")}
        </p>
        <h3 className="display-sm mt-1 text-2xl">{book.title}</h3>
        <p className="mt-1 text-sm text-muted">{book.author}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-sm text-ink">
          <span>
            {action}
            {!readable && !forthcoming && <span className="block text-xs text-muted">Request a printed copy</span>}
          </span>
          {!forthcoming && <CircleArrow className="size-8" tone={readable ? "primary" : "dark"} />}
        </div>
      </div>
    </>
  );

  if (forthcoming) return <article className="tile flex flex-col p-3">{body}</article>;
  return (
    <article>
      <Link href={href} className="group tile flex h-full flex-col p-3 transition-shadow hover:shadow-lg">
        {body}
      </Link>
    </article>
  );
}
