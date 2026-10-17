import Link from "next/link";
import { getBook } from "@/lib/books";
import { BookCover } from "./book-cover";
import { type CmfEvent, eventDateParts } from "@/lib/work";
import { Icon } from "./icons";

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
    <article>
      <Link href={`/contact?enquiry=events&event=${encodeURIComponent(event.title)}`} className="group block">
        <div className={`relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-2xl p-6 ${tones[index % tones.length]}`}>
          <span className="flex items-center gap-2 text-sm">
            <Icon name={event.online ? "youtube" : "pin"} className="size-4" /> {event.location}
          </span>
          {book && (
            <div className="absolute right-8 -bottom-6 w-[28%] rotate-6 transition-transform group-hover:rotate-2">
              <BookCover book={book} />
            </div>
          )}
          <p className="relative z-10 font-display text-[clamp(5rem,10vw,8rem)] leading-[0.8]">
            {day ?? month}
            <span className="ml-3 align-top text-[0.35em]">{day ? month : "TBC"}</span>
          </p>
        </div>
        <div className="mt-5 flex flex-col-reverse items-start justify-between gap-3 sm:flex-row">
          <h3 className="display-sm max-w-xs text-2xl group-hover:text-bronze">{event.title}</h3>
          <span className="shrink-0 rounded-full border border-line px-4 py-1.5 text-sm text-ink">{fullDate(event.date)}</span>
        </div>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted group-hover:text-bronze">
          Register interest <Icon name="arrow" className="size-4" />
        </p>
      </Link>
    </article>
  );
}
