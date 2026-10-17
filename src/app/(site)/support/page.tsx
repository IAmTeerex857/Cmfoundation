import type { Metadata } from "next";
import Image from "next/image";
import { GiftTiers } from "@/components/gift-tiers";
import { GivePanel } from "@/components/give-panel";
import { Icon, type IconName } from "@/components/icons";
import { Button, Faq, ImageCta, SectionHead, Statement } from "@/components/ui";
import { faqs } from "@/lib/faqs";
import { givingOptions } from "@/lib/payment-links";

export const metadata: Metadata = {
  title: "Support the Mission",
  description:
    "Invest in a better tomorrow. Your support keeps life-changing books in people's hands, strengthens communities and invests in future generations.",
};

const ways: { title: string; body: string; icon: IconName; cta: string; href: string }[] = [
  { title: "Give a Donation", body: "Support our work with a one-time or monthly gift.", icon: "heart", cta: "Give now", href: "#give" },
  { title: "Sponsor Books", body: "Help print and distribute our books to schools, churches and communities.", icon: "books", cta: "Sponsor a print run", href: "/contact?enquiry=sponsor" },
  { title: "Partner With Us", body: "Partner as an individual, organisation or corporate supporter.", icon: "handshake", cta: "Become a partner", href: "/contact?enquiry=partnership" },
  { title: "Volunteer", body: "Contribute your time, skills and expertise to our initiatives.", icon: "people", cta: "Get involved", href: "/contact?enquiry=volunteer" },
  { title: "Leave a Legacy", body: "Include the Foundation in your estate plans and be part of a lasting impact.", icon: "gift", cta: "Learn more", href: "/contact?enquiry=legacy" },
];

export default function SupportPage() {
  return (
    <>
      {/* Hero with the donation card — Altruva layout */}
      <section id="give" className="scroll-mt-24 bg-sand">
        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1fr_1.05fr] lg:py-20">
          <div>
            <h1 className="display-xl">Invest in a better tomorrow.</h1>
            <p className="lede mt-6 max-w-lg">
              Your support helps us keep life-changing books in people&rsquo;s hands, strengthen communities and invest in future generations. Together, we
              can preserve a legacy of faith, knowledge and service.
            </p>
            <blockquote className="mt-10 max-w-md border-l-4 border-bronze pl-5">
              <p className="text-xl text-ink">&ldquo;Give, and it shall be given unto you …&rdquo;</p>
              <cite className="mt-1 block text-sm text-muted not-italic">Luke 6:38 (KJV)</cite>
            </blockquote>
            <ul className="mt-10 space-y-4">
              {(
                [
                  ["book", "Print and freely distribute Christian literature"],
                  ["cap", "Support students, schools and learning initiatives"],
                  ["drop", "Fund community projects such as clean water"],
                ] as [IconName, string][]
              ).map(([icon, text]) => (
                <li key={text} className="flex items-center gap-4 text-ink">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-bronze text-white">
                    <Icon name={icon} className="size-5" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <GivePanel options={givingOptions()} />
        </div>
      </section>

      <section className="py-24">
        <div className="wrap">
          <Statement highlight="Many ways. One mission.">
            Choose the way that works best for you. Every contribution, in big or small measure, makes a difference.
          </Statement>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {ways.map((w) => (
              <a key={w.title} href={w.href} className="group tile flex flex-col p-6 transition-shadow hover:shadow-lg">
                <Icon name={w.icon} className="size-10 text-ink" strokeWidth={1.3} />
                <h3 className="display-sm mt-12 text-2xl">{w.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{w.body}</p>
                <span className="mt-6 flex items-center justify-between text-sm text-ink">
                  {w.cta}
                  <span className="flex size-8 items-center justify-center rounded-full bg-bronze text-white transition-transform group-hover:translate-x-0.5">
                    <Icon name="arrow" className="size-4" strokeWidth={2} />
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment/60 py-24">
        <div className="wrap">
          <h2 className="text-center text-[clamp(2.25rem,4.5vw,3.75rem)] tracking-[-0.01em] text-ink">Suggested Gifts</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted">A guide to what your gift can do — you choose the exact amount at checkout.</p>
          <div className="mt-14">
            <GiftTiers />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src="/images/generated/partnership-meeting.jpg" alt="Nigerian professionals concluding a partnership meeting" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <h2 className="display-lg">Corporate &amp; institutional support</h2>
            <p className="lede mt-6 max-w-md">
              We welcome partnerships with companies, foundations and institutions that share our vision for an informed, compassionate and opportunity-rich
              society — from sponsoring a print run to supporting community projects.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
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

      <ImageCta word="Give" title="A better tomorrow is possible" cta="Give Now" href="#give" image="/images/generated/family-reading.jpg" position="50% 48%" />
    </>
  );
}
