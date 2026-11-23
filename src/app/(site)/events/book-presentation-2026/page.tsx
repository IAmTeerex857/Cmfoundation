import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookCover } from "@/components/book-cover";
import { StatusBadge } from "@/components/books/status-badge";
import { Icon } from "@/components/icons";
import { Button, GoldRule } from "@/components/ui";
import { bookHref, bookStatus, launchBooks } from "@/lib/books";
import { readableSlugs } from "@/lib/manuscripts";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

// The landing page for the 24 November 2026 presentation (instructions §12, Phase One #10). Printed
// QR codes and shared posts point here through short links with campaign tracking (/qr, /wa, /li).

const DATE = "2026-11-24";

export const metadata: Metadata = pageMetadata({
  title: "Book Presentation & Signing, 24 November 2026",
  description:
    "The Remembrance Series: the presentation and signing of A Trilogy on God, Life and Grace by Cheta C. Mbadinuju, at the Shehu Musa Yar'Adua Centre, Abuja, on Tuesday 24 November 2026, 11:00 a.m. to 4:00 p.m.",
  path: "/events/book-presentation-2026",
});

// Venue, time and RSVP contacts as printed on the invitation card (response of 23 November 2026, Part A, §1).
const VENUE = { room: "The Meeting Room", building: "Shehu Musa Yar'Adua Centre", area: "Central Business District, Abuja" };
const rsvp = [
  { name: "Mr Martins", phone: "0818 900 1313" },
  { name: "Ms Joy", phone: "0706 480 8664" },
  { name: "Mr Adams", phone: "0806 980 6901" },
  { name: "CMF Office", phone: "0815 675 2002" },
];
const tel = (phone: string) => `tel:+234${phone.replace(/\s/g, "").slice(1)}`;

const event = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Book Presentation & Signing: A Trilogy on God, Life and Grace",
  description: "The Remembrance Series. The presentation and signing of The Wages of Sin, Exploring the Godhead and A Criminal in Heaven by Cheta C. Mbadinuju.",
  startDate: `${DATE}T11:00:00+01:00`,
  endDate: `${DATE}T16:00:00+01:00`,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  image: `${site.url}/images/events/book-presentation-2026-invitation.jpg`,
  location: {
    "@type": "Place",
    name: `${VENUE.room}, ${VENUE.building}`,
    address: { "@type": "PostalAddress", streetAddress: VENUE.building, addressLocality: "Central Business District, Abuja", addressRegion: "FCT", addressCountry: "NG" },
  },
  organizer: { "@type": "Organization", name: site.name, url: site.url },
  isAccessibleForFree: true,
};

const label = "text-xs font-semibold tracking-[0.12em] text-muted uppercase";

export default function BookPresentation() {
  const readable = readableSlugs();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(event).replace(/</g, "\\u003c") }} />
      <section className="bg-gradient-to-r from-[#fcf5ea] via-blush to-blush py-14 lg:py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <p className="eyebrow">The Remembrance Series · Tuesday 24 November 2026</p>
            <h1 className="display-xl mt-4 lg:text-[clamp(2.6rem,4vw,3.6rem)]">Book Presentation &amp; Signing</h1>
            <p className="mt-3 font-display text-[1.3rem] text-ink italic">A Trilogy on God, Life and Grace, by Cheta C. Mbadinuju</p>
            <GoldRule className="mt-7" />
            <p className="mt-6 max-w-xl text-[1.08rem] leading-relaxed text-body">
              The Chinwoke Mbadinuju Foundation presents <em>The Wages of Sin</em>, <em>Exploring the Godhead</em> and <em>A Criminal in Heaven</em>. The
              day also opens the Foundation&rsquo;s free online library: five books can now be read in full, free of charge, on this website, two by our
              founder, Dr Chinwoke C. Mbadinuju, and three by Cheta C. Mbadinuju.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#details">Venue &amp; RSVP</Button>
              <Button href="/literature#library" variant="outline">
                Explore the Free Library
              </Button>
            </div>
          </div>
          <a
            href="/images/events/book-presentation-2026-invitation.jpg"
            className="block overflow-hidden rounded-[3px] shadow-[0_30px_60px_-30px_rgba(12,31,66,0.55)] ring-1 ring-line"
            aria-label="Open the invitation card in full size"
          >
            <Image
              src="/images/events/book-presentation-2026-invitation.jpg"
              alt="Invitation card: The Remembrance Series. Book Presentation and Signing, A Trilogy on God, Life and Grace by Cheta C. Mbadinuju. Tuesday 24 November 2026, 11:00 a.m. to 4:00 p.m., The Meeting Room, Shehu Musa Yar'Adua Centre, CBD, Abuja."
              width={1260}
              height={1007}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full"
            />
          </a>
        </div>
      </section>

      <section id="details" className="scroll-mt-24 border-b border-line py-14 lg:py-16">
        <div className="wrap grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex gap-4">
            <Icon name="calendar" className="size-6 shrink-0 text-bronze" strokeWidth={1.5} />
            <div>
              <p className={label}>Date</p>
              <p className="mt-1 text-ink">Tuesday 24 November 2026</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Icon name="clock" className="size-6 shrink-0 text-bronze" strokeWidth={1.5} />
            <div>
              <p className={label}>Time</p>
              <p className="mt-1 text-ink">11:00 a.m. – 4:00 p.m.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Icon name="pin" className="size-6 shrink-0 text-bronze" strokeWidth={1.5} />
            <div>
              <p className={label}>Venue</p>
              <p className="mt-1 text-ink">
                {VENUE.room}, {VENUE.building}, {VENUE.area}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Icon name="phone" className="size-6 shrink-0 text-bronze" strokeWidth={1.5} />
            <div>
              <p className={label}>RSVP</p>
              <ul className="mt-1 space-y-0.5 text-ink">
                {rsvp.map((r) => (
                  <li key={r.phone}>
                    {r.name}:{" "}
                    <a href={tel(r.phone)} className="text-bronze tabular-nums hover:underline">
                      {r.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="wrap">
          <p className="eyebrow">Now free to read online</p>
          <h2 className="display-lg mt-3">Five Books, Free to All</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-body">No account, payment or download is needed. Open a book&rsquo;s page to read it, listen when audiobooks arrive, or order printed copies for your organisation.</p>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {launchBooks.map((b) => (
              <li key={b.slug}>
                <Link href={bookHref(b.slug)} className="group block">
                  <BookCover book={b} className="book-tilt w-full" />
                  <span className="mt-3 block font-display text-[1.05rem] leading-snug text-ink group-hover:text-bronze">{b.title}</span>
                </Link>
                <p className="text-sm text-muted">{b.author}</p>
                <StatusBadge status={bookStatus(b, readable.includes(b.slug))} book={b} className="mt-2" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-blush py-14">
        <div className="wrap grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <h2 className="display-md">Printed copies for your institution</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-body">
              Schools, churches, libraries and organisations can order institutional and commemorative copies of any of the five books.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button href="/books/order">Order Copies</Button>
            <Button href="/reader/register?next=/literature" variant="outline">
              Free Reader Account
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
