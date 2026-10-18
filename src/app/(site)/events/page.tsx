import type { Metadata } from "next";
import { EventCard } from "@/components/event-card";
import { SplitWords } from "@/components/motion/split-words";
import { Button, Faq, SectionHead } from "@/components/ui";
import { faqs } from "@/lib/faqs";
import { upcomingEvents } from "@/lib/work";

// Re-render daily so past events drop off.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Events",
  description: "Book presentations, launches and gatherings from the Chinwoke Mbadinuju Foundation.",
};

export default function EventsPage() {
  const upcoming = upcomingEvents();
  return (
    <>
      <section className="relative overflow-hidden bg-sand">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-0 size-[32rem] rounded-full bg-gold/20 blur-3xl" />
        <div className="wrap relative py-16 lg:py-24">
          <p data-reveal="fade" className="eyebrow">
            Events
          </p>
          <h1 data-reveal="words" className="display-xl mt-4 max-w-4xl">
            <SplitWords>Where the mission comes together.</SplitWords>
          </h1>
          <p data-reveal data-reveal-delay="300" className="lede mt-6 max-w-xl">
            CMF events bring people together around literature, education, remembrance and community service, turning the Foundation&rsquo;s work into
            opportunities for participation and engagement.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="wrap">
          <SectionHead title="Upcoming events" />
          {upcoming.length > 0 ? (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e, i) => (
                <EventCard key={e.title} event={e} index={i} />
              ))}
            </div>
          ) : (
            <p data-reveal className="mt-6 text-muted">New events will be announced here soon. Subscribe to our newsletter for updates.</p>
          )}
        </div>
      </section>

      <section className="pb-24">
        <div className="wrap grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Faq items={[faqs.invite, faqs.books, faqs.partner]} />
          <div data-reveal="scale" className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-navy p-8 text-white">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -bottom-20 size-64 animate-float rounded-full bg-gold/15 blur-2xl motion-reduce:animate-none" />
            <div className="relative">
              <h2 className="display-md text-white">Invite CMF</h2>
              <p className="mt-4 max-w-sm text-white/80">
                Churches, schools, universities and community groups can invite the Foundation to present the Literature Series or speak on its work.
              </p>
            </div>
            <Button href="/contact?enquiry=events" className="relative mt-10 self-start">
              Get in Touch
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
