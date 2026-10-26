import type { Metadata } from "next";
import Image from "next/image";
import { GiveCard } from "@/components/give-card";
import { Icon, type IconName } from "@/components/icons";
import { SplitWords } from "@/components/motion/split-words";
import { Button, Faq, GoldRule, PageHero, QuoteBlock, SectionIntro, SlideIcon } from "@/components/ui";
import { getBook } from "@/lib/books";
import { faqs } from "@/lib/faqs";
import { giveHref, givingOptions } from "@/lib/payment-links";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Support the Mission",
  description:
    "Invest in a better tomorrow. Your support keeps life-changing books in people's hands, strengthens communities and invests in future generations.",
  path: "/support",
});

// A way without an href goes straight to the checkout.
const ways: { title: string; body: string; icon: IconName; cta: string; href?: string }[] = [
  { title: "Give a Donation", body: "Support our work with a one-time or monthly gift.", icon: "heart", cta: "Give now" },
  { title: "Sponsor Books", body: "Help print and distribute our books to schools, churches and communities.", icon: "books", cta: "Learn more", href: "/contact?enquiry=sponsor" },
  { title: "Partner With Us", body: "Partner as an individual, organisation or corporate supporter.", icon: "handshake", cta: "Become a partner", href: "/contact?enquiry=partnership" },
  { title: "Volunteer", body: "Contribute your time, skills and expertise to our initiatives.", icon: "people", cta: "Get involved", href: "/contact?enquiry=volunteer" },
  { title: "Leave a Legacy", body: "Include the Foundation in your estate plans and be part of a lasting impact.", icon: "gift", cta: "Learn more", href: "/contact?enquiry=legacy" },
];

const uses: [IconName, string][] = [
  ["book", "Print and freely distribute Christian literature"],
  ["cap", "Support students, schools and learning initiatives"],
  ["drop", "Fund community projects such as clean water"],
];

const impact: [IconName, string][] = [
  ["book", "Free Literature"],
  ["cap", "Education Supported"],
  ["people", "Communities Reached"],
  ["gear", "Projects Delivered"],
];

// Spines for the stacked-books picture between the print-run and partnership columns.
const spines = [
  { slug: "exploring-the-godhead", tone: "bg-[#14233d] text-white" },
  { slug: "the-wages-of-sin", tone: "bg-[#6b1f22] text-white" },
  { slug: "the-criminal-in-heaven", tone: "bg-[#1c2430] text-white" },
  { slug: "all-is-vanity", tone: "bg-[#efe4cf] text-ink" },
  { slug: "a-lawyers-woes", tone: "bg-[#0f1b2e] text-gold" },
].map((s) => ({ ...s, title: getBook(s.slug)?.title ?? s.slug }));

export default function SupportPage() {
  const options = givingOptions();
  const give = giveHref();
  return (
    <>
      <PageHero
        eyebrow="Support the mission"
        title="Invest in A Better Tomorrow."
        image={{ src: "/images/stock/seedling-hands.jpg", alt: "Hands cupping a young seedling in dark soil", position: "center 40%" }}
        aside={
          <>
            <QuoteBlock text={<>Give, and it shall be given unto you&hellip;</>} by="Luke 6:38 (KJV)" />
            <GoldRule className="mt-6 w-10" />
            <p className="mt-5 font-display text-xl leading-snug text-bronze italic">
              Ideas.
              <br />
              People.
              <br />
              Communities.
              <br />A Better Tomorrow.
            </p>
          </>
        }
        actions={
          <>
            <Button href={give}>Give Now</Button>
            <Button href="#ways" variant="outline">
              Explore Other Ways to Support
            </Button>
          </>
        }
      >
        <p>
          Your support helps us keep life-changing books in people&rsquo;s hands, strengthen communities and invest in future generations. Together, we can
          preserve a legacy of faith, knowledge and service.
        </p>
      </PageHero>

      {/* Ways to support */}
      <section id="ways" className="scroll-mt-24 border-t border-line py-16 lg:py-20">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <SectionIntro eyebrow="Ways to support" title="Many Ways. One Mission." />
            <p data-reveal data-reveal-delay="200" className="max-w-md leading-relaxed text-body lg:pb-2">
              Choose the way that works best for you. Every contribution, in big or small measure, makes a difference.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ways.map((w, i) => (
              <article key={w.title} data-reveal data-reveal-delay={String(i * 80)} className="tile group flex flex-col items-center px-5 py-8 text-center">
                <Icon name={w.icon} className="size-12 text-bronze transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1" strokeWidth={1.1} />
                <h3 className="display-sm mt-4">{w.title}</h3>
                <p className="mt-2 flex-1 text-[0.92rem] leading-relaxed text-muted">{w.body}</p>
                <Button href={w.href ?? give} variant="outline" className="mt-6 w-full px-2! text-[0.74rem]! tracking-[0.06em]!">
                  {w.cta}
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Give online */}
      <section id="give" className="scroll-mt-24 bg-blush py-16 lg:py-20">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <SectionIntro eyebrow="Give online" title="Every Gift Plants a Seed." rule>
              <p className="max-w-md">Choose what you&rsquo;d like to support, then give any amount at checkout. Your gift helps us:</p>
            </SectionIntro>
            <ul className="mt-8 space-y-4">
              {uses.map(([icon, text]) => (
                <li key={text} data-reveal="left" className="flex items-center gap-4 text-ink">
                  <Icon name={icon} className="size-7 shrink-0 text-bronze" strokeWidth={1.3} />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <GiveCard options={options} email={site.contact.email} />
        </div>
      </section>

      {/* Real impact */}
      <section className="overflow-hidden border-y border-line bg-paper">
        <div className="grid lg:grid-cols-[0.85fr_1.4fr]">
          <div data-reveal="fade" className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[22rem]">
            <Image
              src="/images/stock/student-smiling.jpg"
              alt="A smiling student at his desk in a classroom"
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-[35%_center] lg:[mask-image:linear-gradient(to_right,#000_70%,transparent)]"
            />
          </div>
          <div className="grid items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:py-14 lg:pr-[max(2rem,calc((100vw-1140px)/2))] lg:pl-10">
            <div>
              <SectionIntro eyebrow="Real impact" title="Your Support Changes Lives.">
                <p className="max-w-lg">Together, we are making knowledge, opportunity and compassion a reality in communities across Nigeria and beyond.</p>
              </SectionIntro>
              <ul className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:divide-x sm:divide-line">
                {impact.map(([icon, label], i) => (
                  <li key={label} data-reveal data-reveal-delay={String(i * 80)} className="flex flex-col items-center px-3 text-center">
                    <Icon name={icon} className="size-10 text-bronze" strokeWidth={1.1} />
                    <span className="mt-3 text-[0.95rem] leading-snug text-ink">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal="fade" data-reveal-delay="300" className="lg:max-w-[13rem] lg:border-l lg:border-bronze/40 lg:pl-8">
              <QuoteBlock text="A small seed of kindness can transform a generation." />
              <GoldRule className="mt-5 w-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Print runs and partnerships */}
      <section className="py-16 lg:py-20">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_0.9fr_1fr] lg:gap-10">
          <div>
            <SectionIntro eyebrow="Featured opportunity" title="Help Us Reach More Readers" size="md">
              <p>Support the next print run of our books and help us place them in schools, churches and communities across Nigeria.</p>
            </SectionIntro>
            <div data-reveal data-reveal-delay="300">
              <Button href="/contact?enquiry=sponsor" className="mt-8">
                Sponsor a Print Run
              </Button>
            </div>
          </div>

          <div data-reveal="fade" aria-hidden="true" className="mx-auto w-full max-w-sm space-y-1 [perspective:900px]">
            {spines.map((s, i) => (
              <div
                key={s.slug}
                className={`flex h-12 items-center justify-between rounded-[3px] border-l-[6px] border-black/25 px-4 shadow-[0_8px_18px_-10px_rgba(12,31,66,0.55)] ${s.tone}`}
                style={{ transform: `translateX(${[6, -4, 2, -6, 4][i]}px)` }}
              >
                <span className="font-ui text-[0.82rem] font-medium tracking-[0.04em] uppercase">{s.title}</span>
                <span className="font-display text-sm font-semibold text-gold">CMF</span>
              </div>
            ))}
          </div>

          <div>
            <SectionIntro eyebrow="Corporate & institutional support" title="Stronger Together" size="md">
              <p>
                We welcome partnerships with companies, foundations and institutions that share our vision for an informed, compassionate and
                opportunity-rich society.
              </p>
            </SectionIntro>
            <div data-reveal data-reveal-delay="300">
              <Button href="/contact?enquiry=partnership" className="mt-8">
                Explore Partnerships
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="border-t border-line bg-paper py-16 lg:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <SectionIntro eyebrow="Frequent questions" title="Common Questions" />
            <div className="mt-8">
              <Faq items={[faqs.secure, faqs.project, faqs.inKind, faqs.partner]} />
            </div>
          </div>
          <div data-reveal="fade" className="relative isolate flex flex-col overflow-hidden bg-blush lg:min-h-[24rem] lg:justify-center">
            <div className="relative aspect-[16/9] lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto">
              <Image
                src="/images/generated/family-reading.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-[70%_center] [mask-image:linear-gradient(to_bottom,#000_70%,transparent)] lg:[mask-image:linear-gradient(to_right,transparent_38%,#000_85%)]"
              />
            </div>
            <div className="p-8 sm:p-10 lg:max-w-[22rem]">
              <h2 className="display-md lg:max-w-[19rem]">
                <SplitWords>A Better Tomorrow Is Possible.</SplitWords>
              </h2>
              <p className="mt-4 leading-relaxed text-body lg:max-w-[15rem]">Join us in preserving a legacy of faith, knowledge and service for succeeding generations.</p>
              <a
                href={give}
                className="group mt-7 inline-flex items-center gap-3 rounded-[3px] bg-bronze px-6 py-3.5 text-[0.82rem] leading-none font-semibold tracking-[0.08em] text-white uppercase transition-colors duration-300 hover:bg-bronze-dark"
              >
                Give Now
                <SlideIcon name="arrow" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
