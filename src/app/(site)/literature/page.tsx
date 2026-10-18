import type { Metadata } from "next";
import { BookCard } from "@/components/book-card";
import { BookCover } from "@/components/book-cover";
import { Library } from "@/components/library";
import { SplitWords } from "@/components/motion/split-words";
import { Button, GreenBand, IconList, Marquee, NestedFrame, ReadMore, SectionHead, Split, Statement } from "@/components/ui";
import { forthcomingBooks, getBook } from "@/lib/books";
import { readableSlugs } from "@/lib/manuscripts";

export const metadata: Metadata = {
  title: "The Literature Series",
  description:
    "Books freely given. Knowledge freely shared. Read the CMF Literature Series free online: the writings of Dr Chinwoke Clement Mbadinuju and the books continuing his work.",
};

const heroBooks = ["false-men-and-true-christians", "much-ado-about-rapture", "all-is-vanity"].map((s) => getBook(s)!);

export default function LiteraturePage() {
  const readable = readableSlugs();
  return (
    <>
      <section className="relative overflow-hidden bg-sand">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -bottom-40 size-[34rem] rounded-full bg-gold/20 blur-3xl" />
        <div className="wrap relative grid items-center gap-12 py-14 lg:grid-cols-[1.25fr_1fr] lg:py-20">
          <div>
            <p data-reveal="fade" className="eyebrow">
              The CMF Literature Series
            </p>
            <h1 data-reveal="words" className="display-xl mt-4">
              <SplitWords>Books freely given. Knowledge freely shared.</SplitWords>
            </h1>
            <div data-reveal data-reveal-delay="350" className="lede mt-6 max-w-xl space-y-4">
              <p>
                The CMF Literature Series preserves the writings of Dr Chinwoke Clement Mbadinuju and continues his tradition of making Christian and
                public-interest literature freely available to succeeding generations.
              </p>
              <p>Every book can be read free online, right here. No account, no download, no charge. Readers may support the mission voluntarily, but no donation is required.</p>
            </div>
            <div data-reveal data-reveal-delay="480" className="mt-8 flex flex-wrap gap-4">
              <Button href="#library" icon="arrowDown">
                Explore the Library
              </Button>
              <Button href="/support" variant="outline">
                Support the Series
              </Button>
            </div>
          </div>
          <div data-reveal="scale" data-reveal-delay="200" className="tile group flex items-end justify-center gap-4 overflow-hidden bg-cream px-6 pt-10 pb-0 lg:px-10">
            <BookCover
              book={heroBooks[0]}
              className="w-[30%] -rotate-3 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-x-3 group-hover:-rotate-[9deg]"
            />
            <div className="z-10 mb-6 w-[36%] animate-float motion-reduce:animate-none">
              <BookCover book={heroBooks[1]} className="transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-3 group-hover:scale-105" />
            </div>
            <BookCover
              book={heroBooks[2]}
              className="w-[30%] rotate-3 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-3 group-hover:rotate-[9deg]"
            />
          </div>
        </div>
      </section>

      <Marquee items={["Faith", "Leadership", "Society", "Christian Living", "Governance", "History"]} />

      <section className="py-24">
        <div className="wrap">
          <Statement highlight="Preserve. Publish. Share.">One literary heritage across two generations: recovering earlier works, introducing new ones and keeping them free for all.</Statement>
          <div className="mt-14">
            <IconList
              items={[
                { icon: "book", title: "Preserve", body: "Recover and digitise the earlier works of Dr Chinwoke Clement Mbadinuju." },
                { icon: "pen", title: "Publish", body: "Introduce new works for contemporary readers on faith, grace, society and meaning." },
                { icon: "people", title: "Share", body: "Make the literature freely accessible to churches, schools, communities and every reader." },
                { icon: "books", title: "Grow", body: "In time, welcome worthy works by other authors consistent with the Foundation's mission." },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="wrap space-y-24">
          <Split title="The Founder's Library" image={<NestedFrame src="/images/founder-bowler.jpg" alt="Dr Chinwoke Clement Mbadinuju" position="50% 25%" />}>
            <p className="text-ink">Dr Chinwoke Clement Mbadinuju</p>
            <p>22 published works spanning Christian thought, leadership, law, governance, memoir and public affairs.</p>
            <ReadMore href="#library">Explore the founder&rsquo;s books</ReadMore>
          </Split>
          <Split
            reverse
            title="The Series Continues"
            image={<NestedFrame src="/images/cheta-mbadinuju.jpg" alt="Cheta C. Mbadinuju" tone="navy" flip position="50% 18%" />}
          >
            <p className="text-ink">Cheta C. Mbadinuju</p>
            <p>New works examining faith, God, grace, mortality, meaning, society and contemporary life.</p>
            <ReadMore href="#library">Explore current books</ReadMore>
          </Split>
        </div>
      </section>

      <section id="library" className="scroll-mt-24 py-24">
        <div className="wrap">
          <SectionHead title={<>Read. Reflect. Share.</>} aside="Every title is free to read online. Search, filter by topic and open a book to start reading." className="mb-12" />
          <Library readable={readable} />
        </div>
      </section>

      <section id="forthcoming" className="scroll-mt-24 bg-bronze py-24 text-white">
        <div className="wrap">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 data-reveal="words" className="display-lg text-white">
              <SplitWords>Forthcoming from CMF</SplitWords>
            </h2>
            <p data-reveal data-reveal-delay="250" className="max-w-sm text-white/90">
              New titles from Cheta C. Mbadinuju, coming in 2027.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {forthcomingBooks.map((b) => (
              <BookCard key={b.slug} book={b} readable={readable.includes(b.slug)} />
            ))}
          </div>
        </div>
      </section>

      <GreenBand
        title="Beyond One Author. Beyond One Generation."
        body="The Literature Series is intended to grow beyond the writings of its Founder and succeeding family authors, keeping worthy works available through the same tradition of accessible knowledge."
        image="/images/generated/literature-archive.jpg"
      >
        <Button href="#library" variant="dark" icon={null}>
          Explore the Free Library
        </Button>
        <Button href="/support" variant="light" icon={null}>
          Support the Mission
        </Button>
      </GreenBand>
    </>
  );
}
