import type { Metadata } from "next";
import Image from "next/image";
import { SplitWords } from "@/components/motion/split-words";
import { Button, PageHero, QuoteBlock, SectionIntro } from "@/components/ui";
import { chapters, founder, quotes, timeline } from "@/lib/founder";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "The Founder",
  description: `${founder.name}, ${founder.title} (${founder.born} – ${founder.died}). ${founder.summary}`,
  path: "/founder",
});

// Framed photos for the "Many Chapters" collage, as placed in the design. They stay empty frames
// until the Foundation supplies the photos (the design's versions exist only inside its mockup).
const collage: { src?: string; alt: string; box: string }[] = [
  { alt: "", box: "left-[40%] top-[3%] w-[27%] -rotate-3" },
  { alt: "", box: "left-[69%] top-[0%] w-[30%] rotate-3" },
  { alt: "", box: "left-[45%] top-[50%] w-[31%] -rotate-1" },
  { alt: "", box: "left-[78%] top-[55%] w-[21%] rotate-2" },
];

/** A photo, or an empty frame where the Foundation's photo will go. */
function PhotoSlot({ src, alt = "", sizes, position = "50% 25%", className = "" }: { src?: string; alt?: string; sizes: string; position?: string; className?: string }) {
  return (
    <div aria-hidden={src ? undefined : true} className={`relative overflow-hidden bg-[#eee4d4] ${className}`}>
      {src && <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: position }} />}
    </div>
  );
}

// The design's two memory cards. Only the bowler-hat portrait exists so far; the other frames stay
// empty until the Foundation supplies the gallery and burial tribute photos.
const memories: { title: string; body: string; photos: { src?: string; alt?: string; position?: string }[] }[] = [
  {
    title: "Photo Gallery",
    body: `A visual journey through the life and times of ${founder.name}.`,
    photos: [{ src: "/images/founder-bowler.jpg", alt: "Early portrait of Dr Chinwoke Mbadinuju in a bowler hat", position: "50% 20%" }, {}],
  },
  { title: "Burial Tribute", body: "Honouring a life of service, faith and enduring impact.", photos: [{}, {}] },
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
                key={c.box}
                data-reveal="scale"
                data-reveal-delay={String(150 + i * 120)}
                className={`absolute aspect-[4/3] bg-white p-[1.2%] shadow-[0_18px_40px_-20px_rgba(12,31,66,0.55)] transition-transform duration-500 hover:z-10 hover:rotate-0 ${c.box}`}
              >
                <PhotoSlot src={c.src} alt={c.alt} sizes="(min-width: 1024px) 20vw, 30vw" className="size-full" />
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
                <PhotoSlot src={t.image} alt={t.title} sizes="(min-width: 1024px) 13vw, 80vw" className="mt-3 aspect-[4/3] max-w-xs" />
                <h3 className="mt-3 font-display text-lg leading-snug text-ink">{t.title}</h3>
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
                className="tile group scroll-mt-28 overflow-hidden transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(12,31,66,0.45)]"
              >
                <PhotoSlot src={c.image} alt={c.title} sizes="(min-width: 1024px) 22vw, 50vw" className="aspect-[4/3]" />
                <div className="p-4 sm:p-5">
                  <h3 className="font-display text-xl text-ink">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery and legacy */}
      <section className="border-t border-line py-16 lg:py-20">
        <div className="wrap grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-0">
          <div id="gallery" className="grid scroll-mt-24 gap-8 sm:grid-cols-2 lg:border-r lg:border-bronze/30 lg:pr-12">
            {memories.map((m, i) => (
              <article key={m.title} data-reveal data-reveal-delay={String(i * 120)}>
                <div className="grid aspect-[16/10] grid-cols-[0.8fr_1.2fr] gap-1.5">
                  {m.photos.map((ph, j) => (
                    <PhotoSlot key={j} src={ph.src} alt={ph.alt} sizes="(min-width: 1024px) 12vw, 25vw" position={ph.position} className="h-full" />
                  ))}
                </div>
                <h2 className="mt-4 font-display text-xl text-ink">{m.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-body">{m.body}</p>
              </article>
            ))}
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
