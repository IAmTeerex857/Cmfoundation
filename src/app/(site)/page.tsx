import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookCover } from "@/components/book-cover";
import { Icon } from "@/components/icons";
import { SplitWords } from "@/components/motion/split-words";
import { Button, IconPillars, PageHero, QuoteBlock } from "@/components/ui";
import { availableBooks, forthcomingBooks, getBook } from "@/lib/books";
import { readableSlugs } from "@/lib/manuscripts";
import { founder, quotes } from "@/lib/founder";
import { pillars } from "@/lib/work";
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
  url: site.url,
  logo: `${site.url}/images/logo-full.png`,
  image: `${site.url}/og-hero.jpg`,
  description: site.description,
  foundingDate: String(site.founded),
  founder: { "@type": "Person", name: founder.name },
  email: site.contact.email,
  telephone: site.contact.phone,
  address: { "@type": "PostalAddress", streetAddress: "Otunba Kayode Close, Asokoro", addressLocality: "Abuja", addressRegion: "FCT", addressCountry: "NG" },
};

// Books that can be read online now come first; the rest of the row is filled from these.
const featuredDefaults = ["false-men-and-true-christians", "exploring-the-godhead", "the-criminal-in-heaven", "the-wages-of-sin", "the-present-truth"];

// Section order follows the Foundation's home page design (../drive_assets/1 CMF Homepage 26.png).
export default function Home() {
  const comingSoon = forthcomingBooks.filter((b) => b.year === 2027).slice(0, 2);
  const readable = readableSlugs();
  const featured = [...availableBooks.filter((b) => readable.includes(b.slug)), ...featuredDefaults.map((s) => getBook(s)!)]
    .filter((b, i, all) => all.findIndex((x) => x.slug === b.slug) === i)
    .slice(0, 5);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />

      <PageHero
        short
        eyebrow="Ideas. People. Communities. A better tomorrow."
        title="Knowledge Changes Lives."
        image={{ src: "/images/students-reading.jpg", alt: "Three students reading a book together in a library", position: "45% center" }}
        actions={
          <>
            <Button href="/literature">Explore Our Books</Button>
            <Button href="/about" variant="outline">
              Learn About CMF
            </Button>
          </>
        }
      >
        <p>{site.description}</p>
      </PageHero>

      {/* Featured books */}
      <section className="pt-12 pb-16 lg:pt-7 lg:pb-16">
        <div className="wrap">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p data-reveal="fade" className="eyebrow">
                Featured books
              </p>
              <h2 data-reveal="words" className="display mt-3 text-[clamp(2.1rem,3.2vw,2.5rem)] leading-[1.08]">
                <SplitWords>Faith for Today. Ideas for Tomorrow.</SplitWords>
              </h2>
            </div>
            <div data-reveal data-reveal-delay="200" className="flex flex-col gap-3 lg:items-end lg:text-right">
              <p className="text-sm leading-relaxed text-muted">
                Free to read and share. Coming in 2027: {comingSoon.map((b) => b.title).join(" and ")}.
              </p>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Button href="/literature#library" variant="outline">
                  View All Books
                </Button>
                <Button href="/literature?collection=forthcoming#library" variant="outline" icon={null}>
                  Forthcoming
                </Button>
              </div>
            </div>
          </div>

          <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-12">
            {featured.map((b, i) => (
              <li key={b.slug} data-reveal data-reveal-delay={String(i * 80)} className="group flex h-full flex-col items-center text-center">
                {/* Covers differ in shape, so each sits on the baseline of the tallest (5:8). */}
                <Link href={`/read/${b.slug}`} className="flex aspect-[5/8] w-full max-w-[9.5rem] items-end" tabIndex={-1} aria-hidden="true">
                  <span className="relative block w-full">
                    <BookCover book={b} className="book-tilt w-full" />
                    {readable.includes(b.slug) && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-[2px] bg-bronze px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.1em] whitespace-nowrap text-white uppercase shadow">
                        Read free
                      </span>
                    )}
                  </span>
                </Link>
                <h3 className="mt-4 font-display text-lg leading-snug text-ink">{b.title}</h3>
                <p className="mb-4 text-sm text-muted">{b.author}</p>
                <Button href={`/read/${b.slug}`} icon={null} className="mt-auto w-full max-w-[9.5rem] px-3!">
                  Read Now
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Four pillars */}
      <section className="border-t border-line bg-paper py-12">
        <div className="wrap">
          <IconPillars items={pillars.map((p) => ({ icon: p.icon, title: p.label, body: p.short }))} />
        </div>
      </section>

      {/* Community work */}
      <PageHero
        as="h2"
        eyebrow="Real people. Real progress."
        title="Lifting Communities. Building Possibilities."
        image={{ src: "/images/clean-water-handwashing.jpg", alt: "A girl washing her hands at a clean water tap as her mother looks on", position: "60% center" }}
        badge={
          <>
            <Icon name="drop" className="size-6 text-ink" strokeWidth={1.6} />
            <span>
              <span className="block text-[0.72rem] font-semibold tracking-[0.12em] text-ink uppercase">Clean water. Brighter futures.</span>
              <span className="block text-xs text-muted">A CMF Community Project</span>
            </span>
          </>
        }
        actions={<Button href="/our-work">See Our Work</Button>}
      >
        <p>
          From education and scholarships to community projects and the free distribution of Christian literature, we support initiatives that create
          opportunity and lasting impact.
        </p>
      </PageHero>

      {/* About the founder */}
      <section className="overflow-hidden border-t border-line bg-paper">
        <div className="grid lg:grid-cols-[0.95fr_1.25fr_0.9fr]">
          <div data-reveal="fade" className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[26rem]">
            <Image
              src="/images/founder/red-cap-portrait.jpg"
              alt="Dr Chinwoke Clement Mbadinuju wearing a red cap"
              fill
              sizes="(min-width: 1024px) 32vw, 100vw"
              className="object-cover object-top"
            />
          </div>
          <div className="px-5 py-14 sm:px-8 lg:py-16 lg:pr-10 lg:pl-12">
            <p data-reveal="fade" className="eyebrow">
              About the founder
            </p>
            <h2 data-reveal="words" className="display-lg mt-3">
              <SplitWords>A Life of Service. A Lasting Legacy.</SplitWords>
            </h2>
            <p data-reveal data-reveal-delay="200" className="mt-5 max-w-xl leading-relaxed text-body">
              {founder.name} was a statesman, scholar, author and servant leader whose life continues to inspire generations. The Foundation carries
              forward his passion for faith, knowledge and community.
            </p>
            <div data-reveal data-reveal-delay="300">
              <Button href="/founder" variant="outline" className="mt-8">
                Explore His Life &amp; Times
              </Button>
            </div>
          </div>
          <div className="flex items-center px-5 pb-14 sm:px-8 lg:py-16 lg:pr-[max(2rem,calc((100vw-1140px)/2))] lg:pl-0">
            <div className="lg:border-l lg:border-bronze/40 lg:pl-10">
              <QuoteBlock text={quotes[0].text} by={quotes[0].by} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
