import type { Metadata } from "next";
import Image from "next/image";
import { SplitWords } from "@/components/motion/split-words";
import { Button, GoldRule, PageHero, QuoteBlock, SectionIntro } from "@/components/ui";
import { chapters, founder, gallery, quotes, timeline } from "@/lib/founder";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "The Founder",
  description: `${founder.name}, ${founder.title} (${founder.born} – ${founder.died}). ${founder.summary}`,
  path: "/founder",
});

// Framed photos for the "Many Chapters" collage: position and tilt on the collage canvas.
const collage = [
  { src: "/images/founder-bowler.jpg", alt: "Early portrait of Dr Chinwoke Mbadinuju in a bowler hat", box: "left-[40%] top-[4%] w-[27%] -rotate-3", position: "50% 30%" },
  { src: "/images/founder-portrait.jpg", alt: "Dr Chinwoke Mbadinuju wearing a red cap and coral beads", box: "left-[70%] top-[8%] w-[28%] rotate-3", position: "50% 20%" },
  { src: "/images/founder-smiling.jpg", alt: "Dr Chinwoke Mbadinuju smiling at a public ceremony", box: "left-[52%] top-[50%] w-[30%] rotate-2", position: "60% 25%" },
];

// Section order follows the Foundation's founder page design (../drive_assets/3 CMF Founder Page 26.png).
export default function FounderPage() {
  const faithful = quotes.find((q) => q.text.startsWith("Be faithful"))!;
  const strip = [...chapters.map((c) => ({ href: `#${c.id}`, label: c.title })), { href: "#legacy", label: "Legacy" }];

  return (
    <>
      <PageHero
        eyebrow="The Founder"
        compact
        title={founder.name}
        image={{ src: "/images/founder-smiling.jpg", alt: "Dr Chinwoke Clement Mbadinuju smiling at a public ceremony", position: "60% 0%" }}
        actions={
          <>
            <Button href="#journey" icon="arrowDown">
              Explore His Life &amp; Times
            </Button>
            <Button href="/literature#library" variant="outline">
              Read His Books
            </Button>
          </>
        }
      >
        <p className="text-[1.3rem] text-ink">
          {founder.title}
          <span aria-hidden="true" className="mx-3 text-bronze">
            |
          </span>
          <span className="whitespace-nowrap">
            {founder.born} – {founder.died}
          </span>
        </p>
        <ul aria-label="Roles" className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] font-semibold tracking-[0.1em] text-ink uppercase">
          {founder.roles.map((r, i) => (
            <li key={r} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="size-1 rounded-full bg-ink/60" />
              )}
              {r}
            </li>
          ))}
        </ul>
        <p>{founder.summary}</p>
      </PageHero>

      {/* Chapter strip */}
      <nav aria-label="Chapters of his life" className="border-y border-line bg-paper">
        <ul className="wrap flex gap-x-7 overflow-x-auto py-4 [scrollbar-width:none] lg:justify-between">
          {strip.map((s) => (
            <li key={s.href} className="shrink-0">
              <a href={s.href} className="text-[0.75rem] font-semibold tracking-[0.06em] whitespace-nowrap text-ink uppercase transition-colors hover:text-bronze">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Many chapters, one conviction */}
      <section className="overflow-hidden bg-gradient-to-r from-blush to-[#f6ead7]">
        <div className="wrap grid items-center gap-10 py-14 lg:grid-cols-[0.75fr_1.6fr] lg:gap-6 lg:py-10">
          <div>
            <SectionIntro eyebrow="A life well lived" title="Many Chapters. One Conviction." size="md">
              <p>
                Dr Chinwoke Clement Mbadinuju&rsquo;s life spanned continents and callings, yet it was held together by a consistent conviction: that
                knowledge, influence and opportunity must be used to serve God and humanity.
              </p>
            </SectionIntro>
            <div data-reveal data-reveal-delay="300">
              <QuoteBlock text={faithful.text} by="Dr Chinwoke Mbadinuju" className="mt-8" />
            </div>
          </div>
          <div className="relative aspect-[16/10]">
            <div data-reveal="fade" className="absolute inset-y-0 left-0 w-[42%] overflow-hidden">
              <Image
                src="/images/founder-barrister.jpg"
                alt="Dr Chinwoke Mbadinuju in barrister's wig and gown"
                fill
                sizes="(min-width: 1024px) 30vw, 45vw"
                className="object-cover object-[50%_15%] sepia-[0.35] [mask-image:linear-gradient(to_right,transparent,#000_18%,#000_82%,transparent)]"
              />
            </div>
            {collage.map((c, i) => (
              <figure
                key={c.src}
                data-reveal="scale"
                data-reveal-delay={String(150 + i * 120)}
                className={`absolute aspect-[4/3] bg-white p-[1.2%] shadow-[0_18px_40px_-20px_rgba(12,31,66,0.55)] transition-transform duration-500 hover:z-10 hover:rotate-0 ${c.box}`}
              >
                <div className="relative size-full overflow-hidden">
                  <Image src={c.src} alt={c.alt} fill sizes="(min-width: 1024px) 20vw, 30vw" className="object-cover sepia-[0.2]" style={{ objectPosition: c.position }} />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="journey" className="scroll-mt-24 py-16 lg:py-20">
        <div className="wrap">
          <SectionIntro eyebrow="The journey" title="A Life of Purpose" />
          <ol className="relative mt-10 space-y-8 border-l border-bronze/50 pl-7 lg:mt-12 lg:grid lg:grid-cols-7 lg:gap-5 lg:space-y-0 lg:border-t lg:border-l-0 lg:pt-8 lg:pl-0">
            <span aria-hidden="true" className="absolute -top-[5px] -right-1 hidden text-bronze lg:block">
              <svg viewBox="0 0 10 10" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M2 1l4 4-4 4" />
              </svg>
            </span>
            {timeline.map((t, i) => (
              <li key={t.period} data-reveal data-reveal-delay={String(i * 70)} className="relative">
                <span aria-hidden="true" className="absolute top-1.5 -left-[33px] size-2.5 rounded-full bg-bronze ring-4 ring-paper lg:-top-[37px] lg:left-0" />
                <p className="font-semibold text-ink tabular-nums">{t.period}</p>
                <h3 className="mt-2 font-display text-lg leading-snug text-ink">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Defining chapters */}
      <section className="border-t border-line bg-blush py-16 lg:py-20">
        <div className="wrap">
          <SectionIntro eyebrow="A closer look" title="The Defining Chapters" />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {chapters.map((c, i) => (
              <article
                key={c.id}
                id={c.id}
                data-reveal
                data-reveal-delay={String((i % 4) * 80)}
                className="tile group scroll-mt-28 p-4 sm:p-6 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(12,31,66,0.45)]"
              >
                <p className="font-display text-2xl text-bronze tabular-nums">{String(i + 1).padStart(2, "0")}</p>
                <GoldRule className="mt-3 w-8" />
                <h3 className="mt-4 font-display text-xl text-ink">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery and legacy */}
      <section className="border-t border-line py-16 lg:py-20">
        <div className="wrap grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-0">
          <div id="gallery" className="scroll-mt-24 lg:border-r lg:border-bronze/30 lg:pr-12">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {gallery.map((g, i) => (
                <figure key={g.src} data-reveal data-reveal-delay={String(i * 80)} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={g.src}
                      alt={g.alt}
                      fill
                      sizes="(min-width: 1024px) 14vw, (min-width: 640px) 25vw, 50vw"
                      className="object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="mt-2 text-sm text-muted">{g.caption}</figcaption>
                </figure>
              ))}
            </div>
            <h2 data-reveal className="mt-6 font-display text-xl text-ink">
              Photo Gallery
            </h2>
            <p data-reveal className="mt-1 text-sm leading-relaxed text-body">
              A visual journey through the life and times of {founder.name}.
            </p>
          </div>
          <div id="legacy" className="scroll-mt-24 lg:pl-12">
            <p data-reveal="fade" className="eyebrow">
              A legacy that lives on
            </p>
            <h2 data-reveal="words" className="display-lg mt-3">
              <SplitWords>More Than a Memory</SplitWords>
            </h2>
            <p data-reveal data-reveal-delay="200" className="mt-5 leading-relaxed text-body">
              His life left a legacy in ideas, institutions, books, people and communities. The Foundation he established in 2012 continues that work, so
              that future generations may be informed, encouraged and equipped to make a positive difference.
            </p>
            <div data-reveal data-reveal-delay="300">
              <Button href="/about" className="mt-8">
                The Continuing Legacy
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
