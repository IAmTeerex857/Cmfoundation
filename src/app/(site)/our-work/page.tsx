import type { Metadata } from "next";
import Image from "next/image";
import { EventCard } from "@/components/event-card";
import { Icon } from "@/components/icons";
import { SplitWords } from "@/components/motion/split-words";
import { ArrowLink, Button, GoldRule, IconPillars, PageHero, QuoteBlock, SectionIntro } from "@/components/ui";
import { founder, quotes } from "@/lib/founder";
import { approach, initiatives, milestones, pillars, upcomingEvents } from "@/lib/work";
import { pageMetadata } from "@/lib/metadata";

// Re-render daily so past events drop off.
export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({
  title: "Our Work",
  description:
    "From ideas to lasting impact: the Chinwoke Mbadinuju Foundation translates ideas into action through literature, education, community development and legacy preservation.",
  path: "/our-work",
});

const initiativeImages: Record<string, string> = {
  "Education Support": "/images/generated/education-support.jpg",
  "Community Projects": "/images/stock/seedling-hands.jpg",
  "Free Literature Distribution": "/images/generated/book-distribution.jpg",
  "Sustainable Community Infrastructure": "/images/clean-water-handwashing.jpg",
};

const pillarLinks = ["Visit the Literature Series", "Learn more", "Learn more", "Learn more"];

// Section order follows the Foundation's Our Work design (../drive_assets/5 CMF Our Work 26.png).
export default function OurWorkPage() {
  const events = upcomingEvents();
  const service = quotes.find((q) => q.text.startsWith("Service"))!;

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="From Ideas to Lasting Impact."
        image={{ src: "/images/generated/reader-with-book.jpg", alt: "A young reader absorbed in a book", position: "30% center" }}
        aside={<QuoteBlock text={service.text} by={founder.name} />}
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

      {/* Four pillars */}
      <section className="border-b border-line bg-paper py-12">
        <div className="wrap">
          <IconPillars items={pillars.map((p, i) => ({ icon: p.icon, title: p.title, body: p.short, href: p.href, cta: pillarLinks[i] }))} />
        </div>
      </section>

      {/* Initiatives */}
      <section id="initiatives" className="scroll-mt-24 py-16 lg:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[0.95fr_3fr] lg:gap-8">
          <div>
            <SectionIntro eyebrow="Our initiatives" title="Real People. Real Progress." rule>
              <p>
                From schools and scholarships to community projects and the free distribution of books, our work is rooted in the belief that knowledge,
                opportunity and compassion can transform lives.
              </p>
            </SectionIntro>
            <div data-reveal data-reveal-delay="300">
              <Button href="/contact?enquiry=volunteer" variant="outline" className="mt-8">
                Get Involved
              </Button>
            </div>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {initiatives.map((it, i) => (
              <li key={it.title} data-reveal data-reveal-delay={String(i * 90)} className="tile group flex flex-col overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={initiativeImages[it.title]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl leading-snug text-ink">{it.title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{it.body}</p>
                  <ArrowLink href="/support" className="mt-auto pt-5">
                    Support this
                  </ArrowLink>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Approach */}
      <section id="approach" className="scroll-mt-24 overflow-hidden border-y border-line bg-blush">
        <div className="grid lg:grid-cols-2">
          <div data-reveal="fade" className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[24rem]">
            <Image src="/images/stock/linked-hands.jpg" alt="Hands linked together in a circle" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="px-5 py-14 sm:px-8 lg:py-16 lg:pr-[max(2rem,calc((100vw-1140px)/2))] lg:pl-12">
            <SectionIntro eyebrow="Our approach" title="Principled. Practical. People-Centred." size="md" />
            <ul className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line">
              {approach.map((a, i) => (
                <li key={a.title} data-reveal data-reveal-delay={String(i * 90)} className="flex flex-col items-center px-4 text-center">
                  <Icon name={a.icon} className="size-11 text-bronze" strokeWidth={1.1} />
                  <h3 className="mt-3 font-display text-xl text-ink">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{a.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Events */}
      {events.length > 0 && (
        <section id="events" className="scroll-mt-24 border-b border-line py-16 lg:py-20">
          <div className="wrap grid gap-10 lg:grid-cols-[1fr_2.3fr] lg:gap-10">
            <SectionIntro eyebrow="Events & engagement" title="Where the Mission Comes Together" size="md">
              <p>
                CMF events bring people together around literature, education, remembrance and community service, turning the Foundation&rsquo;s work into
                opportunities for participation and engagement.
              </p>
            </SectionIntro>
            <div>
              <div data-reveal="fade" className="mb-4 flex justify-end">
                <ArrowLink href="/events">View all events</ArrowLink>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                {events.slice(0, 3).map((e) => (
                  <EventCard key={e.title} event={e} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Milestones */}
      <section className="py-16 lg:py-20">
        <div className="wrap">
          <SectionIntro eyebrow="Impact & milestones" title="Moments That Mark the Journey" size="md" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <li key={m.title} data-reveal data-reveal-delay={String(i * 90)} className="tile group flex items-stretch overflow-hidden">
                <div className="relative w-[42%] shrink-0 overflow-hidden">
                  <Image
                    src={m.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 10vw, 40vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                </div>
                <div className="flex min-h-32 flex-col justify-center p-4">
                  <h3 className="font-display text-[1.05rem] leading-snug text-ink">{m.title}</h3>
                  <p className="mt-1.5 text-xs text-muted">{m.category}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Be part of the work */}
      <section className="overflow-hidden border-t border-line bg-blush">
        <div className="wrap relative flex flex-col gap-8 py-12 lg:flex-row lg:items-center lg:gap-10 lg:py-10">
          <div aria-hidden="true" className="relative hidden h-28 w-36 shrink-0 lg:block">
            <Image
              src="/images/stock/seedling-hands.jpg"
              alt=""
              fill
              sizes="144px"
              className="object-cover [mask-image:radial-gradient(closest-side,#000_55%,transparent)]"
            />
          </div>
          <div className="flex-1">
            <h2 data-reveal="words" className="display-md">
              <SplitWords>Be Part of the Work</SplitWords>
            </h2>
            <GoldRule className="mt-3 lg:hidden" />
            <p data-reveal data-reveal-delay="200" className="mt-3 text-body">
              Support our initiatives, volunteer, partner with us or simply help us share the message.
            </p>
          </div>
          <div data-reveal data-reveal-delay="300" className="flex flex-wrap gap-4">
            <Button href="/support">Support the Mission</Button>
            <Button href="/contact?enquiry=partnership" variant="outline" icon={null}>
              Partner With Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
