import type { Metadata } from "next";
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
  title: "CMF Literature Series & Books Presentation, 24 November 2026",
  description: "The presentation of the CMF Literature Series in Abuja on 24 November 2026, and the opening of the Foundation's free online library with five books.",
  path: "/events/book-presentation-2026",
});

const event = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "CMF Literature Series & Books Presentation",
  startDate: DATE,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: { "@type": "Place", name: "Abuja", address: { "@type": "PostalAddress", addressLocality: "Abuja", addressRegion: "FCT", addressCountry: "NG" } },
  organizer: { "@type": "Organization", name: site.name, url: site.url },
  isAccessibleForFree: true,
};

export default function BookPresentation() {
  const readable = readableSlugs();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }} />
      <section className="bg-gradient-to-r from-[#fcf5ea] via-blush to-blush py-14 lg:py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow">Tuesday 24 November 2026 · Abuja</p>
            <h1 className="display-xl mt-4 lg:text-[clamp(2.6rem,4vw,3.6rem)]">The CMF Literature Series &amp; Books Presentation</h1>
            <GoldRule className="mt-7" />
            <p className="mt-6 max-w-xl text-[1.08rem] leading-relaxed text-body">
              The Chinwoke Mbadinuju Foundation presents its Literature Series and opens its free online library. From today, five books can be read in full,
              free of charge, on this website: two by our founder, Dr Chinwoke C. Mbadinuju, and three by Cheta C. Mbadinuju.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/literature#library">Explore the Free Library</Button>
              <Button href="/contact?enquiry=events&event=CMF%20Literature%20Series%20%26%20Books%20Presentation" variant="outline">
                Enquire About the Event
              </Button>
            </div>
          </div>
          <dl className="tile grid grid-cols-[2.5rem_1fr] gap-x-3 gap-y-5 p-7 text-[0.98rem]">
            <Icon name="calendar" className="size-6 text-bronze" strokeWidth={1.5} />
            <div>
              <dt className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">Date</dt>
              <dd className="text-ink">Tuesday 24 November 2026</dd>
            </div>
            <Icon name="pin" className="size-6 text-bronze" strokeWidth={1.5} />
            <div>
              <dt className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">Place</dt>
              <dd className="text-ink">Abuja, FCT. Venue and time are shared with guests; please contact us for details.</dd>
            </div>
            <Icon name="mail" className="size-6 text-bronze" strokeWidth={1.5} />
            <div>
              <dt className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">Enquiries</dt>
              <dd>
                <a href={`mailto:${site.contact.email}`} className="text-bronze underline">
                  {site.contact.email}
                </a>{" "}
                · {site.contact.phone}
              </dd>
            </div>
          </dl>
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
                <StatusBadge status={bookStatus(b, readable.includes(b.slug))} className="mt-2" />
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
