import type { Metadata } from "next";
import Link from "next/link";
import { TrackView } from "@/components/books/track-view";
import { GiveCard } from "@/components/give-card";
import { Icon, type IconName } from "@/components/icons";
import { Button, Faq, GoldRule, PageHero, QuoteBlock, SectionIntro } from "@/components/ui";
import { faqs } from "@/lib/faqs";
import { givingFocuses, nonprofitStatement } from "@/lib/giving";
import { bankTransfer, givingOptions } from "@/lib/payment-links";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Support the Mission",
  description:
    "Read freely, support voluntarily. Our publications are free to read online. Those who wish may support the Foundation through gifts, book purchases, sponsorships and partnerships.",
  path: "/support",
});

// The six support pathways (instructions §8.2). Gifts to a cause go to that cause's checkout;
// sponsorship and in-kind help start as an enquiry.
const pathways: { title: string; body: string; icon: IconName; cta: string; href: string }[] = [
  ...givingFocuses.map((f) => ({ title: f.title, body: f.body, icon: f.icon, cta: "Give", href: `/give/${f.id}` })),
  {
    title: "Institutional sponsorship and project collaboration",
    body: "For organisations that wish to sponsor or jointly fund a specific project.",
    icon: "handshake",
    cta: "Propose a partnership",
    href: "/contact?enquiry=partnership",
  },
  {
    title: "In-kind professional or material assistance",
    body: "Printing, equipment, materials or professional services offered directly.",
    icon: "gift",
    cta: "Offer assistance",
    href: "/contact?enquiry=inkind",
  },
];

const arrangements = [
  "Full project sponsorship",
  "Jointly funded projects",
  "Educational scholarship sponsorship",
  "Book-printing sponsorship",
  "Institutional book distribution",
  "Technical or professional collaboration",
  "Direct provision of equipment, materials or services",
];

export default function SupportPage() {
  const options = givingOptions();
  return (
    <>
      <TrackView event="donation_page_view" params={{ page: "support" }} />
      <PageHero
        eyebrow="Support the mission"
        title="Read Freely. Support Voluntarily."
        image={{ src: "/images/support-hero.jpg", alt: "A young seedling growing from rich soil in warm morning light", position: "55% center" }}
        aside={<QuoteBlock text={<>Give, and it shall be given unto you&hellip;</>} by="Luke 6:38 (KJV)" />}
        actions={
          <>
            <Button href="#give">Give Online</Button>
            <Button href="#ways" variant="outline">
              Other Ways to Help
            </Button>
          </>
        }
      >
        <p>
          Our publications are made available online without charge. Those who wish to support the Foundation may do so through voluntary contributions,
          book purchases, sponsorships, partnerships and other forms of collaboration.
        </p>
      </PageHero>

      {/* Six pathways */}
      <section id="ways" className="scroll-mt-24 border-t border-line py-16 lg:py-20">
        <div className="wrap">
          <SectionIntro eyebrow="Ways to support" title="Choose What You Would Like to Support" />
          <p className="mt-4 max-w-2xl leading-relaxed text-body">
            Reading is never conditional on giving. If you choose to help, you can direct your support to a particular purpose.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pathways.map((w) => (
              <article key={w.title} className="tile flex flex-col p-6">
                <Icon name={w.icon} className="size-10 text-bronze" strokeWidth={1.2} />
                <h3 className="display-sm mt-4">{w.title}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-muted">{w.body}</p>
                <Button href={w.href} variant="outline" className="mt-6 self-start" prefetch={false}>
                  {w.cta}
                </Button>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Ordering printed books for a school, church or organisation? That is a purchase, not a donation:{" "}
            <Link href="/books/order" className="text-bronze underline">
              order institutional and commemorative copies
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Give online */}
      <section id="give" className="scroll-mt-24 bg-blush py-16 lg:py-20">
        <div className="wrap grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <SectionIntro eyebrow="Give online" title="A Voluntary Gift, Directed Where You Choose." rule>
              <p className="max-w-md">
                Choose a purpose, then give any amount on our payment partner&rsquo;s secure checkout. Your card or bank details never pass through this
                website.
              </p>
            </SectionIntro>
            <div className="mt-8 border-l-2 border-bronze/50 pl-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-bronze uppercase">Our nonprofit principle</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-body">{nonprofitStatement}</p>
            </div>
            {bankTransfer && (
              <div className="tile mt-8 p-6">
                <p className="text-xs font-semibold tracking-[0.14em] text-bronze uppercase">Local bank transfer</p>
                <dl className="mt-3 grid grid-cols-[8rem_1fr] gap-y-2 text-[0.95rem]">
                  <dt className="text-muted">Bank</dt>
                  <dd className="text-ink">{bankTransfer.bank}</dd>
                  <dt className="text-muted">Account name</dt>
                  <dd className="text-ink">{bankTransfer.accountName}</dd>
                  <dt className="text-muted">Account number</dt>
                  <dd className="font-semibold text-ink tabular-nums">{bankTransfer.accountNumber}</dd>
                </dl>
                {bankTransfer.note && <p className="mt-3 text-sm text-muted">{bankTransfer.note}</p>}
              </div>
            )}
          </div>
          <GiveCard hasCheckout={options.length > 0} email={site.contact.email} />
        </div>
      </section>

      {/* Project partnerships (§8.3) */}
      <section id="partnerships" className="scroll-mt-24 py-16 lg:py-20">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionIntro eyebrow="Institutional partnerships" title="Propose or Sponsor a Project" size="md">
              <p>
                Organisations may propose or sponsor specific projects in literature, education and community development. Each proposal is assessed and
                approved by the Foundation before it is represented as a CMF initiative.
              </p>
            </SectionIntro>
            <Button href="/contact?enquiry=partnership" className="mt-8">
              Start a Conversation
            </Button>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-bronze uppercase">Possible arrangements</p>
            <GoldRule className="mt-3" />
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {arrangements.map((a) => (
                <li key={a} className="flex items-start gap-3 text-ink">
                  <Icon name="check" className="mt-1 size-4 shrink-0 text-bronze" strokeWidth={2} />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="border-t border-line bg-paper py-16 lg:py-20">
        <div className="wrap max-w-3xl">
          <SectionIntro eyebrow="Frequent questions" title="Common Questions" />
          <div className="mt-8">
            <Faq items={[faqs.free, faqs.secure, faqs.project, faqs.use, faqs.orders, faqs.inKind, faqs.partner, faqs.cac]} />
          </div>
        </div>
      </section>
    </>
  );
}
