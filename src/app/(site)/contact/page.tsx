import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SocialLinks } from "@/components/footer";
import { Icon, type IconName } from "@/components/icons";
import { Button, Faq, SectionHead } from "@/components/ui";
import { getBook } from "@/lib/books";
import { isEnquiryType } from "@/lib/enquiries";
import { faqs } from "@/lib/faqs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Chinwoke Mbadinuju Foundation — for questions, partnerships, media, events or to support our work.",
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { enquiry, book, event } = await searchParams;
  const bookTitle = typeof book === "string" ? getBook(book)?.title : undefined;
  const initialMessage = bookTitle
    ? `I would like to request a copy of "${bookTitle}".`
    : typeof event === "string"
      ? `I would like to register interest in "${event.slice(0, 150)}".`
      : "";

  const channels: { icon: IconName; title: string; value: string; href?: string; note: string }[] = [
    { icon: "mail", title: "Email us", value: site.contact.email, href: `mailto:${site.contact.email}`, note: "We aim to respond within 1–2 business days." },
    { icon: "phone", title: "Call us", value: site.contact.phone, href: site.contact.phoneHref, note: site.contact.hours },
    { icon: "pin", title: site.contact.officeName, value: site.contact.location, href: site.contact.mapsUrl, note: "Get directions on Google Maps." },
  ];

  return (
    <>
      <section className="bg-sand">
        <div className="wrap py-16 lg:py-24">
          <h1 className="display-xl max-w-4xl">Let&rsquo;s build a better tomorrow together.</h1>
          <p className="lede mt-6 max-w-xl">
            We would love to hear from you — whether you have a question, want to support our work, explore a partnership, or simply share your thoughts.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {channels.map((c) => (
              <a
                key={c.title}
                href={c.href}
                {...(c.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex flex-col rounded-2xl bg-cream p-6 transition-shadow hover:shadow-lg"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-bronze text-white">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <p className="mt-10 text-sm text-muted">{c.title}</p>
                <p className="display-sm mt-1 text-[1.6rem] break-words group-hover:text-bronze">{c.value}</p>
                <p className="mt-2 text-sm text-muted">{c.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="message" className="scroll-mt-24 py-24">
        <div className="wrap grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="display-lg">Send us a message</h2>
            <p className="mt-4 mb-8 text-muted">Kindly complete the form below and we will get back to you soon.</p>
            <ContactForm
              key={`${enquiry}-${book}-${event}`}
              initialEnquiry={isEnquiryType(enquiry) ? enquiry : undefined}
              initialMessage={initialMessage}
            />
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl bg-sand">
              <div className="relative aspect-[4/3]">
                <iframe
                  title="Map showing CMF Head Office in Asokoro, Abuja"
                  src={site.contact.mapsEmbedUrl}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="display-sm text-2xl">{site.contact.officeName}</p>
                  <p className="mt-1 text-sm text-muted">{site.contact.location}</p>
                </div>
                <a href={site.contact.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Get directions to CMF Head Office" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bronze text-white">
                  <Icon name="arrowUpRight" className="size-4" strokeWidth={2} />
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-navy p-6 text-white">
              <p className="text-tan">Follow us</p>
              <p className="mt-1 text-white/85">Stay connected for updates and new releases.</p>
              <SocialLinks className="mt-5 [&_a]:text-white [&_a:hover]:text-gold" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="wrap">
          <SectionHead title="Our contact points" aside="Reach the right team directly." />
          <div className="mt-12 grid gap-x-8 sm:grid-cols-2">
            {site.contactPoints.map((c) => (
              <div key={c.title} className="border-b border-ink/40 py-8">
                <Icon name={c.icon as IconName} className="size-11 text-ink" strokeWidth={1.3} />
                <h3 className="mt-4 text-xl font-medium text-ink">{c.title}</h3>
                <p className="mt-2 text-muted">{c.body}</p>
                <a href={`mailto:${c.email}`} className="mt-3 inline-flex items-center gap-2 text-ink hover:text-bronze">
                  {c.email} <Icon name="arrow" className="size-4" />
                </a>
                {"phone" in c && <p className="text-ink">{c.phone}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="wrap">
          <SectionHead center title="Quick answers" aside="Questions we're often asked." />
          <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <Faq items={[faqs.books, faqs.partner, faqs.inKind, faqs.invite]} />
            <div className="tile flex flex-col justify-between p-8">
              <div>
                <p className="text-[clamp(1.5rem,2.6vw,2rem)] leading-snug font-light text-ink">&ldquo;Alone we can do so little; together we can do so much.&rdquo;</p>
                <p className="mt-3 text-muted">— Helen Keller</p>
              </div>
              <div className="mt-10">
                <p className="text-muted">Whether you give, partner, volunteer or simply encourage us, you are part of a larger story.</p>
                <Button href="/support" className="mt-6">
                  Support the Mission
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
