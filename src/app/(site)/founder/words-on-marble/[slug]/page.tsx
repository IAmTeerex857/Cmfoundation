import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FounderSubpageHero } from "@/components/founder-subpage-hero";
import { Icon } from "@/components/icons";
import { getInterview, interviews, readerPage } from "@/lib/legacy";
import { pageMetadata } from "@/lib/metadata";

// Words on Marble: each interview on its own page, with its date, source and a short introduction
// (further instructions, 20 November 2026, §2).
export const dynamicParams = false;

export function generateStaticParams() {
  return interviews.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/founder/words-on-marble/[slug]">): Promise<Metadata> {
  const iv = getInterview((await params).slug);
  if (!iv) return {};
  return pageMetadata({ title: `${iv.dateline}: ${iv.title.replace(/[“”]/g, "")}`, description: iv.intro, path: `/founder/words-on-marble/${iv.slug}` });
}

export default async function InterviewPage({ params }: PageProps<"/founder/words-on-marble/[slug]">) {
  const iv = getInterview((await params).slug);
  if (!iv) notFound();
  const other = interviews.find((i) => i.slug !== iv.slug)!;

  return (
    <>
      <FounderSubpageHero eyebrow={`Words on Marble · ${iv.dateline}`} title={iv.title}>
        <p>{iv.intro}</p>
      </FounderSubpageHero>

      <section className="py-14 lg:py-16">
        <div className="wrap grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <dl className="grid grid-cols-[5rem_1fr] gap-x-4 gap-y-3 border-t border-line pt-5 text-[0.92rem] lg:grid-cols-1 lg:gap-y-1">
              <dt className="text-muted">Date</dt>
              <dd className="text-ink lg:mb-3">{iv.date}</dd>
              <dt className="text-muted">Source</dt>
              <dd className="text-ink lg:mb-3">{iv.source}</dd>
              <dt className="text-muted">Published in</dt>
              <dd className="text-ink">
                Destiny Fulfilled: The Life &amp; Times, pp. {iv.pages[0]}–{iv.pages[1]}
              </dd>
            </dl>
            <a href={readerPage(iv.pages[0])} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-bronze hover:text-bronze-dark">
              See the original pages <Icon name="arrowUpRight" className="size-3.5" />
            </a>
          </aside>

          <article className="max-w-[42rem] space-y-5 text-[1.08rem] leading-[1.75] text-body">
            {iv.body.map((b, i) =>
              typeof b === "string" ? (
                <p key={i}>{b}</p>
              ) : (
                <h2 key={i} className="pt-4 font-display text-[1.4rem] leading-snug text-ink">
                  {b.q}
                </h2>
              ),
            )}
          </article>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-12">
        <div className="wrap flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted">
            Also in Words on Marble: <span className="text-ink">{other.dateline}</span>, {other.source}.
          </p>
          <Link href={`/founder/words-on-marble/${other.slug}`} className="inline-flex items-center gap-2 font-medium text-bronze hover:text-bronze-dark">
            Read the {other.dateline.replace("Dateline ", "")} interview <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
