import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookCover } from "@/components/book-cover";
import { StatusBadge } from "@/components/books/status-badge";
import { Icon } from "@/components/icons";
import { SplitWords } from "@/components/motion/split-words";
import { ArrowLink, Button, GoldRule, PageHero, QuoteBlock, SectionIntro } from "@/components/ui";
import { bookHref, bookStatus, getBook, launchBooks } from "@/lib/books";
import { readableSlugs } from "@/lib/manuscripts";
import { bookQuote, founder } from "@/lib/founder";
import { eventDateParts, upcomingEvents, pillars } from "@/lib/work";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({ description: site.description, path: "/" });

// Structured data for search engines (schema.org), describing the Foundation.
const organization = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: site.name,
  alternateName: site.shortName,
  slogan: site.tagline,
  url: site.url,
  logo: `${site.url}/images/logo-full.png`,
  image: `${site.url}/og-hero.jpg`,
  description: site.description,
  foundingDate: String(site.founded),
  founder: { "@type": "Person", name: founder.name },
  email: site.contact.email,
  telephone: site.contact.phone,
  nonprofitStatus: "Nonprofit",
  address: { "@type": "PostalAddress", streetAddress: "Otunba Kayode Close, Asokoro", addressLocality: "Abuja", addressRegion: "FCT", addressCountry: "NG" },
};

const comingSoon = ["much-ado-about-rapture", "all-is-vanity"].map((s) => getBook(s)!);

// Section order follows the Foundation's instructions (§4.2): headline, the free library, origins
// and mission, the four areas of activity, the founder's literary legacy, the November event,
// voluntary support, then the newsletter in the footer.
export default function Home() {
  const readable = readableSlugs();
  const event = upcomingEvents().find((e) => e.href);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />

      {/* 1. Institutional headline and introduction */}
      <PageHero
        short
        eyebrow={site.tagline}
        title="Knowledge Changes Lives."
        image={{ src: "/images/students-reading.jpg", alt: "Three students reading a book together in a library", position: "45% center" }}
        actions={
          <>
            <Button href="/literature#library">Explore Our Free Library</Button>
            <Button href="/about" variant="outline">
              About the Foundation
            </Button>
          </>
        }
      >
        <p>
          The Chinwoke Mbadinuju Foundation preserves and shares a legacy of faith, knowledge and service through literature, educational assistance and
          practical acts of goodwill.
        </p>
        <p>
          Founded in {site.founded}, the Foundation continues the belief that knowledge should be freely shared and that the opportunities it creates should
          extend beyond the printed page.
        </p>
      </PageHero>

      {/* 2. The free library: the five launch titles, in the Foundation's order */}
      <section className="pt-12 pb-16 lg:pt-10 lg:pb-16">
        <div className="wrap">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">The free library</p>
              <h2 className="display mt-2 text-[clamp(2rem,3vw,2.3rem)] leading-[1.08]">Read Freely. No Account Needed.</h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <p className="text-sm text-muted">
                Coming soon:{" "}
                {comingSoon.map((b, i) => (
                  <span key={b.slug}>
                    {i > 0 && " and "}
                    <Link href={bookHref(b.slug)} className="text-ink underline-offset-2 hover:text-bronze hover:underline">
                      <em>{b.title}</em>
                    </Link>
                  </span>
                ))}
              </p>
              <Button href="/literature#library" variant="outline">
                View All Books
              </Button>
            </div>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-10">
            {launchBooks.map((b) => {
              const status = bookStatus(b, readable.includes(b.slug));
              return (
                <li key={b.slug} className="group flex h-full flex-col items-center text-center">
                  {/* Covers differ in shape, so each sits on the baseline of the tallest (5:8). */}
                  <Link href={bookHref(b.slug)} className="flex aspect-[5/8] w-full max-w-[8.75rem] items-end" aria-label={`${b.title}: book details`}>
                    <span className="relative block w-full">
                      <BookCover book={b} className="book-tilt w-full" />
                      <StatusBadge status={status} className="absolute -top-2.5 left-1/2 -translate-x-1/2 shadow" />
                    </span>
                  </Link>
                  <h3 className="mt-3 font-display text-[1.05rem] leading-snug text-ink">
                    <Link href={bookHref(b.slug)} className="hover:text-bronze">
                      {b.title}
                    </Link>
                  </h3>
                  <p className="mb-3 text-sm text-muted">{b.author}</p>
                  {status === "read-free" ? (
                    <Button href={`/read/${b.slug}`} icon={null} className="mt-auto w-full max-w-[8.75rem] px-3!">
                      Read Free
                    </Button>
                  ) : (
                    <Button href={bookHref(b.slug)} variant="outline" icon={null} className="mt-auto w-full max-w-[8.75rem] px-3!">
                      Details
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 3. Origins and mission */}
      <section className="border-t border-line bg-paper py-14 lg:py-16">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionIntro eyebrow="Our origins" title="From a Writer's Desk to a Life of Giving." />
          <div className="space-y-4 text-[1.05rem] leading-relaxed text-body">
            <p>
              The Foundation was established in {site.founded}, during the lifetime of its founder, His Excellency {founder.name}. It grew from a proposal to
              formalise his longstanding literary work and to direct the resources arising from his publications into the help he was already giving: school
              fees, scholarships, and assistance to individuals and families in need.
            </p>
            <p>
              CMF is an independent, privately established nonprofit foundation. It did not begin as a fundraising organisation, and it continues his practice
              of quiet, practical goodwill alongside the free sharing of his books.
            </p>
            <ArrowLink href="/about">Read the Foundation&rsquo;s story</ArrowLink>
          </div>
        </div>
      </section>

      {/* 4. Areas of activity: literature and education first */}
      <section className="border-t border-line py-14 lg:py-16">
        <div className="wrap">
          <SectionIntro eyebrow="What we do" title="Four Connected Areas of Work" size="md" />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {pillars
              .filter((p) => p.primary)
              .map((p) => (
                <div key={p.title} className="tile flex gap-5 p-7">
                  <Icon name={p.icon} className="size-12 shrink-0 text-bronze" strokeWidth={1.1} />
                  <div>
                    <h3 className="display-sm">{p.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
                    <ArrowLink href={p.href} className="mt-4">
                      {p.cta}
                    </ArrowLink>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {pillars
              .filter((p) => !p.primary)
              .map((p) => (
                <div key={p.title} className="flex gap-4 border-t border-line px-1 pt-5">
                  <Icon name={p.icon} className="size-8 shrink-0 text-bronze" strokeWidth={1.2} />
                  <div>
                    <h3 className="font-display text-xl text-ink">{p.title}</h3>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{p.body}</p>
                  </div>
                </div>
              ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">
            Much of this help is given quietly, in keeping with our founder&rsquo;s conviction: &ldquo;Let not thy left hand know what thy right hand
            doeth&rdquo; (Matthew 6:3). We describe the nature of the work rather than the people it serves.
          </p>
        </div>
      </section>

      {/* 5. The founder and his literary legacy */}
      <section className="overflow-hidden border-t border-line bg-paper">
        <div className="grid lg:grid-cols-[0.95fr_1.25fr_0.9fr]">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[26rem]">
            <Image
              src="/images/founder/red-cap-portrait.jpg"
              alt="Dr Chinwoke Clement Mbadinuju wearing a red cap"
              fill
              sizes="(min-width: 1024px) 32vw, 100vw"
              className="object-cover object-top"
            />
          </div>
          <div className="px-5 py-14 sm:px-8 lg:py-16 lg:pr-10 lg:pl-12">
            <p className="eyebrow">The founder</p>
            <h2 className="display-lg mt-3">
              <SplitWords>A Writer Whose Books Became Help for Others.</SplitWords>
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-body">
              {founder.name} was a scholar, lawyer, evangelist and author of many books on faith, leadership and public life. His writing and his generosity
              were one commitment: what his books earned, he used to keep children in school and to help people in need. The Foundation carries both forward.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/founder" variant="outline">
                His Life &amp; Legacy
              </Button>
              <Button href="/literature?collection=founder#library" variant="ghost">
                His Books
              </Button>
            </div>
          </div>
          <div className="flex items-center px-5 pb-14 sm:px-8 lg:py-16 lg:pr-[max(2rem,calc((100vw-1140px)/2))] lg:pl-0">
            <div className="lg:border-l lg:border-bronze/40 lg:pl-10">
              <QuoteBlock
                text={bookQuote.text}
                by={
                  <>
                    {bookQuote.by}
                    <Link href={bookHref(bookQuote.slug)} className="mt-1 block font-sans text-sm text-muted italic hover:text-bronze">
                      {bookQuote.source}
                    </Link>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Selected milestone: the 24 November presentation */}
      {event && (
        <section className="border-t border-line py-14 lg:py-16">
          <div className="wrap grid items-center gap-8 lg:grid-cols-[auto_1fr_auto] lg:gap-12">
            <p className="w-fit bg-white px-5 py-4 text-center leading-none text-ink ring-1 ring-line">
              <span className="block text-[0.75rem] font-semibold tracking-[0.12em]">{eventDateParts(event.date).month}</span>
              <span className="mt-1 block font-display text-4xl">{eventDateParts(event.date).day}</span>
              <span className="mt-1 block text-[0.75rem] text-muted">{eventDateParts(event.date).year}</span>
            </p>
            <div>
              <p className="eyebrow">Milestone</p>
              <h2 className="display-md mt-2">{event.title}</h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-body">
                {event.location}. The presentation of the CMF Literature Series, with five books now free to read online.
              </p>
            </div>
            <Button href={event.href!}>About the Presentation</Button>
          </div>
        </section>
      )}

      {/* 7. Voluntary support and partnerships */}
      <section className="border-t border-line bg-blush py-14 lg:py-16">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="eyebrow">Support and partnership</p>
            <h2 className="display-lg mt-3">Read Freely. Support Voluntarily.</h2>
            <GoldRule className="mt-6" />
            <p className="mt-5 max-w-2xl leading-relaxed text-body">
              Our publications are made available online without charge. Those who wish to support the Foundation may do so through voluntary
              contributions, book purchases, sponsorships, partnerships and other forms of collaboration.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/support">Ways to Support</Button>
              <Button href="/support#partnerships" variant="outline">
                Institutional Partnerships
              </Button>
            </div>
          </div>
          <p className="font-display text-[clamp(1.6rem,2.6vw,2.1rem)] leading-[1.2] text-bronze italic">
            Uplifting Humanity,
            <br />
            Advancing God&rsquo;s Work.
          </p>
        </div>
      </section>
    </>
  );
}
