import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SocialLinks } from "@/components/footer";
import { Icon, type IconName } from "@/components/icons";
import { SplitWords } from "@/components/motion/split-words";
import { Button, Faq, SectionHead, SlideIcon } from "@/components/ui";
import { getBook } from "@/lib/books";
import { isEnquiryType } from "@/lib/enquiries";
import { faqs } from "@/lib/faqs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Chinwoke Mbadinuju Foundation for questions, partnerships, media, events or to support our work.",
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
      <section className="relative overflow-hidden bg-sand">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-32 size-[34rem] rounded-full bg-gold/20 blur-3xl" />
        <div className="wrap relative py-16 lg:py-24">
          <p data-reveal="fade" className="eyebrow">
            Contact us
          </p>
          <h1 data-reveal="words" className="display-xl mt-4 max-w-4xl">
            <SplitWords>Let&rsquo;s build a better tomorrow together.</SplitWords>
          </h1>
          <p data-reveal data-reveal-delay="300" className="lede mt-6 max-w-xl">
            We would love to hear from you, whether you have a question, want to support our work, explore a partnership, or simply share your thoughts.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {channels.map((c) => (
              <a
                key={c.title}
                href={c.href}
                {...(c.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                data-reveal
                className="group flex flex-col rounded-3xl bg-cream p-6 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-28px_rgba(14,33,50,0.5)]"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-bronze text-white transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-rotate-12">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <p className="mt-10 text-sm text-muted">{c.title}</p>
                <p className="display-sm mt-1 text-[1.35rem] break-words transition-colors group-hover:text-bronze">{c.value}</p>
                <p className="mt-2 text-sm text-muted">{c.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="message" className="scroll-mt-24 py-24">
        <div className="wrap grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 data-reveal="words" className="display-lg">
              <SplitWords>Send us a message</SplitWords>
            </h2>
            <p data-reveal className="mt-4 mb-8 text-muted">
              Kindly complete the form below and we will get back to you soon.
            </p>
            <ContactForm
              key={`${enquiry}-${book}-${event}`}
              initialEnquiry={isEnquiryType(enquiry) ? enquiry : undefined}
              initialMessage={initialMessage}
            />
          </div>

          <div className="space-y-6">
            <div data-reveal="clip" className="overflow-hidden rounded-3xl bg-sand">
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
                <a href={site.contact.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Get directions to CMF Head Office" className="group flex size-10 shrink-0 items-center justify-center rounded-full bg-bronze text-white transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110">
                  <SlideIcon name="arrowUpRight" />
                </a>
              </div>
            </div>
            <div data-reveal className="rounded-3xl bg-navy p-6 text-white">
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
              <div key={c.title} data-reveal className="rule-draw group py-8 text-ink">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-sand text-ink transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:bg-bronze group-hover:text-white">
                  <Icon name={c.icon as IconName} className="size-7" strokeWidth={1.4} />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-ink">{c.title}</h3>
                <p className="mt-2 text-muted">{c.body}</p>
                <a href={`mailto:${c.email}`} className="group/mail mt-3 inline-flex items-center gap-2 text-ink transition-colors hover:text-bronze">
                  {c.email} <Icon name="arrow" className="size-4 transition-transform group-hover/mail:translate-x-1" />
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
            <div data-reveal="scale" className="tile flex flex-col justify-between p-8">
              <div>
                <p className="text-[clamp(1.5rem,2.6vw,2rem)] leading-snug font-light text-ink">&ldquo;Alone we can do so little; together we can do so much.&rdquo;</p>
                <p className="mt-3 text-muted">Helen Keller</p>
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
