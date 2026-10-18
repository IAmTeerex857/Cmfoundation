import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { SplitWords } from "@/components/motion/split-words";
import { Button } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false },
};

// Bachs payment links redirect here after a successful payment (set in the Bachs dashboard).
export default function ThankYouPage() {
  return (
    <section className="bg-sand py-24">
      <div className="wrap max-w-2xl text-center">
        <span data-reveal="scale" className="mx-auto flex size-16 items-center justify-center rounded-full bg-bronze text-white">
          <Icon name="check" className="size-8" strokeWidth={1.75} />
        </span>
        <h1 data-reveal="words" className="display-lg mt-8">
          <SplitWords>Thank you for your gift.</SplitWords>
        </h1>
        <p data-reveal data-reveal-delay="250" className="lede mt-5 text-lg">
          Your generosity helps keep life-changing books in people&rsquo;s hands and strengthens communities.
        </p>
        <p className="mt-4 text-muted">
          Questions about your gift? Write to{" "}
          <a className="text-bronze underline" href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>
          .
        </p>
        <p className="mt-8 text-xl text-ink">&ldquo;Give, and it shall be given unto you.&rdquo;</p>
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
