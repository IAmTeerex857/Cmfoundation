import type { Metadata } from "next";
import Image from "next/image";
import { EventCard } from "@/components/event-card";
import { Icon } from "@/components/icons";
import { SplitWords } from "@/components/motion/split-words";
import { Button, IconList, ImageCard, ImageCta, Marquee, NumberedCards, PageHero, SectionHead, Statement } from "@/components/ui";
import { approach, initiatives, milestones, pillars, upcomingEvents } from "@/lib/work";

// Re-render daily so past events drop off.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "From ideas to lasting impact: the Chinwoke Mbadinuju Foundation translates ideas into action through literature, education, community development and legacy preservation.",
};

const initiativeImages: Record<string, string> = {
  "Education Support": "/images/generated/education-support.jpg",
  "Community Projects": "/images/generated/community-tree-planting.jpg",
  "Free Literature Distribution": "/images/generated/book-distribution.jpg",
  "Sustainable Community Infrastructure": "/images/water-project.jpg",
};

export default function OurWorkPage() {
  const events = upcomingEvents();

  return (
    <>
      <PageHero
        title={<>From ideas to lasting impact.</>}
        images={[
          { src: "/images/children-community.jpg", alt: "Children from a community CMF supports" },
        ]}
        actions={
          <>
            <Button href="#approach">Our Approach</Button>
            <Button href="/contact?enquiry=volunteer" variant="outline">
              Get Involved
            </Button>
          </>
        }
      >
        <p>
          The Chinwoke Mbadinuju Foundation translates ideas into action through literature, education, community development and legacy preservation,
          advancing a more informed, compassionate and opportunity-rich society.
        </p>
      </PageHero>

      <Marquee items={["Education Support", "Community Projects", "Free Literature", "Clean Water", "Legacy"]} />

      <section className="py-24">
        <div className="wrap">
          <Statement highlight="Service is the rental we pay for the space we occupy.">
            From schools and scholarships to community projects and the free distribution of books, our work is rooted in the belief that knowledge,
            opportunity and compassion can transform lives.
          </Statement>
          <div className="mt-14">
            <IconList items={pillars.map((p) => ({ icon: p.icon, title: p.title, body: p.body, href: p.href }))} />
          </div>
        </div>
      </section>

      <section id="initiatives" className="scroll-mt-24 pb-24">
        <div className="wrap">
          <SectionHead title="Real people. Real progress." aside="The initiatives through which the Foundation's pillars become practical help." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {initiatives.map((i) =>
              initiativeImages[i.title] ? (
                <ImageCard key={i.title} href="/support#give" title={i.title} image={initiativeImages[i.title]} alt={i.title} />
              ) : (
                <ImageCard key={i.title} href="/support#give" title={i.title}>
                  <div className="flex h-full flex-col justify-between bg-navy p-6 text-white">
                    <Icon name={i.icon} className="size-12 text-gold transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-rotate-6" strokeWidth={1.3} />
                    <p className="text-sm leading-relaxed text-white/85">{i.body}</p>
                  </div>
                </ImageCard>
              ),
            )}
          </div>
        </div>
      </section>

      <section id="approach" className="scroll-mt-24 bg-bronze py-24">
        <div className="wrap">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 data-reveal="words" className="display-lg max-w-xl text-white">
              <SplitWords>Principled. Practical. People-centred.</SplitWords>
            </h2>
            <p data-reveal data-reveal-delay="250" className="max-w-sm text-white/90">
              How we work, wherever the Foundation is involved.
            </p>
          </div>
          <div className="mt-12">
            <NumberedCards items={approach.map((a) => ({ title: a.title, body: a.body }))} />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="wrap">
          <SectionHead title="Moments that mark the journey" aside="Impact and milestones from the Foundation's work." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <article
                key={m.title}
                data-reveal
                className="tile group flex flex-col p-3 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-28px_rgba(14,33,50,0.5)]"
              >
                <div className={`relative aspect-[4/3] overflow-hidden rounded-xl ${["bg-parchment", "bg-tan", "bg-navy-soft", "bg-navy"][i % 4]}`}>
                  {m.image ? (
                    <Image src={m.image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]" />
                  ) : (
                    <Icon name="leaf" className={`absolute top-5 left-5 size-10 ${i === 0 ? "text-navy-soft" : "text-white/80"}`} strokeWidth={1.3} />
                  )}
                </div>
                <div className="px-1 pt-4 pb-1">
                  <p className="text-xs text-bronze">{"//"}{m.category}</p>
                  <h3 className="display-sm mt-1 text-xl">{m.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {events.length > 0 && (
        <section id="events" className="scroll-mt-24 pb-8">
          <div className="wrap">
            <SectionHead title="Where the mission comes together" aside="Literature, education, remembrance and community service, turning the work into opportunities for participation." />
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((e, i) => (
                <EventCard key={e.title} event={e} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ImageCta word="Join" title="Be part of the work" cta="Partner With Us" href="/contact?enquiry=partnership" image="/images/generated/volunteer-gathering.jpg" />
    </>
  );
}
