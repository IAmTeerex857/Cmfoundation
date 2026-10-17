import { site } from "@/lib/site";

// TODO(client): replace with the Foundation's approved policy text.
export function PolicyPage({ title, intro }: { title: string; intro: string }) {
  return (
    <section className="bg-sand py-20">
      <div className="wrap max-w-3xl">
        <h1 className="display-xl">{title}</h1>
        <p className="lede mt-8 text-lg">{intro}</p>
        <p className="mt-4 leading-relaxed text-muted">
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
