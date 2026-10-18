import type { Metadata } from "next";
import Image from "next/image";
import { GiveCard } from "@/components/give-card";
import { Icon, type IconName } from "@/components/icons";
import { SplitWords } from "@/components/motion/split-words";
import { Button, Faq, ImageCta, SectionHead, SlideIcon, Statement } from "@/components/ui";
import { faqs } from "@/lib/faqs";
import { giveHref, givingOptions } from "@/lib/payment-links";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support the Mission",
  description:
    "Invest in a better tomorrow. Your support keeps life-changing books in people's hands, strengthens communities and invests in future generations.",
};

// A way without an href goes straight to the checkout.
const ways: { title: string; body: string; icon: IconName; cta: string; href?: string }[] = [
  { title: "Give a Donation", body: "Support our work with a one-time or monthly gift.", icon: "heart", cta: "Give now" },
  { title: "Sponsor Books", body: "Help print and distribute our books to schools, churches and communities.", icon: "books", cta: "Sponsor a print run", href: "/contact?enquiry=sponsor" },
  { title: "Partner With Us", body: "Partner as an individual, organisation or corporate supporter.", icon: "handshake", cta: "Become a partner", href: "/contact?enquiry=partnership" },
  { title: "Volunteer", body: "Contribute your time, skills and expertise to our initiatives.", icon: "people", cta: "Get involved", href: "/contact?enquiry=volunteer" },
  { title: "Leave a Legacy", body: "Include the Foundation in your estate plans and be part of a lasting impact.", icon: "gift", cta: "Learn more", href: "/contact?enquiry=legacy" },
];

const uses: [IconName, string][] = [
  ["book", "Print and freely distribute Christian literature"],
  ["cap", "Support students, schools and learning initiatives"],
  ["drop", "Fund community projects such as clean water"],
];

export default function SupportPage() {
  const options = givingOptions();
  return (
    <>
      {/* Hero with the giving card (Altruva layout) */}
      <section id="give" className="relative scroll-mt-24 overflow-hidden bg-sand">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-gold/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-32 size-[30rem] rounded-full bg-bronze/10 blur-3xl" />
        <div className="wrap relative grid items-center gap-12 py-14 lg:grid-cols-[1fr_1.05fr] lg:py-20">
          <div>
            <p data-reveal="fade" className="eyebrow">
              Support the mission
            </p>
            <h1 data-reveal="words" className="display-xl mt-4">
              <SplitWords>Invest in a better tomorrow.</SplitWords>
            </h1>
            <p data-reveal data-reveal-delay="250" className="lede mt-6 max-w-lg">
              Your support helps us keep life-changing books in people&rsquo;s hands, strengthen communities and invest in future generations. Together, we
              can preserve a legacy of faith, knowledge and service.
            </p>
            <blockquote data-reveal data-reveal-delay="350" className="mt-10 max-w-md border-l-2 border-bronze pl-5">
              <p className="font-display text-xl font-medium tracking-[-0.02em] text-ink">&ldquo;Give, and it shall be given unto you&hellip;&rdquo;</p>
              <cite className="mt-1 block text-sm text-muted not-italic">Luke 6:38 (KJV)</cite>
            </blockquote>
            <ul className="mt-10 space-y-3">
              {uses.map(([icon, text]) => (
                <li key={text} data-reveal="left" className="group flex items-center gap-4 text-ink">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-bronze text-white transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-rotate-12">
                    <Icon name={icon} className="size-5" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <GiveCard options={options} email={site.contact.email} />
        </div>
      </section>

      <section className="py-24">
        <div className="wrap">
          <Statement highlight="Many ways. One mission.">
            Choose the way that works best for you. Every contribution, in big or small measure, makes a difference.
          </Statement>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {ways.map((w) => (
              <a
                key={w.title}
                href={w.href ?? giveHref()}
                data-reveal
                className="group tile flex flex-col p-6 transition-[transform,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_50px_-28px_rgba(14,33,50,0.45)]"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-cream text-ink transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:bg-bronze group-hover:text-white">
                  <Icon name={w.icon} className="size-6" strokeWidth={1.4} />
                </span>
                <h3 className="display-sm mt-10">{w.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{w.body}</p>
                <span className="mt-6 flex items-center justify-between text-sm font-medium text-ink">
                  {w.cta}
                  <span className="flex size-8 items-center justify-center rounded-full bg-bronze text-white">
                    <SlideIcon name="arrow" className="size-4" />
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-reveal="clip" className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <div data-parallax="0.06" className="absolute inset-0">
              <Image src="/images/generated/partnership-meeting.jpg" alt="Nigerian professionals concluding a partnership meeting" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div>
            <h2 data-reveal="words" className="display-lg">
              <SplitWords>Corporate &amp; institutional support</SplitWords>
            </h2>
            <p data-reveal data-reveal-delay="200" className="lede mt-6 max-w-md">
              We welcome partnerships with companies, foundations and institutions that share our vision for an informed, compassionate and opportunity-rich
              society, from sponsoring a print run to supporting community projects.
            </p>
            <div data-reveal data-reveal-delay="320" className="mt-8 flex flex-wrap gap-4">
              <Button href="/contact?enquiry=partnership">Explore Partnerships</Button>
              <Button href="/contact?enquiry=sponsor" variant="outline">
                Sponsor a Print Run
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="wrap">
          <SectionHead center title="Common questions" aside="About giving to the Chinwoke Mbadinuju Foundation." />
          <div className="mx-auto mt-14 max-w-3xl">
            <Faq items={[faqs.secure, faqs.project, faqs.inKind, faqs.partner]} />
          </div>
        </div>
      </section>

      <ImageCta word="Give" title="A better tomorrow is possible" cta="Give Now" href={giveHref()} image="/images/generated/family-reading.jpg" position="50% 48%" />
    </>
  );
}
