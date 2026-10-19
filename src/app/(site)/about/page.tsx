import type { Metadata } from "next";
import { QuoteSlider } from "@/components/quote-slider";
import { Button, GreenBand, IconList, Marquee, NestedFrame, NumberedCards, PageHero, ReadMore, SectionHead, Split, Statement } from "@/components/ui";
import { quotes } from "@/lib/founder";
import { pillars, values } from "@/lib/work";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About CMF",
  description:
    "The Chinwoke Mbadinuju Foundation is an independent charitable and intellectual foundation advancing Christian literature, education, community development and service to humanity.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={<>A foundation built on values. A mission focused on impact.</>}
        images={[
          { src: "/images/founder-bowler.jpg", alt: "Early portrait of Dr Chinwoke Clement Mbadinuju", position: "50% 30%" },
          { src: "/images/generated/book-distribution.jpg", alt: "Students receiving books at a community literacy event", position: "50% 45%" },
        ]}
        actions={
          <>
            <Button href="/support">Support the Mission</Button>
            <Button href="/our-work" variant="outline">
              Explore Our Work
            </Button>
          </>
        }
      >
        <p>
          The Chinwoke Mbadinuju Foundation is an independent charitable and intellectual foundation advancing Christian literature, education, community
          development and service to humanity.
        </p>
      </PageHero>

      <Marquee items={["Literature", "Education", "Community Development", "Legacy"]} />

      <section className="py-24">
        <div className="wrap">
          <Statement highlight="Continuing a remarkable inheritance.">
            The Foundation was established in 2012 during the lifetime of Dr Chinwoke Clement Mbadinuju. Through it, he continued his intellectual and Christian
            work, freely distributed his writings and supported community initiatives.
          </Statement>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="wrap">
          <Split title="Our Story" image={<NestedFrame src="/images/founder-portrait.jpg" alt="Dr Chinwoke Clement Mbadinuju" position="top" />}>
            <p>
              Dr Chinwoke Clement Mbadinuju, scholar, lawyer, journalist, evangelist, author, Governor of Anambra State and Odera 1 of Uli, founded CMF to
              carry his convictions beyond his own lifetime: that knowledge, influence and opportunity must be used to serve God and humanity.
            </p>
            <p>
              His passing in 2023 did not end the Foundation&rsquo;s mission. It entrusted succeeding generations with the responsibility to continue it.
            </p>
            <ReadMore href="/founder">Read about the founder</ReadMore>
          </Split>
        </div>
      </section>

      <section className="py-24">
        <div className="wrap">
          <SectionHead title={<>Vision, mission and values</>} aside="What we believe, what we are here to do, and the values that guide how we do it." />
          <div className="mt-12">
            <NumberedCards
              items={[
                { title: "Our Vision", body: "A society enriched by knowledge, responsible leadership, purposeful living and compassionate service." },
                {
                  title: "Our Mission",
                  body: "To preserve and advance the intellectual and humanitarian legacy of Dr Chinwoke Clement Mbadinuju through free literature, education, community development and initiatives that improve human lives.",
                },
                {
                  title: "Our Values",
                  body: (
                    <ul className="flex flex-wrap gap-2">
                      {values.map((v) => (
                        <li key={v} className="rounded-full border border-ink/30 px-3 py-1 text-sm">
                          {v}
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="wrap">
          <SectionHead title="What we do" aside="CMF works at the intersection of ideas, people and practical impact. Our four pillars guide everything we do." />
          <div className="mt-6">
            <IconList items={pillars.map((p) => ({ icon: p.icon, title: p.title, body: p.body, href: p.href }))} />
          </div>
        </div>
      </section>

      <QuoteSlider quotes={quotes} />

      <GreenBand
        title="Join Us in Continuing the Mission"
        body="CMF was founded with a commitment to knowledge, service and human development. Today, that mission continues through free literature, education, community initiatives and the preservation of an important legacy."
        image="/images/generated/reader-with-book.jpg"
      >
        <Button href="/support" variant="dark" icon={null}>
          Support the Mission
        </Button>
        <Button href="/our-work" variant="light" icon={null}>
          Explore Our Work
        </Button>
      </GreenBand>
    </>
  );
}
