import type { Metadata } from "next";
import Link from "next/link";
import { TrackView } from "@/components/books/track-view";
import { GiveCard } from "@/components/give-card";
import { Icon } from "@/components/icons";
import { Faq, PageHero, QuoteBlock, SectionIntro } from "@/components/ui";
import { faqs } from "@/lib/faqs";
import { nonprofitStatement } from "@/lib/giving";
import { bankTransfer, givingOptions } from "@/lib/payment-links";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Support the Mission",
  description:
    "Read freely, support voluntarily. Our publications are free to read online. Those who wish may help the Foundation continue its literary, educational and humanitarian work.",
  path: "/support",
});

// The Support page, simplified as the further instructions ask (20 November 2026, §6): one short
// introduction, one donation action, and the optional purposes a gift can go to. The chosen purpose
// travels with the gift to its own checkout (/give/<category>), so nobody has to email afterwards.
export default function SupportPage() {
  const options = givingOptions();
  return (
    <>
      <TrackView event="donation_page_view" params={{ page: "support" }} />
      <PageHero
        eyebrow="Read freely. Support voluntarily."
        title="Help Us Continue the Work."
        image={{ src: "/images/support-hero.jpg", alt: "A young seedling growing from rich soil in warm morning light", position: "55% center" }}
        aside={<QuoteBlock text={<>Give, and it shall be given unto you&hellip;</>} by="Luke 6:38 (KJV)" />}
      >
        <p>
          Every book in our library is free to read, and always will be. If you would like to help the Foundation keep publishing, keep children in school
          and serve communities, you can give to the work of your choice below. It is entirely voluntary.
        </p>
      </PageHero>

      {/* The one donation action */}
      <section id="give" className="scroll-mt-24 bg-blush py-16 lg:py-20">
        <div className="wrap grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <SectionIntro eyebrow="Give online" title="Choose Where Your Gift Goes." rule>
              <p className="max-w-md">
                Pick a purpose, then give any amount on our payment partner&rsquo;s secure checkout. Your gift is recorded against that purpose, and your
                card or bank details never pass through this website.
              </p>
            </SectionIntro>
            <div className="mt-8 border-l-2 border-bronze/50 pl-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-bronze uppercase">Our nonprofit principle</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-body">{nonprofitStatement}</p>
            </div>
            {bankTransfer && (
              <div className="tile mt-8 p-6">
                <p className="text-xs font-semibold tracking-[0.14em] text-bronze uppercase">Local bank transfer</p>
                <dl className="mt-3 grid grid-cols-[9.5rem_1fr] gap-x-3 gap-y-2 text-[0.95rem]">
                  <dt className="text-muted">Bank</dt>
                  <dd className="text-ink">{bankTransfer.bank}</dd>
                  <dt className="text-muted">Account name</dt>
                  <dd className="text-ink">{bankTransfer.accountName}</dd>
                  <dt className="text-muted">{bankTransfer.accountNumbers.length > 1 ? "Account numbers" : "Account number"}</dt>
                  <dd className="font-semibold text-ink tabular-nums">
                    {bankTransfer.accountNumbers.map((n) => (
                      <span key={n} className="block select-all">
                        {n}
                      </span>
                    ))}
                  </dd>
                </dl>
                {bankTransfer.note && <p className="mt-3 text-sm text-muted">{bankTransfer.note}</p>}
              </div>
            )}
          </div>
          <div>
            <GiveCard hasCheckout={options.length > 0} email={site.contact.email} />
            {/* Partnerships: the fifth way to support, which starts as a conversation rather than a payment */}
            <div className="mt-4 flex items-start gap-4 rounded-[3px] border border-line bg-white/70 p-5">
              <Icon name="handshake" className="size-8 shrink-0 text-bronze" strokeWidth={1.2} />
              <p className="text-[0.95rem] leading-relaxed text-body">
                <span className="font-medium text-ink">Partnerships and in-kind help.</span> To sponsor or co-fund a project, or to offer printing,
                equipment or professional services,{" "}
                <Link href="/contact#collaborate" className="text-bronze underline underline-offset-2">
                  propose a collaboration
                </Link>
                .
              </p>
            </div>
            <p className="mt-4 text-sm text-muted">
              Ordering printed books for a school, church or organisation is a purchase, not a donation:{" "}
              <Link href="/books/order" className="text-bronze underline">
                order institutional copies
              </Link>
              .
            </p>
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
