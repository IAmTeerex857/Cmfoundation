import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookCover } from "@/components/book-cover";
import { Icon } from "@/components/icons";
import { SplitWords } from "@/components/motion/split-words";
import { Button, GoldRule, IconPillars, PageHero, QuoteBlock } from "@/components/ui";
import { forthcomingBooks, getBook } from "@/lib/books";
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

const featured = ["false-men-and-true-christians", "exploring-the-godhead", "the-criminal-in-heaven"].map((s) => getBook(s)!);

// Section order follows the Foundation's home page design (../drive_assets/1 CMF Homepage 26.png).
export default function Home() {
  const comingSoon = forthcomingBooks.filter((b) => b.year === 2027).slice(0, 2);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />

      <PageHero
        short
        eyebrow="Ideas. People. Communities. A better tomorrow."
        title="Knowledge Changes Lives."
        image={{ src: "/images/students-reading.jpg", alt: "Three students reading a book together in a library", aspect: "aspect-[16/10]" }}
        aside={<QuoteBlock text="A better tomorrow is possible." by={quotes[3].by} />}
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
      <section className="pt-12 pb-16 lg:pt-8 lg:pb-14">
        <div className="wrap grid gap-12 lg:grid-cols-[1.4fr_2fr_0.9fr] lg:gap-10">
          <div>
            <p data-reveal="fade" className="eyebrow">
              Featured books
            </p>
            <h2 data-reveal="words" className="display mt-3 text-[clamp(2.1rem,3.2vw,2.5rem)] leading-[1.08]">
              <SplitWords>Faith for Today. Ideas for Tomorrow.</SplitWords>
            </h2>
            <GoldRule className="mt-6" />
            <p data-reveal data-reveal-delay="200" className="mt-6 max-w-xs text-[1.05rem] leading-relaxed text-body">
              Selected works from the CMF Literature Series, freely available to read and share.
            </p>
            <div data-reveal data-reveal-delay="300">
              <Button href="/literature#library" variant="outline" className="mt-8">
                View All Books
              </Button>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-7">
            {featured.map((b, i) => {
              return (
                <li key={b.slug} data-reveal data-reveal-delay={String(i * 100)} className="group flex h-full flex-col items-center text-center">
                  <Link href={`/read/${b.slug}`} className="block w-full max-w-[10.5rem]" tabIndex={-1} aria-hidden="true">
                    <BookCover book={b} className="book-tilt w-full" />
                  </Link>
                  <h3 className="mt-4 font-display text-lg leading-snug text-ink">{b.title}</h3>
                  <p className="mb-4 text-sm text-muted">{b.author}</p>
                  <Button href={`/read/${b.slug}`} icon={null} className="mt-auto w-full max-w-[10.5rem] px-3!">
                    Read Now
                  </Button>
                </li>
              );
            })}
          </ul>

          <aside data-reveal="fade" data-reveal-delay="300" className="flex flex-col bg-blush p-7 lg:self-start">
            <p className="eyebrow">Coming in 2027</p>
            <GoldRule className="mt-4" />
            <ul className="mt-5 space-y-1 font-display text-xl text-ink">
              {comingSoon.map((b) => (
                <li key={b.slug}>{b.title}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">More titles currently in preparation.</p>
            <Button href="/literature?collection=forthcoming#library" variant="outline" className="mt-6 w-full px-4! leading-snug">
              Forthcoming Books
            </Button>
          </aside>
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
