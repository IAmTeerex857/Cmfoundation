import type { Metadata } from "next";
import Image from "next/image";
import { BookCover } from "@/components/book-cover";
import { Icon, type IconName } from "@/components/icons";
import { Library, LibraryLink } from "@/components/library";
import { SplitWords } from "@/components/motion/split-words";
import { Button, GoldRule, SectionIntro } from "@/components/ui";
import { getBook } from "@/lib/books";
import { readableSlugs } from "@/lib/manuscripts";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "The Literature Series",
  description:
    "Books freely given. Knowledge freely shared. Read the CMF Literature Series free online: the writings of Dr Chinwoke Clement Mbadinuju and the books continuing his work.",
  path: "/literature",
});

const heroBooks = ["false-men-and-true-christians", "much-ado-about-rapture", "all-is-vanity"].map((s) => getBook(s)!);

const themes = ["Faith", "Leadership", "Society", "Christian Living", "Governance", "History"];

const mission: { icon: IconName; title: string; body: string }[] = [
  { icon: "book", title: "Preserve", body: "Recover and digitise earlier works." },
  { icon: "pen", title: "Publish", body: "Introduce new works for contemporary readers." },
  { icon: "people", title: "Share", body: "Make the literature freely accessible." },
];

const authors = [
  {
    eyebrow: "The Founder's Library",
    name: "Dr Chinwoke Clement Mbadinuju",
    body: "22 published works spanning Christian thought, leadership, law, governance, memoir and public affairs.",
    image: { src: "/images/founder-bowler.jpg", alt: "Early portrait of Dr Chinwoke Clement Mbadinuju in a bowler hat", position: "50% 25%" },
    collection: "founder" as const,
    cta: "Explore Founder's Books",
  },
  {
    eyebrow: "The Series Continues",
    name: "Cheta C. Mbadinuju",
    body: "New works examining faith, God, grace, mortality, meaning, society and contemporary life.",
    image: { src: "/images/cheta-mbadinuju.jpg", alt: "Cheta C. Mbadinuju", position: "50% 18%" },
    collection: "current" as const,
    cta: "Explore Current Books",
  },
];

// Section order follows the Literature Series design (../drive_assets/4 CMF Literature Series 26.png).
export default function LiteraturePage() {
  const readable = readableSlugs();
  return (
    <>
      {/* Hero: copy at the left, three covers standing on a warm shelf at the right */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#f8ecd9] via-blush to-blush">
        <div className="wrap relative grid items-center gap-12 pt-14 pb-10 lg:grid-cols-[1.1fr_1fr] lg:pt-16 lg:pb-12">
          <div>
            <p data-reveal="fade" className="eyebrow">
              The CMF Literature Series
            </p>
            <h1 data-reveal="words" className="display mt-4 text-[clamp(2.4rem,3.8vw,3.2rem)] leading-[1.05]">
              <SplitWords>Books Freely Given. Knowledge Freely Shared.</SplitWords>
            </h1>
            <div data-reveal data-reveal-delay="300" className="mt-6 max-w-xl space-y-4 text-[1.08rem] leading-relaxed text-body">
              <p>
                The CMF Literature Series preserves the writings of Dr Chinwoke Clement Mbadinuju and continues his tradition of making Christian and
                public-interest literature freely available to succeeding generations.
              </p>
              <p>
                Every publication in the Series can be read free online, right here. Readers may support the mission voluntarily, but no donation is required
                to read a book.
              </p>
            </div>
            <div data-reveal data-reveal-delay="420" className="mt-8">
              <Button href="#library" icon="arrowDown">
                Explore the Library
              </Button>
            </div>
          </div>

          <div data-reveal="fade" data-reveal-delay="200" className="group relative" aria-hidden="true">
            <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-6 rounded-full bg-gold/15 blur-3xl" />
            <div className="relative flex items-end justify-center gap-[2.5%] px-1">
              <BookCover
                book={heroBooks[0]}
                className="w-[31%] shadow-[0_24px_40px_-22px_rgba(12,31,66,0.6)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-2 group-hover:-rotate-2"
              />
              <BookCover
                book={heroBooks[1]}
                className="z-10 w-[36%] shadow-[0_30px_50px_-22px_rgba(12,31,66,0.65)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2"
              />
              <div className="relative w-[31%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:rotate-2">
                <BookCover book={heroBooks[2]} className="w-full shadow-[0_24px_40px_-22px_rgba(12,31,66,0.6)]" />
                <span className="absolute inset-x-0 bottom-[1.5%] mx-auto w-fit rounded-[2px] bg-bronze px-3 py-1 text-[0.68rem] font-semibold tracking-[0.12em] text-white uppercase shadow-md">
                  Coming {heroBooks[2].year}
                </span>
              </div>
            </div>
            {/* The shelf */}
            <div className="relative -mx-6 h-5 rounded-[2px] bg-gradient-to-b from-[#b07a45] to-[#7c4f26] shadow-[0_18px_30px_-16px_rgba(60,35,10,0.6)]" />
          </div>
        </div>

        <div className="wrap relative grid items-center gap-10 border-t border-line/70 py-8 lg:grid-cols-[1.1fr_1fr]">
          <div data-reveal="fade">
            <GoldRule className="mb-5" />
            <ul className="flex flex-wrap gap-y-2 text-[0.72rem] font-medium tracking-[0.1em] text-ink uppercase" aria-label="Themes of the Series">
              {themes.map((t, i) => (
                <li key={t} className="flex items-center">
                  {i > 0 && <span className="mx-2.5 h-3 w-px bg-bronze/50" aria-hidden="true" />}
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid grid-cols-3 divide-x divide-line">
            {mission.map((m, i) => (
              <li key={m.title} data-reveal data-reveal-delay={String(i * 90)} className="flex flex-col items-center px-3 text-center">
                <Icon name={m.icon} className="size-8 text-bronze" strokeWidth={1.3} />
                <p className="mt-2 text-[0.8rem] font-semibold tracking-[0.1em] text-ink uppercase">{m.title}</p>
                <p className="mt-1 text-[0.82rem] leading-snug text-muted">{m.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Two generations of authors */}
      <section className="border-b border-line py-16 lg:py-20">
        <div className="wrap">
          <p data-reveal="fade" className="eyebrow">
            One literary heritage, two generations
          </p>
          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:divide-x lg:divide-line">
            {authors.map((a, i) => (
              <article key={a.name} data-reveal data-reveal-delay={String(i * 120)} className={`grid gap-6 sm:grid-cols-[13rem_1fr] ${i ? "lg:pl-10" : "lg:pr-10"}`}>
                <div className="relative aspect-[1/1.05] w-full max-w-[13rem] overflow-hidden bg-sand">
                  <Image src={a.image.src} alt={a.image.alt} fill sizes="208px" className="object-cover" style={{ objectPosition: a.image.position }} />
                </div>
                <div className="flex flex-col">
                  <p className="eyebrow">{a.eyebrow}</p>
                  <h2 className="display-md mt-3">{a.name}</h2>
                  <p className="mt-4 leading-relaxed text-body">{a.body}</p>
                  <div className="mt-6 sm:mt-auto sm:pt-6">
                    <LibraryLink collection={a.collection}>{a.cta}</LibraryLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Free library */}
      <section id="library" className="scroll-mt-24 py-16 lg:py-20">
        <div className="wrap">
          <Library readable={readable} />
        </div>
      </section>

      {/* Closing band */}
      <section className="border-t border-line bg-blush py-14 lg:py-16">
        <div className="wrap grid items-center gap-8 lg:grid-cols-[1.35fr_1.15fr]">
          <SectionIntro eyebrow="A platform for the future" title="Beyond One Author. Beyond One Generation." size="md">
            <p className="max-w-2xl">
              The CMF Literature Series is intended to grow beyond the writings of its Founder and succeeding family authors. In time, the Foundation hopes
              to make worthy works consistent with its literary, educational and humanitarian mission available to readers through the same tradition of
              accessible knowledge.
            </p>
          </SectionIntro>
          <div data-reveal data-reveal-delay="300" className="flex flex-wrap gap-3 lg:justify-end">
            <Button href="#library">Explore the Free Library</Button>
            <Button href="/support" variant="outline">
              Support the Mission
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
