import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { SocialLinks } from "@/components/footer";
import { Icon, type IconName } from "@/components/icons";
import { SplitWords } from "@/components/motion/split-words";
import { Button, Faq, GoldRule, PageHero, QuoteBlock, SectionIntro, SlideIcon } from "@/components/ui";
import { getBook } from "@/lib/books";
import { isEnquiryType } from "@/lib/enquiries";
import { faqs } from "@/lib/faqs";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: "Get in touch with the Chinwoke Mbadinuju Foundation for questions, partnerships, media, events or to support our work.",
  path: "/contact",
});

// Section order follows the Foundation's contact page design (../drive_assets/7 CMF Contact Us 26.png).
export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { enquiry, book, event } = await searchParams;
  const bookTitle = typeof book === "string" ? getBook(book)?.title : undefined;
  const initialMessage = bookTitle
    ? `I would like to request a copy of "${bookTitle}".`
    : typeof event === "string"
      ? `I would like to register interest in "${event.slice(0, 150)}".`
      : "";

  const channels: { icon: IconName; title: string; value: string; href?: string; note: string }[] = [
    { icon: "mail", title: "Email Us", value: site.contact.email, href: `mailto:${site.contact.email}`, note: "We aim to respond within 1–2 business days." },
    { icon: "phone", title: "Call Us", value: site.contact.phone, href: site.contact.phoneHref, note: site.contact.hours },
    { icon: "pin", title: "Visit Us", value: site.contact.location, href: site.contact.mapsUrl, note: "By appointment." },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Let’s Build a Better Tomorrow Together."
        image={{ src: "/images/generated/literature-archive.jpg", alt: "A quiet reading room with books laid out on a wooden table", position: "60% center" }}
        aside={<QuoteBlock text="Give, and it shall be given unto you…" by="Luke 6:38 (KJV)" />}
        footer={
          <>
            <GoldRule />
            <p className="eyebrow mt-6">{site.tagline}</p>
          </>
        }
      >
        <p className="max-w-[27rem]">
          We would love to hear from you, whether you have a question, want to support our work, explore a partnership, or simply share your thoughts.
        </p>
      </PageHero>

      {/* Channels */}
      <section className="border-b border-line py-16 lg:py-20">
        <div className="wrap">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionIntro eyebrow="Get in touch" title="We’re Just a Message Away." />
            <p data-reveal data-reveal-delay="200" className="max-w-sm leading-relaxed text-body lg:pb-2">
              Reach out through any of the channels below. We aim to respond within 1–2 business days.
            </p>
          </div>

          <div className="tile mt-10 grid gap-y-10 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line lg:px-0">
            {channels.map((c, i) => (
              <a
                key={c.title}
                href={c.href}
                {...(c.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                data-reveal
                data-reveal-delay={String(i * 90)}
                className="group flex flex-col items-center px-6 text-center"
              >
                <Icon name={c.icon} className="size-11 text-bronze transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1" strokeWidth={1.2} />
                <h3 className="display-sm mt-4">{c.title}</h3>
                <p className="mt-1 font-medium break-words text-ink transition-colors group-hover:text-bronze">{c.value}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{c.note}</p>
              </a>
            ))}
            <div data-reveal data-reveal-delay="270" className="flex flex-col items-center px-6 text-center">
              <SocialLinks className="justify-center [&_a]:size-9 [&_a]:text-bronze [&_a]:ring-1 [&_a]:ring-bronze/60 [&_a:hover]:bg-bronze [&_a:hover]:text-white [&_svg]:size-4" />
              <h3 className="display-sm mt-4">Follow Us</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">Stay connected for updates and new releases.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form, map and contact points */}
      <section id="message" className="scroll-mt-24 border-b border-line py-16 lg:py-20">
        <div className="wrap grid gap-12 lg:grid-cols-[1.15fr_0.95fr_1fr] lg:gap-0">
          <div className="lg:pr-10">
            <p data-reveal="fade" className="eyebrow">
              Send us a message
            </p>
            <h2 data-reveal="words" className="display-lg mt-3">
              <SplitWords>We’re Here to Help.</SplitWords>
            </h2>
            <p data-reveal className="mt-3 mb-7 text-body">
              Kindly complete the form below and we will get back to you soon.
            </p>
            <ContactForm
              key={`${enquiry}-${book}-${event}`}
              initialEnquiry={isEnquiryType(enquiry) ? enquiry : undefined}
              initialMessage={initialMessage}
            />
          </div>

          <div className="lg:border-l lg:border-line lg:px-8">
            <div data-reveal="fade" className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line bg-blush lg:aspect-[5/4]">
              <iframe
                title="Map showing CMF Head Office in Asokoro, Abuja"
                src={site.contact.mapsEmbedUrl}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div data-reveal className="mt-6 flex gap-4">
              <Icon name="pin" className="mt-1 size-7 shrink-0 text-bronze" strokeWidth={1.3} />
              <div>
                <h3 className="display-sm">Our Location</h3>
                <p className="mt-1 text-body">{site.contact.location}</p>
                <p className="text-sm text-muted">(By appointment only)</p>
                <a
                  href={site.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 inline-flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.06em] text-bronze uppercase transition-colors hover:text-bronze-dark"
                >
                  Get directions
                  <SlideIcon name="arrow" className="size-4" />
                </a>
              </div>
            </div>
          </div>

          <div data-reveal="fade" className="self-start bg-blush p-6 sm:p-7">
            <p className="eyebrow">Our contact points</p>
            <ul className="mt-2 divide-y divide-line">
              {site.contactPoints.map((c) => (
                <li key={c.title} className="flex gap-4 py-5 last:pb-0">
                  <Icon name={c.icon as IconName} className="size-9 shrink-0 text-bronze" strokeWidth={1.2} />
                  <div className="min-w-0">
                    <h3 className="font-display text-[1.25rem] leading-snug text-ink">{c.title}</h3>
                    <a href={`mailto:${c.email}`} className="block break-words text-ink transition-colors hover:text-bronze">
                      {c.email}
                    </a>
                    {"phone" in c && (
                      <a href={site.contact.phoneHref} className="block text-ink transition-colors hover:text-bronze">
                        {c.phone}
                      </a>
                    )}
                    <p className="mt-1 text-sm leading-relaxed text-muted">{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ and closing quote */}
      <section className="overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="px-5 py-16 sm:px-8 lg:py-20 lg:pr-12 lg:pl-[max(2rem,calc((100vw-1140px)/2))]">
            <SectionIntro eyebrow="Frequently asked questions" title="Quick Answers." />
            <div className="mt-8">
              <Faq items={[faqs.books, faqs.partner, faqs.inKind, faqs.invite]} />
            </div>
          </div>
          <div className="relative isolate flex items-center overflow-hidden bg-blush px-5 py-16 sm:px-8 lg:py-20 lg:pr-[max(2rem,calc((100vw-1140px)/2))] lg:pl-12">
            <div className="absolute inset-0 -z-10">
              <Image src="/images/stock/seedling-hands.jpg" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[75%_center]" />
              <div className="absolute inset-0 bg-gradient-to-r from-blush from-30% via-blush/75 to-transparent max-lg:via-blush/85 max-lg:to-blush/50" />
            </div>
            <div data-reveal="fade" className="max-w-sm">
              <QuoteBlock text="Alone we can do so little; together we can do so much." by="Helen Keller" />
              <p className="mt-6 leading-relaxed text-body">
                Whether you give, partner, volunteer or simply encourage us, you are part of a larger story: a more informed, compassionate and opportunity-rich
                society.
              </p>
              <Button href="/support" className="mt-8">
                Support the Mission
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
