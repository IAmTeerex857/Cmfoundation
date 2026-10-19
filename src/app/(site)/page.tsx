import Image from "next/image";
import Link from "next/link";
import { BookCover } from "@/components/book-cover";
import { EventCard } from "@/components/event-card";
import { HeroRotator, type HeroSlide } from "@/components/hero-rotator";
import { SplitWords } from "@/components/motion/split-words";
import { QuoteSlider } from "@/components/quote-slider";
import {
  Button,
  CircleArrow,
  Faq,
  IconList,
  ImageCard,
  ImageCta,
  Marquee,
  NestedFrame,
  ReadMore,
  SectionHead,
  Split,
  Statement,
  StatTiles,
  Stats,
} from "@/components/ui";
import { availableBooks, books, forthcomingBooks, getBook } from "@/lib/books";
import { faqs } from "@/lib/faqs";
import { quotes } from "@/lib/founder";
import { readableSlugs } from "@/lib/manuscripts";
import { giveHref } from "@/lib/payment-links";
import { pillars, upcomingEvents } from "@/lib/work";

export const revalidate = 86400;

// Home hero photos. The two frames rotate through this set; add a photo here to include it.
const heroSlides: HeroSlide[] = [
  { src: "/images/students-reading.jpg", alt: "Three students reading a book together in a library", caption: "Books that open young minds." },
  { src: "/images/clean-water-handwashing.jpg", alt: "A girl washing her hands at a clean water tap as her mother looks on", caption: "Clean water. Brighter futures." },
];

const library = ["false-men-and-true-christians", "exploring-the-godhead", "the-criminal-in-heaven"].map((s) => getBook(s)!);

export default function Home() {
  const events = upcomingEvents().slice(0, 2);
  const readable = readableSlugs();
  const give = giveHref();

  return (
    <>
      {/* Hero (Altruva) */}
      <section className="relative overflow-hidden bg-sand">
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 right-[-10%] size-[40rem] rounded-full bg-gold/15 blur-3xl" />
        <div className="wrap relative grid gap-10 pt-8 pb-14 lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:pb-12">
          <div className="flex flex-col justify-center lg:py-12">
            <p data-reveal="fade" className="eyebrow">
              Ideas. People. Communities.
            </p>
            <h1 data-reveal="words" className="display-xl mt-5">
              <SplitWords>Knowledge changes lives. A better tomorrow is possible.</SplitWords>
            </h1>
            <p data-reveal data-reveal-delay="450" className="lede mt-7 max-w-lg">
              The Chinwoke Mbadinuju Foundation advances Christian literature, education and community development while preserving a legacy of faith,
              knowledge and service.
            </p>
            <div data-reveal data-reveal-delay="580" className="mt-9 flex flex-wrap gap-4">
              <Button href={give}>Donate Now</Button>
              <Button href="/literature" variant="outline">
                Explore Our Books
              </Button>
            </div>
            <div data-reveal data-reveal-delay="700" className="group mt-14 flex items-center gap-4 lg:mt-auto lg:pt-20">
              <div className="flex -space-x-3 transition-all duration-500 group-hover:space-x-1">
                {["/images/founder-portrait.jpg", "/images/founder-bowler.jpg", "/images/founder-barrister.jpg"].map((src) => (
                  <span key={src} className="relative size-12 overflow-hidden rounded-full ring-2 ring-sand transition-transform duration-500 hover:-translate-y-1">
                    <Image src={src} alt="" fill sizes="48px" className="object-cover object-top" />
                  </span>
                ))}
              </div>
              <div>
                <p className="font-medium text-ink">Founded in 2012 by Dr Chinwoke Clement Mbadinuju</p>
                <p className="text-sm text-muted">Ideas. People. Communities. A better tomorrow.</p>
              </div>
            </div>
          </div>
          <HeroRotator slides={heroSlides} />
        </div>
      </section>

      <Marquee items={["Literature", "Education", "Community", "Legacy", "Faith", "Knowledge", "Service"]} />

      {/* Statement + pillars (RiseUp) */}
      <section className="py-24">
        <div className="wrap">
          <Statement highlight="Ideas. People. Communities. A Better Tomorrow.">
            The Chinwoke Mbadinuju Foundation is committed to preserving a legacy of faith, knowledge and service through free Christian literature, education
            and practical community projects that help people and families thrive.
          </Statement>
          <div className="mt-14">
            <IconList items={pillars.map((p) => ({ icon: p.icon, title: p.title, body: p.body }))} />
          </div>
        </div>
      </section>

      {/* Who we are (Altruva) */}
      <section className="pb-24">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div data-reveal="clip" className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <div data-parallax="0.07" className="absolute inset-0">
              <Image src="/images/founder-smiling.jpg" alt="Dr Chinwoke Clement Mbadinuju" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-top" />
            </div>
          </div>
          <div>
            <h2 data-reveal="words" className="display-lg">
              <SplitWords>Who we are</SplitWords>
            </h2>
            <p data-reveal data-reveal-delay="200" className="lede mt-6 max-w-lg">
              The Chinwoke Mbadinuju Foundation is an independent charitable and intellectual foundation, established in 2012 during the lifetime of Dr
              Chinwoke Clement Mbadinuju: scholar, lawyer, journalist, evangelist, author and Governor of Anambra State.
            </p>
            <p data-reveal data-reveal-delay="300" className="lede mt-4 max-w-lg">
              His passing in 2023 entrusted succeeding generations with the responsibility to continue his work.
            </p>
            <div data-reveal data-reveal-delay="400">
              <Button href="/about" className="mt-8">
                More About Us
              </Button>
            </div>
            <div className="mt-16">
              <Stats
                items={[
                  { value: "2012", label: "Foundation established" },
                  { value: "22", label: "Works by the Founder" },
                  { value: String(books.length), label: "Titles in the Series" },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* What we do (Altruva cards) */}
      <section className="pb-24">
        <div className="wrap">
          <SectionHead title="Communities powered by purpose" aside="Four pillars guide everything we do, from the books we publish to the projects we support." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ImageCard href="/literature" title="Literature">
              <div className="flex h-full items-end justify-center gap-2 px-6 pt-6">
                {library.map((b, i) => (
                  <BookCover
                    key={b.slug}
                    book={b}
                    className={`w-1/3 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      i === 0 ? "group-hover:-translate-x-1 group-hover:-rotate-6" : i === 1 ? "-translate-y-3 group-hover:-translate-y-6" : "group-hover:translate-x-1 group-hover:rotate-6"
                    }`}
                  />
                ))}
              </div>
            </ImageCard>
            <ImageCard href="/our-work#initiatives" title="Education" image="/images/generated/education-reading.jpg" alt="A student reading aloud to her classmates" />
            <ImageCard href="/our-work#initiatives" title="Community" image="/images/generated/community-tree-planting.jpg" alt="Community volunteers planting a tree together" />
            <ImageCard href="/founder" title="Legacy" image="/images/founder-barrister.jpg" alt="Dr Chinwoke Mbadinuju as a young barrister" />
          </div>
        </div>
      </section>

      {/* Founder story (RiseUp nested frames) */}
      <section className="bg-white py-24">
        <div className="wrap space-y-24">
          <Split
            title="A Life of Service, A Lasting Legacy"
            image={<NestedFrame src="/images/founder-portrait.jpg" alt="Dr Chinwoke Clement Mbadinuju, Odera 1 of Uli" position="top" />}
          >
            <p>
              Dr Chinwoke Clement Mbadinuju (1945–2023), Odera 1 of Uli, was a statesman, scholar, author and servant leader. From humble beginnings in Uli
              to universities across the world, from journalism and law to Christian ministry and public office, he lived a remarkable life of purpose.
            </p>
            <ReadMore href="/founder">Explore his life &amp; times</ReadMore>
          </Split>
          <Split
            reverse
            title="Books Freely Given, Knowledge Freely Shared"
            image={<NestedFrame src="/images/founder-bowler.jpg" alt="Early portrait of Dr Chinwoke Mbadinuju" tone="navy" flip position="top" />}
          >
            <p>
              The CMF Literature Series preserves the writings of Dr Mbadinuju and continues his tradition of making Christian and public-interest literature
              freely available. Every book can be read free online, and no donation is required to read.
            </p>
            <ReadMore href="/literature">Visit the free library</ReadMore>
          </Split>
        </div>
      </section>

      {/* Free library (Altruva colour section) */}
      <section className="relative overflow-hidden bg-bronze py-24 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-40 size-[34rem] rounded-full bg-gold/25 blur-3xl" />
        <div className="wrap relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 data-reveal="words" className="display-lg max-w-2xl text-white">
              <SplitWords>Faith for today. Ideas for tomorrow.</SplitWords>
            </h2>
            <p data-reveal data-reveal-delay="250" className="max-w-sm text-white/90">
              Selected works from the CMF Literature Series, freely available to read and share.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {library.map((b, i) => (
              <Link
                key={b.slug}
                href={readable.includes(b.slug) ? `/read/${b.slug}` : "/literature#library"}
                data-reveal
                className={`group flex min-h-[26rem] flex-col rounded-3xl p-6 transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_40px_70px_-35px_rgba(14,33,50,0.7)] ${
                  i === 1 ? "bg-navy" : "bg-sand"
                }`}
              >
                <p className={`text-sm ${i === 1 ? "text-gold" : "text-bronze"}`}>
                  {"//"}
                  {b.year ?? "Founder's Library"}
                </p>
                <h3 className={`display-sm mt-2 text-[1.65rem] ${i === 1 ? "text-white" : ""}`}>{b.title}</h3>
                <p className={`mt-2 ${i === 1 ? "text-white/75" : "text-muted"}`}>{b.author}</p>
                <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                  <CircleArrow className="size-16" />
                  <BookCover book={b} className="w-32 rotate-3 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-3 group-hover:rotate-0" />
                </div>
              </Link>
            ))}
          </div>
          <div data-reveal className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <p className="text-white/90">
              {readable.length > 0
                ? `${readable.length} ${readable.length === 1 ? "title" : "titles"} to read free online now`
                : `${availableBooks.length} titles in the library`}{" "}
              · {forthcomingBooks.length} more coming in 2027
            </p>
            <Button href="/literature" variant="light">
              View all books
            </Button>
          </div>
        </div>
      </section>

      <QuoteSlider quotes={quotes} />

      {/* Milestones (RiseUp stat tiles) */}
      <section className="pt-2.5">
        <div className="px-2.5">
          <StatTiles
            items={[
              { value: "1945", title: "Born in Uli, Anambra State", body: "A disciplined upbringing in a Christian home shaped his values and character." },
              { value: "1999 – 2003", title: "Governor of Anambra State", body: "Focused on security, education, infrastructure, peacebuilding and oil and gas development." },
              { value: "22", title: "Published Works", body: "On Christianity, leadership, law, governance and society, now preserved by the Foundation." },
              { value: "2012", title: "Foundation Established", body: "Created during his lifetime to continue his intellectual, Christian and community work." },
            ]}
          />
        </div>
      </section>

      {/* FAQ (Altruva) */}
      <section className="py-24">
        <div className="wrap">
          <SectionHead center title="Frequently asked questions" aside="About our books, donations, partnerships and the Foundation's work." />
          <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <Faq items={[faqs.books, faqs.secure, faqs.project, faqs.partner, faqs.inKind]} />
            <div data-reveal="scale" className="tile group flex flex-col items-center p-8 text-center">
              <h3 className="display-sm text-2xl">Make a difference today</h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                Whether you give, partner, volunteer or simply encourage us, you are part of a larger story: a more informed, compassionate and
                opportunity-rich society.
              </p>
              <div className="mt-6 flex w-full max-w-sm items-end justify-center gap-3 overflow-hidden rounded-2xl bg-cream px-8 pt-8">
                {library.map((b, i) => (
                  <BookCover
                    key={b.slug}
                    book={b}
                    className="w-1/3 translate-y-2 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1"
                    style={{ transitionDelay: `${i * 70}ms` }}
                  />
                ))}
              </div>
              <Button href="/contact" className="mt-6">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Events (Altruva insights) */}
      {events.length > 0 && (
        <section className="pb-8">
          <div className="wrap">
            <SectionHead center title="Upcoming events" aside="Book presentations and gatherings that bring the mission together." />
            <div className="mt-14 grid gap-8 md:grid-cols-2">
              {events.map((e, i) => (
                <EventCard key={e.title} event={e} index={i} />
              ))}
            </div>
            <div data-reveal className="mt-10 flex justify-end">
              <Button href="/events">See All Events</Button>
            </div>
          </div>
        </section>
      )}

      <ImageCta word="Give" title="A better tomorrow is possible" cta="Give Now" href={give} image="/images/generated/family-support.jpg" position="50% 42%" />
    </>
  );
}
