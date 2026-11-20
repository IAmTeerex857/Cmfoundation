import type { Metadata } from "next";
import { FounderSubpageHero } from "@/components/founder-subpage-hero";
import { Icon } from "@/components/icons";
import { readerPage, tributeCount, tributeGroups } from "@/lib/legacy";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Burial Tributes",
  description: "Tributes and condolence letters on the passing of Dr Chinwoke Clement Mbadinuju (Odera), from his family, leaders in public life, the Church, Uli and friends.",
  path: "/founder/tributes",
});

// Every tribute in Destiny Fulfilled, listed individually with its source and date; each opens at its
// own page of the publication, so nobody has to search through the whole document.
export default function TributesPage() {
  return (
    <>
      <FounderSubpageHero eyebrow="A legacy that lives on" title="Burial Tributes">
        <p>
          When Dr Chinwoke Clement Mbadinuju (Odera) died on 11 April 2023, family, friends, colleagues, churches, communities and leaders across Nigeria wrote
          to honour him. These {tributeCount} tributes and condolence letters were gathered in <em>Destiny Fulfilled: The Life &amp; Times</em> for his state
          burial at Uli in November 2023.
        </p>
        <p className="text-[0.98rem] text-muted">Choose a tribute to open it at its page in the publication.</p>
      </FounderSubpageHero>

      <nav aria-label="Groups of tributes" className="border-b border-line bg-paper">
        <ul className="wrap flex gap-x-6 overflow-x-auto py-4 [scrollbar-width:none]">
          {tributeGroups.map((g) => (
            <li key={g.id} className="shrink-0">
              <a href={`#${g.id}`} className="text-[0.78rem] font-semibold tracking-[0.06em] whitespace-nowrap text-ink uppercase hover:text-bronze">
                {g.title} <span className="text-muted tabular-nums">({g.items.length})</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="wrap py-12 lg:py-16">
        {tributeGroups.map((g) => (
          <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="grid scroll-mt-28 gap-6 border-t border-line py-10 first:border-t-0 first:pt-0 lg:grid-cols-[16rem_1fr] lg:gap-16">
            <div>
              <h2 id={`${g.id}-title`} className="font-display text-2xl text-ink">
                {g.title}
              </h2>
              {g.note && <p className="mt-2 text-sm text-muted">{g.note}</p>}
            </div>
            <ul className="divide-y divide-line/80">
              {g.items.map((t) => (
                <li key={`${t.name}-${t.page}`}>
                  <a href={readerPage(t.page)} className="group flex items-start justify-between gap-6 py-4">
                    <span className="min-w-0">
                      <span className="block font-medium text-ink group-hover:text-bronze">{t.name}</span>
                      {(t.role || t.date) && (
                        <span className="mt-0.5 block text-sm leading-relaxed text-muted">{[t.role, t.date].filter(Boolean).join(" · ")}</span>
                      )}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 pt-0.5 text-sm text-muted tabular-nums group-hover:text-bronze">
                      p. {t.page} <Icon name="arrowUpRight" className="size-3.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
