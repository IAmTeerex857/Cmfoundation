import { suggestedGifts, naira } from "@/lib/giving";
import { Icon } from "./icons";
import { Beam } from "./motion/beam";
import { CountUp } from "./motion/count-up";
import { Spotlight } from "./motion/spotlight";
import { SlideIcon } from "./ui";

const tones = [
  { card: "bg-parchment text-ink", panel: "bg-white/70", muted: "text-muted", chip: "bg-bronze text-white", check: "bg-bronze/10 text-bronze", button: "bg-ink text-white hover:bg-navy" },
  { card: "bg-bronze text-white", panel: "bg-white/10", muted: "text-white/80", chip: "bg-white text-bronze", check: "bg-white/15 text-white", button: "bg-white text-bronze hover:bg-cream" },
  { card: "bg-navy text-white", panel: "bg-white/[0.06]", muted: "text-white/75", chip: "bg-gold text-ink", check: "bg-gold/15 text-gold", button: "bg-gold text-ink hover:bg-[#e2b93b]" },
];

/**
 * Suggested gifts, after RiseUp's pricing-style donation rows. Amounts are a guide: the checkout
 * opens with its own default, so each card tells the donor what to enter.
 */
export function GiftTiers({ href }: { href: string }) {
  const external = href.startsWith("http");
  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-3 lg:gap-6">
      {suggestedGifts.map((g, i) => {
        const t = tones[i % tones.length];
        const featured = i === 1;
        const card = (
          <Spotlight
            className={`group flex h-full flex-col rounded-[28px] p-2 transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_40px_70px_-40px_rgba(14,33,50,0.6)] ${t.card}`}
          >
            <div className={`rounded-[22px] p-6 sm:p-7 ${t.panel}`}>
              <div className="flex items-center justify-between">
                <span
                  className={`flex size-12 items-center justify-center rounded-2xl transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110 ${t.chip}`}
                >
                  <Icon name={g.icon} className="size-6" strokeWidth={1.6} />
                </span>
                <span className={`rounded-full border px-3 py-1 text-xs ${featured ? "border-white/30" : i === 2 ? "border-white/20" : "border-ink/15"}`}>Suggested gift</span>
              </div>
              <p className="mt-8 font-display text-[3.25rem] leading-none font-semibold tracking-[-0.05em]">
                <span className={`mr-1 align-[0.35em] text-2xl ${t.muted}`}>₦</span>
                <CountUp value={g.amount} duration={1.8} />
              </p>
              <p className={`mt-2 text-sm ${t.muted}`}>or any amount you choose</p>
              <h3 className="mt-7 font-display text-2xl font-semibold tracking-[-0.03em]">{g.title}</h3>
              <p className={`mt-2 leading-relaxed ${t.muted}`}>{g.body}</p>
            </div>

            <ul className="flex-1 space-y-3.5 px-6 pt-6 pb-2 sm:px-7">
              {g.points.map((p, n) => (
                <li key={p} className="flex items-center gap-3">
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 ${t.check}`}
                    style={{ transitionDelay: `${n * 70}ms` }}
                  >
                    <Icon name="check" className="size-3.5" strokeWidth={2.6} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="p-4 pt-5 sm:p-5">
              <a
                href={href}
                {...(external ? { rel: "noopener" } : {})}
                className={`sheen flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 font-medium transition-[background-color,transform] duration-300 active:scale-[0.98] ${t.button}`}
              >
                Give {naira(g.amount)}
                <SlideIcon name="arrowUpRight" />
              </a>
              {external && <p className={`mt-3 text-center text-xs ${t.muted}`}>Enter {naira(g.amount)} on the checkout page</p>}
            </div>
          </Spotlight>
        );
        return (
          <div key={g.id} data-reveal className={featured ? "lg:-translate-y-6" : ""}>
            {featured ? <Beam borderRadius={28}>{card}</Beam> : card}
          </div>
        );
      })}
    </div>
  );
}
