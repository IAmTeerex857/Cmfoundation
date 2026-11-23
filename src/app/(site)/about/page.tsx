import type { Metadata } from "next";
import Image from "next/image";
import { Icon, type IconName } from "@/components/icons";
import { SplitWords } from "@/components/motion/split-words";
import { ArrowLink, Button, CtaBand, PageHero, SectionIntro } from "@/components/ui";
import { nonprofitStatement } from "@/lib/giving";
import { pillars, values } from "@/lib/work";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About CMF",
  description:
    "The Chinwoke Mbadinuju Foundation is an independent, privately established nonprofit foundation that shares Christian and public-interest literature and gives educational and humanitarian assistance.",
  path: "/about",
});

const pillarImages: Record<string, { src: string; alt: string; position?: string }> = {
  Literature: { src: "/images/stock/library-shelves.jpg", alt: "Shelves of books in a library" },
  Education: { src: "/images/generated/education-reading.jpg", alt: "A student reading aloud to her classmates" },
  Community: { src: "/images/cmf-water-project.jpg", alt: "A CMF community water project" },
  Humanitarian: { src: "/images/generated/family-reading.jpg", alt: "A family reading together at home" },
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
        image={{
          src: "/images/about-hero-books.jpg",
          alt: "A stack of books by Dr Chinwoke C. Mbadinuju and Cheta C. Mbadinuju on a desk, from False Men and True Christians to A Criminal in Heaven",
          position: "55% 70%",
        }}
        footer={
          <div className="overflow-hidden">
            <ul className={`${ruled} text-[0.78rem] font-semibold tracking-[0.14em] text-bronze uppercase`}>
              {pillars.map((p) => (
                <li key={p.label}>{p.label}</li>
              ))}
            </ul>
          </div>
        }
      >
        <p>
          The Chinwoke Mbadinuju Foundation is an independent, privately established nonprofit foundation. It shares Christian and public-interest literature
          freely and gives educational, humanitarian and community assistance, as its founder did throughout his life.
        </p>
      </PageHero>

      {/* Our story, vision, mission and values */}
      <section className="py-16 lg:py-20">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <SectionIntro eyebrow="Our story" title="Born of a Writer's Generosity">
            <p className="text-[1.05rem]">
              The Chinwoke Mbadinuju Foundation was established in 2012 during the lifetime of its founder, His Excellency Dr Chinwoke Clement Mbadinuju. It
              began as a proposal to formalise his longstanding literary activities and to channel the resources arising from his publications into the
              educational, charitable and humanitarian help he was already giving: school fees, scholarships, and assistance to individuals and families in
              need.
            </p>
            <p className="text-[1.05rem]">
              The Foundation did not begin as a public fundraising organisation or as a way of showcasing projects. It grew from the natural relationship
              between his intellectual work and his commitment to helping others. His passing in 2023 did not end that mission; it entrusted succeeding
              generations with continuing it.
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

      {/* Character, discreet service and stewardship (§2.2, §2.4, §2.5) */}
      <section className="border-t border-line py-16 lg:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div>
            <p className="eyebrow">Our character</p>
            <h2 className="display-sm mt-3">An Independent Foundation</h2>
            <p className="mt-3 leading-relaxed text-body">
              CMF&rsquo;s work has been supported principally by resources made available by its founder and those continuing his legacy, together with voluntary
              contributions associated with his publications. It has not run a general public fundraising programme. Today it welcomes voluntary support and
              institutional collaboration, without changing that founding character.
            </p>
          </div>
          <div>
            <p className="eyebrow">Discreet service</p>
            <h2 className="display-sm mt-3">Let Not Thy Left Hand Know</h2>
            <p className="mt-3 leading-relaxed text-body">
              Our founder believed generosity should be moved by compassion, not by recognition, guided by Christ&rsquo;s words in Matthew 6:1&ndash;4. We
              keep that tradition. We describe the kind of help we give rather than the people who receive it, and we do not publish their circumstances or
              photographs.
            </p>
          </div>
          <div>
            <p className="eyebrow">Stewardship</p>
            <h2 className="display-sm mt-3">A Nonprofit Institution</h2>
            <p className="mt-3 leading-relaxed text-body">{nonprofitStatement}</p>
          </div>
        </div>
      </section>

      {/* Four pillars */}
      <section className="border-t border-line bg-blush/60 py-16 lg:py-20">
        <div className="wrap">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-10">
            <div className="shrink-0">
              <p data-reveal="fade" className="eyebrow">
                Four areas of activity
              </p>
              <h2 data-reveal="words" className="display-lg mt-3">
                <SplitWords>What We Do</SplitWords>
              </h2>
            </div>
            <p data-reveal data-reveal-delay="200" className="leading-relaxed text-body lg:pb-2">
              Literature and education come first: they are where the Foundation began. Humanitarian assistance and community initiatives follow from the
              same commitment.
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
