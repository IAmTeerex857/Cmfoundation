import type { Metadata } from "next";
import Image from "next/image";
import { SplitWords } from "@/components/motion/split-words";
import { QuoteSlider } from "@/components/quote-slider";
import { Button, NestedFrame, NumberedCards, ReadMore, SectionHead, Split, StatTiles, Statement } from "@/components/ui";
import { chapters, founder, gallery, quotes, timeline } from "@/lib/founder";

export const metadata: Metadata = {
  title: "The Founder",
  description: `${founder.name}, ${founder.title} (${founder.born} – ${founder.died}). ${founder.summary}`,
};

export default function FounderPage() {
  const founderQuotes = quotes.filter((q) => q.role === "Founder");

  return (
    <>
      {/* Hero: RiseUp-style full photo with overlay */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div data-reveal="fade" className="absolute inset-y-0 right-0 -z-10 w-full overflow-hidden lg:w-[55%]">
          <div data-parallax="0.08" className="absolute inset-0">
            <Image src="/images/founder-smiling.jpg" alt="" fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover object-top" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/10 lg:bg-gradient-to-r lg:from-navy lg:via-navy/30 lg:to-transparent" />
        </div>
        <div className="wrap flex min-h-[38rem] flex-col justify-end pt-48 pb-16 lg:min-h-[44rem] lg:pt-24">
          <p data-reveal="fade" className="flex items-center gap-3 text-lg">
            <span className="flex size-10 animate-[spin_14s_linear_infinite] items-center justify-center rounded-full bg-navy-soft text-gold motion-reduce:animate-none">★</span>
            {founder.title} · {founder.born} – {founder.died}
          </p>
          <h1 data-reveal="words" className="mt-6 max-w-2xl font-display text-[clamp(2.6rem,5.6vw,4.4rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-balance">
            <SplitWords>{founder.name}</SplitWords>
          </h1>
          <ul className="mt-6 flex max-w-xl flex-wrap gap-2">
            {founder.roles.map((r) => (
              <li key={r} data-reveal="scale" className="rounded-full border border-white/30 px-3.5 py-1 text-sm transition-colors duration-300 hover:border-gold hover:text-gold">
                {r}
              </li>
            ))}
          </ul>
          <div data-reveal data-reveal-delay="300" className="mt-10 flex flex-wrap gap-4">
            <Button href="#journey" icon="arrowDown">
              His Life &amp; Times
            </Button>
            <Button href="/literature#library" variant="light">
              Read His Books
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="wrap">
          <Statement highlight="Many chapters. One conviction.">{founder.summary}</Statement>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="wrap space-y-24">
          <Split title="A Life Well Lived" image={<NestedFrame src="/images/founder-barrister.jpg" alt="Dr Chinwoke Mbadinuju in barrister's wig and gown" position="50% 20%" />}>
            <p>
              Dr Chinwoke Clement Mbadinuju&rsquo;s life spanned continents and callings, yet it was held together by a consistent conviction: that
              knowledge, influence and opportunity must be used to serve God and humanity.
            </p>
            <p className="font-medium text-ink">&ldquo;Be faithful in the use of what God has entrusted to you.&rdquo;</p>
          </Split>
          <Split
            reverse
            title="More Than a Memory"
            image={<NestedFrame src="/images/founder-portrait.jpg" alt="Dr Chinwoke Mbadinuju, Odera 1 of Uli" tone="navy" flip position="top" />}
          >
            <p>
              His life left a legacy in ideas, institutions, books, people and communities. The Foundation he established in 2012 continues that work, so that
              future generations may be informed, encouraged and equipped to make a positive difference.
            </p>
            <ReadMore href="/about">The continuing legacy</ReadMore>
          </Split>
        </div>
      </section>

      <section id="journey" className="scroll-mt-24 pt-24">
        <div className="wrap">
          <SectionHead title="A life of purpose" aside="From Uli to universities across the world, and back home to public service." />
        </div>
        <div className="mt-12 space-y-2.5 px-2.5">
          <StatTiles items={timeline.slice(0, 4).map((t) => ({ value: t.period, title: t.title, body: t.body }))} />
          <div className="grid gap-2.5 md:grid-cols-3">
            {timeline.slice(4).map((t, i) => (
              <div
                key={t.period}
                data-reveal
                className={`group flex min-h-72 flex-col p-7 transition-[border-radius] duration-500 hover:rounded-3xl ${["bg-navy text-white", "bg-bronze text-white", "bg-sand text-ink"][i]}`}
              >
                <p className="tabular-nums">{t.period}</p>
                <h3 className="mt-auto font-display text-2xl leading-snug font-semibold tracking-[-0.02em] transition-transform duration-500 group-hover:-translate-y-1">{t.title}</h3>
                <p className={`mt-4 text-[0.95rem] leading-relaxed ${i < 2 ? "text-white/85" : "text-body"}`}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="wrap">
          <SectionHead title="The defining chapters" />
          <div className="mt-12">
            <NumberedCards items={chapters.map((c) => ({ title: c.title, body: c.body }))} />
          </div>
        </div>
      </section>

      <section id="gallery" className="pb-24">
        <div className="wrap">
          <SectionHead title="Photo gallery" aside="A visual journey through the life and times of Dr Chinwoke Clement Mbadinuju." />
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {gallery.map((g) => (
              <figure
                key={g.src}
                data-reveal
                className="tile group p-3 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-28px_rgba(14,33,50,0.5)]"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover object-top grayscale-[35%] transition-[transform,filter] duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <figcaption className="display-sm px-1 pt-4 pb-1 text-lg">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <QuoteSlider quotes={founderQuotes} />
    </>
  );
}
