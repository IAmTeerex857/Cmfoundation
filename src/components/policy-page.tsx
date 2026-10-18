import { site } from "@/lib/site";
import { SplitWords } from "./motion/split-words";

// TODO(client): replace with the Foundation's approved policy text.
export function PolicyPage({ title, intro }: { title: string; intro: string }) {
  return (
    <section className="bg-sand py-20">
      <div className="wrap max-w-3xl">
        <h1 data-reveal="words" className="display-xl">
          <SplitWords>{title}</SplitWords>
        </h1>
        <p data-reveal data-reveal-delay="250" className="lede mt-8 text-lg">
          {intro}
        </p>
        <p data-reveal data-reveal-delay="350" className="mt-4 leading-relaxed text-muted">
          The full {title.toLowerCase()} is being finalised and will be published here. For any questions in the meantime, please contact us at{" "}
          <a href={`mailto:${site.contact.email}`} className="text-bronze underline">
            {site.contact.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
