import { site } from "@/lib/site";
import { SplitWords } from "./motion/split-words";
import { Button, GoldRule } from "./ui";

// TODO(client): replace with the Foundation's approved policy text.
export function PolicyPage({ title, intro }: { title: string; intro: string }) {
  return (
    <>
      <section className="border-b border-line bg-gradient-to-r from-[#f8ecd9] via-blush to-blush py-16 lg:py-20">
        <div className="wrap">
          <p data-reveal="fade" className="eyebrow">
            {site.name}
          </p>
          <h1 data-reveal="words" className="display-xl mt-4">
            <SplitWords>{title}</SplitWords>
          </h1>
          <GoldRule className="mt-7" />
        </div>
      </section>
      <section className="py-16 lg:py-20">
        <div className="wrap max-w-3xl xl:ml-[max(0px,calc((100vw-1140px)/2))]">
          <p data-reveal className="text-[1.15rem] leading-relaxed text-body">
            {intro}
          </p>
          <p data-reveal data-reveal-delay="100" className="mt-5 leading-relaxed text-muted">
            The full {title.toLowerCase()} is being finalised and will be published here. For any questions in the meantime, please contact us at{" "}
            <a href={`mailto:${site.contact.email}`} className="text-bronze underline underline-offset-2">
              {site.contact.email}
            </a>
            .
          </p>
          <div data-reveal data-reveal-delay="200">
            <Button href="/contact" variant="outline" className="mt-10">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
