import Link from "next/link";
import { getBook } from "@/lib/books";
import { BookCover } from "./book-cover";
import { type CmfEvent, eventDateParts } from "@/lib/work";
import { Icon } from "./icons";
import { SlideIcon } from "./ui";

// Event card from the Our Work design: a picture panel with a date chip, then title, place and a
// register-interest button.
export function EventCard({ event }: { event: CmfEvent }) {
  const { month, day, year } = eventDateParts(event.date);
  const book = event.book ? getBook(event.book) : undefined;
  const href = `/contact?enquiry=events&event=${encodeURIComponent(event.title)}`;
  return (
    <article data-reveal className="tile group flex flex-col p-3 transition-shadow duration-500 hover:shadow-[0_24px_50px_-30px_rgba(12,31,66,0.45)]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] bg-gradient-to-br from-blush via-sand to-parchment">
        {book && (
          <div className="absolute top-5 right-6 bottom-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
            <BookCover book={book} className="h-[115%] w-auto rotate-3" />
          </div>
        )}
        <p className="absolute top-3 left-3 bg-white/95 px-3 py-2 text-center leading-none text-ink shadow-[0_8px_20px_-14px_rgba(12,31,66,0.5)]">
          <span className="block text-[0.7rem] font-semibold tracking-[0.12em]">{month}</span>
          {day && <span className="mt-1 block font-display text-2xl">{day}</span>}
          <span className="mt-1 block text-[0.7rem] text-muted">{year}</span>
        </p>
      </div>
      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <h3 className="font-display text-xl leading-snug text-ink">{event.title}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted">
          <Icon name={event.online ? "youtube" : "pin"} className="size-4 text-bronze" strokeWidth={1.6} /> {event.location}
        </p>
        <div className="mt-auto pt-5">
          <Link
            href={href}
            className="group/btn inline-flex items-center gap-3 rounded-[3px] border border-bronze px-4 py-2.5 text-[0.75rem] leading-none font-semibold tracking-[0.08em] text-bronze uppercase transition-colors duration-300 hover:bg-bronze hover:text-white"
          >
            Register Interest
            <SlideIcon name="arrow" />
          </Link>
        </div>
      </div>
    </article>
  );
}
