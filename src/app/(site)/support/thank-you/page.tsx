import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { SplitWords } from "@/components/motion/split-words";
import { Button, GoldRule, QuoteBlock } from "@/components/ui";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Thank You", description: "Thank you for your gift to the Chinwoke Mbadinuju Foundation.", path: "/support/thank-you" }),
  robots: { index: false },
};

// Bachs payment links redirect here after a successful payment (set in the Bachs dashboard).
export default function ThankYouPage() {
  return (
    <section className="bg-gradient-to-b from-[#f8ecd9] via-blush to-paper py-20 lg:py-28">
      <div className="wrap max-w-2xl text-center">
        <Icon name="heart" className="mx-auto size-14 text-bronze" strokeWidth={1.1} />
        <p data-reveal="fade" className="eyebrow mt-6">
          Support the mission
        </p>
        <h1 data-reveal="words" className="display-xl mt-4">
          <SplitWords>Thank You for Your Gift.</SplitWords>
        </h1>
        <GoldRule className="mx-auto mt-6" />
        <p data-reveal data-reveal-delay="250" className="mt-6 text-[1.08rem] leading-relaxed text-body">
          Your generosity helps keep life-changing books in people&rsquo;s hands and strengthens communities.
        </p>
        <p className="mt-4 text-muted">
          Questions about your gift? Write to{" "}
          <a className="text-bronze underline underline-offset-2" href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>
          .
        </p>
        <QuoteBlock text="Give, and it shall be given unto you." by="Luke 6:38 (KJV)" className="mt-10 [&_figcaption>span:first-child]:mx-auto" />
        <div data-reveal data-reveal-delay="400" className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/literature#library">Explore the Free Library</Button>
          <Button href="/" variant="outline" icon={null}>
            Back to Home
          </Button>
        </div>
      </div>
    </section>
  );
}
