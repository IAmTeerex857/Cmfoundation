import type { Metadata } from "next";
import Image from "next/image";
import { Icon, type IconName } from "@/components/icons";
import { SplitWords } from "@/components/motion/split-words";
import { ArrowLink, Button, CtaBand, PageHero, SectionIntro } from "@/components/ui";
import { pillars, values } from "@/lib/work";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About CMF",
  description:
    "The Chinwoke Mbadinuju Foundation is an independent charitable and intellectual foundation advancing Christian literature, education, community development and service to humanity.",
  path: "/about",
});

const pillarImages: Record<string, { src: string; alt: string; position?: string }> = {
  Literature: { src: "/images/stock/library-shelves.jpg", alt: "Shelves of books in a library" },
  Education: { src: "/images/generated/education-reading.jpg", alt: "A student reading aloud to her classmates" },
  Community: { src: "/images/generated/community-tree-planting.jpg", alt: "Community volunteers planting a tree together" },
  Legacy: { src: "/images/founder-barrister.jpg", alt: "Dr Chinwoke Mbadinuju as a young barrister", position: "50% 22%" },
};

const purpose: { icon: IconName; title: string; body: string }[] = [
  { icon: "binoculars", title: "Our Vision", body: "A society enriched by knowledge, responsible leadership, purposeful living and compassionate service." },
  {
    icon: "target",
    title: "Our Mission",
    body: "To preserve and advance the intellectual and humanitarian legacy of Dr Chinwoke Clement Mbadinuju through free literature, education, community development and initiatives that improve human lives.",
  },
];

// A row of words divided by hairlines. Each item carries a left rule; the list is shifted left
// inside an overflow-hidden wrapper so the rule at the start of every wrapped line is clipped.
const ruled = "-ml-[13px] flex flex-wrap gap-y-2 leading-none [&>li]:border-l [&>li]:border-bronze/40 [&>li]:px-3";

// Section order follows the Foundation's About page design (../drive_assets/2 CMF About Us 26.png).
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the Chinwoke Mbadinuju Foundation"
        compact
        short
        title={
          <>
            A Foundation Built on Values.
            <br />A Mission Focused on Impact.
          </>
        }
        image={{ src: "/images/about-book-stack.jpg", alt: "A stack of CMF Literature Series books beside a potted plant", position: "left bottom", aspect: "aspect-[972/600]" }}
        footer={
          <div className="overflow-hidden">
            <ul className={`${ruled} text-[0.78rem] font-semibold tracking-[0.14em] text-bronze uppercase`}>
              {pillars.map((p) => (
                <li key={p.label}>{p.label === "Community" ? "Community Development" : p.label}</li>
              ))}
            </ul>
          </div>
        }
      >
        <p>
          The Chinwoke Mbadinuju Foundation is an independent charitable and intellectual foundation advancing Christian literature, education, community
          development and service to humanity.
        </p>
      </PageHero>

      {/* Our story, vision, mission and values */}
      <section className="py-16 lg:py-20">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <SectionIntro eyebrow="Our story" title="Continuing a Remarkable Inheritance">
            <p className="text-[1.05rem]">
              The Chinwoke Mbadinuju Foundation was established in 2012 during the lifetime of Dr Chinwoke Clement Mbadinuju. Through the Foundation, he
              continued his intellectual and Christian work, freely distributed his writings and supported community initiatives.
            </p>
            <p className="text-[1.05rem]">
              His passing in 2023 did not end the Foundation&rsquo;s mission. It entrusted succeeding generations with the responsibility to continue it.
            </p>
            <div className="pt-2">
              <ArrowLink href="/founder">Read about the founder</ArrowLink>
            </div>
          </SectionIntro>

          <div data-reveal="fade" className="bg-blush p-7 sm:p-9">
            <div className="grid gap-8 sm:grid-cols-2 sm:divide-x sm:divide-line">
              {purpose.map((p, i) => (
                <div key={p.title} className={i ? "sm:pl-8" : "sm:pr-8"}>
                  <Icon name={p.icon} className="size-11 text-bronze" strokeWidth={1.2} />
                  <h3 className="display-sm mt-3">{p.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-line pt-8">
              <Icon name="diamond" className="size-11 text-bronze" strokeWidth={1.2} />
              <h3 className="display-sm mt-3">Our Values</h3>
              <div className="mt-3 overflow-hidden">
                <ul className={`${ruled} text-[0.95rem] text-muted`}>
                  {values.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four pillars */}
      <section className="border-t border-line bg-blush/60 py-16 lg:py-20">
        <div className="wrap">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-10">
            <div className="shrink-0">
              <p data-reveal="fade" className="eyebrow">
                Our four pillars
              </p>
              <h2 data-reveal="words" className="display-lg mt-3">
                <SplitWords>What We Do</SplitWords>
              </h2>
            </div>
            <p data-reveal data-reveal-delay="200" className="leading-relaxed text-body lg:pb-2">
              CMF works at the intersection of ideas, people and practical impact. Our four pillars guide everything we do.
            </p>
          </div>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => {
              const img = pillarImages[p.label];
              return (
                <li key={p.title} data-reveal data-reveal-delay={String(i * 90)} className="tile group flex flex-col overflow-hidden">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      style={{ objectPosition: img.position ?? "center" }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <Icon name={p.icon} className="size-10 text-bronze" strokeWidth={1.2} />
                    <h3 className="display-sm mt-3">{p.title}</h3>
                    <p className="mt-2 mb-5 text-[0.93rem] leading-relaxed text-muted">{p.body}</p>
                    <ArrowLink href={p.href} className="mt-auto tracking-[0.04em]">
                      {p.cta}
                    </ArrowLink>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaBand
        eyebrow="A foundation for generations"
        title="Join Us in Continuing the Mission"
        actions={
          <>
            <Button href="/support">Support the Mission</Button>
            <Button href="/our-work" variant="outline">
              Explore Our Work
            </Button>
          </>
        }
        aside={
          <p className="font-display text-[clamp(1.9rem,3vw,2.4rem)] leading-[1.15] text-bronze italic">
            Every little,
            <br />
            helps a lot.
          </p>
        }
      >
        <p className="max-w-2xl text-[1.05rem]">
          CMF was founded with a commitment to knowledge, service and human development. Today, that mission continues through free literature, education,
          community initiatives and the preservation of an important legacy.
        </p>
      </CtaBand>
    </>
  );
}
