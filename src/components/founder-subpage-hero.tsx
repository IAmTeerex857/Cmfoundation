import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icons";
import { GoldRule } from "./ui";

/** The header for the founder's sub-pages (gallery, interviews, tributes). */
export function FounderSubpageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="bg-gradient-to-r from-[#fcf5ea] via-blush to-blush">
      <div className="wrap py-14 lg:py-16">
        <Link
          href="/founder#legacy"
          className="inline-flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.06em] text-bronze uppercase transition-colors hover:text-bronze-dark"
        >
          <Icon name="arrowLeft" className="size-4" /> Back to the Founder
        </Link>
        <p className="eyebrow mt-8">{eyebrow}</p>
        <h1 className="display-xl mt-4 max-w-4xl">{title}</h1>
        <GoldRule className="mt-6" />
        {children && <div className="mt-6 max-w-2xl space-y-3 text-[1.08rem] leading-relaxed text-body">{children}</div>}
      </div>
    </section>
  );
}
