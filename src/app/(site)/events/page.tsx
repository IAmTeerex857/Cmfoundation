import type { Metadata } from "next";
import { EventCard } from "@/components/event-card";
import { Icon } from "@/components/icons";
import { Button, Faq, GoldRule, PageHero, SectionIntro } from "@/components/ui";
import { faqs } from "@/lib/faqs";
import { upcomingEvents } from "@/lib/work";
import { pageMetadata } from "@/lib/metadata";

// Re-render daily so past events drop off.
export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({
  title: "Events",
  description: "Book presentations, launches and gatherings from the Chinwoke Mbadinuju Foundation.",
  path: "/events",
});

export default function EventsPage() {
  const upcoming = upcomingEvents();
  return (
    <>
      <PageHero
        eyebrow="Events & engagement"
        title="Where the Mission Comes Together."
        image={{ src: "/images/generated/literature-launch.jpg", alt: "A speaker at a lectern addressing guests at a CMF book presentation", position: "40% center" }}
        actions={
          <>
            <Button href="#upcoming">Upcoming Events</Button>
            <Button href="/contact?enquiry=events" variant="outline">
              Invite CMF
            </Button>
          </>
        }
      >
        <p>
          CMF events bring people together around literature, education, remembrance and community service, turning the Foundation&rsquo;s work into
          opportunities for participation and engagement.
        </p>
      </PageHero>

      <section id="upcoming" className="scroll-mt-24 py-16 lg:py-20">
        <div className="wrap">
          <SectionIntro eyebrow="What's next" title="Upcoming Events" rule />
          {upcoming.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => (
                <EventCard key={e.title} event={e} />
              ))}
            </div>
          ) : (
            <p data-reveal className="mt-6 text-muted">
              New events will be announced here soon. Subscribe to our newsletter for updates.
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-line py-16 lg:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionIntro eyebrow="Frequent questions" title="Quick Answers." size="md" />
            <div className="mt-8">
              <Faq items={[faqs.cac, faqs.invite, faqs.books, faqs.partner, faqs.volunteer]} />
            </div>
          </div>
          <div data-reveal="fade" className="flex flex-col bg-blush p-8 lg:self-start lg:p-10">
            <Icon name="calendar" className="size-11 text-bronze" strokeWidth={1.1} />
            <h2 className="display-md mt-5">Invite CMF</h2>
            <GoldRule className="mt-4" />
            <p className="mt-5 max-w-sm leading-relaxed text-body">
              Churches, schools, universities and community groups can invite the Foundation to present the Literature Series or speak on its work.
            </p>
            <Button href="/contact?enquiry=events" className="mt-8 self-start">
              Get in Touch
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
