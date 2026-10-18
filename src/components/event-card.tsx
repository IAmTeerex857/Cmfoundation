import Link from "next/link";
import { getBook } from "@/lib/books";
import { BookCover } from "./book-cover";
import { type CmfEvent, eventDateParts } from "@/lib/work";
import { Icon } from "./icons";
import { SlideIcon } from "./ui";

function fullDate(date: string) {
  const { month, day, year } = eventDateParts(date);
  const m = month.charAt(0) + month.slice(1).toLowerCase();
  return day ? `${Number(day)} ${m} ${year}` : `${m} ${year}`;
}

export function EventCard({ event, index = 0 }: { event: CmfEvent; index?: number }) {
  const { month, day } = eventDateParts(event.date);
  const tones = ["bg-navy text-white", "bg-bronze text-white", "bg-navy-soft text-white"];
  const book = event.book ? getBook(event.book) : undefined;
  return (
    <article data-reveal>
      <Link href={`/contact?enquiry=events&event=${encodeURIComponent(event.title)}`} className="group block">
        <div className={`relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-3xl p-6 transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_30px_60px_-30px_rgba(14,33,50,0.6)] ${tones[index % tones.length]}`}>
          <span className="flex items-center gap-2 text-sm">
            <Icon name={event.online ? "youtube" : "pin"} className="size-4" /> {event.location}
          </span>
          {book && (
            <div className="absolute right-8 -bottom-6 w-[28%] rotate-6 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-4 group-hover:rotate-0">
              <BookCover book={book} />
            </div>
          )}
          <p className="relative z-10 font-display text-[clamp(4.5rem,9vw,7rem)] leading-[0.85] font-semibold tracking-[-0.06em]">
            {day ?? month}
            <span className="ml-3 align-top text-[0.3em] tracking-[-0.02em]">{day ? month : "TBC"}</span>
          </p>
        </div>
        <div className="mt-5 flex flex-col-reverse items-start justify-between gap-3 sm:flex-row">
          <h3 className="display-sm max-w-xs text-xl transition-colors group-hover:text-bronze">{event.title}</h3>
          <span className="shrink-0 rounded-full border border-line px-4 py-1.5 text-sm text-ink">{fullDate(event.date)}</span>
        </div>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted group-hover:text-bronze">
          Register interest <SlideIcon name="arrow" />
        </p>
      </Link>
    </article>
  );
}
