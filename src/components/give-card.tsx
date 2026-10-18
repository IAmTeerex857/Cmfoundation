"use client";

import { Liquid } from "liquid-gooey";
import { AnimatePresence, motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { givingFocuses, MIN_GIFT, naira } from "@/lib/giving";
import type { GivingOption } from "@/lib/payment-links";
import { Icon, type IconName } from "./icons";
import { Beam } from "./motion/beam";
import { Metal } from "./motion/metal";
import { SlideIcon } from "./ui";

const ease = [0.16, 1, 0.3, 1] as const;

const trust: { icon: IconName; label: string }[] = [
  { icon: "lock", label: "Secure checkout" },
  { icon: "card", label: "Card or bank transfer" },
  { icon: "check", label: `Any amount from ${naira(MIN_GIFT)}` },
];

// The donation card in the Support hero. Donors pick what they'd like to support (a liquid pill
// slides between the choices), then continue to the hosted checkout, where they enter the amount.
// The checkout can't carry the choice, so for a specific cause the card offers a prefilled email.
export function GiveCard({ options, email }: { options: GivingOption[]; email: string }) {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [thumb, setThumb] = useState({ x: 0, w: 0 });

  const [primary, ...others] = options;
  const focus = givingFocuses[active];

  useLayoutEffect(() => {
    const measure = () => {
      const b = buttons.current[active];
      if (b) setThumb({ x: b.offsetLeft, w: b.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (tabsRef.current) ro.observe(tabsRef.current);
    return () => ro.disconnect();
  }, [active]);

  const mail = `mailto:${email}?subject=${encodeURIComponent(`My gift to CMF: ${focus.title}`)}&body=${encodeURIComponent(
    `Hello CMF team,\n\nI have just made a gift and would like it to support: ${focus.title}.\n\nThank you.`,
  )}`;

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + givingFocuses.length) % givingFocuses.length;
    setActive(next);
    buttons.current[next]?.focus();
  };

  return (
    <div data-reveal="scale" data-reveal-delay="200" className="self-start">
      <Beam borderRadius={28}>
        <div className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-[0_40px_80px_-40px_rgba(14,33,50,0.45)] backdrop-blur-xl sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow">Make a gift</p>
            <span className="flex items-center gap-2 rounded-full bg-sand px-3 py-1 text-xs text-ink">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-bronze/60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-bronze" />
              </span>
              Secure
            </span>
          </div>
          <h2 className="display-md mt-3">Give securely online</h2>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">Choose what you&rsquo;d like to support, then give any amount on our secure checkout.</p>

          {/* What to support: a liquid pill trails the selection. */}
          <div ref={tabsRef} className="relative mt-6 rounded-full bg-sand p-1">
            {/* Liquid forces position: relative on its root, so it sits inside its own positioned layer. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-1">
              <Liquid fill="var(--color-ink)" blur={5} contrast={16} shadow="0 6px 16px rgba(14,33,50,0.25)" className="h-full w-full">
                <Liquid.Item effect="move" move={{ springiness: 0.55, wobble: 0.5, trail: 0.5 }}>
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-[transform,width] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
                    style={{ width: thumb.w, height: "100%", transform: `translateX(${thumb.x}px)` }}
                  />
                </Liquid.Item>
              </Liquid>
            </div>
            <div role="tablist" aria-label="What would you like to support?" className="relative grid grid-cols-2 gap-1 sm:grid-cols-4" onKeyDown={onKey}>
              {givingFocuses.map((f, i) => (
                <button
                  key={f.id}
                  ref={(el) => {
                    buttons.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`give-tab-${f.id}`}
                  aria-selected={i === active}
                  aria-controls="give-panel"
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="relative z-10 rounded-full px-3 py-2.5 text-sm font-medium whitespace-nowrap text-ink transition-colors duration-300 hover:text-bronze aria-selected:text-white aria-selected:hover:text-white"
                >
                  {f.tab}
                </button>
              ))}
            </div>
          </div>

          <div id="give-panel" role="tabpanel" aria-labelledby={`give-tab-${focus.id}`} className="relative mt-5 min-h-[11.5rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={focus.id}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.4, ease }}
                className="rounded-2xl bg-cream p-5"
              >
                <div className="flex items-start gap-4">
                  <motion.span
                    initial={{ rotate: -20, scale: 0.6 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 16 }}
                    className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-bronze text-white"
                  >
                    <Icon name={focus.icon} className="size-6" strokeWidth={1.6} />
                  </motion.span>
                  <div>
                    <p className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">{focus.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{focus.body}</p>
                  </div>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {focus.points.map((p, i) => (
                    <motion.li
                      key={p}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease, delay: 0.12 + i * 0.06 }}
                      className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs text-ink"
                    >
                      <Icon name="check" className="size-3.5 text-bronze" strokeWidth={2.4} />
                      {p}
                    </motion.li>
                  ))}
                </ul>
                {focus.amount && (
                  <p className="mt-4 text-xs text-muted">
                    Suggested gift <span className="font-semibold text-ink">{naira(focus.amount)}</span>, or any amount you choose
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {primary ? (
            <>
              <Metal variant="button" theme="dark" strength={0.9} borderRadius={999} className="give-metal mt-6 w-full">
                <a
                  href={primary.href}
                  rel="noopener"
                  className="sheen group flex w-full items-center justify-between gap-3 rounded-full bg-navy py-2 pr-2 pl-6 text-white transition-[background-color,transform] duration-300 hover:bg-navy-soft active:scale-[0.98]"
                >
                  <span className="text-left">
                    <span className="block font-medium">{primary.label}</span>
                    <span className="block text-xs text-white/75">{primary.detail}</span>
                  </span>
                  <span className="flex size-11 items-center justify-center rounded-full bg-gold text-ink transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110">
                    <SlideIcon name="arrowUpRight" />
                  </span>
                </a>
              </Metal>
              {others.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {others.map((o) => (
                    <a
                      key={o.id}
                      href={o.href}
                      rel="noopener"
                      className="group flex flex-1 items-center justify-between gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-ink transition-colors hover:border-bronze hover:text-bronze"
                    >
                      {o.label}
                      <SlideIcon name="arrowUpRight" className="size-3.5" />
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="mt-6 rounded-2xl bg-sand p-5 text-sm text-muted">
              Online giving opens soon. In the meantime, email{" "}
              <a className="text-bronze underline" href={`mailto:${email}`}>
                {email}
              </a>{" "}
              and we&rsquo;ll help you give.
            </p>
          )}

          <AnimatePresence initial={false}>
            {focus.id !== "general" && primary && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease }}
                className="overflow-hidden text-center text-xs text-muted"
              >
                <span className="block pt-3">
                  After giving,{" "}
                  <a href={mail} className="font-medium text-bronze underline-offset-2 hover:underline">
                    tell us it&rsquo;s for {focus.tab.toLowerCase()}
                  </a>{" "}
                  and we&rsquo;ll direct it there.
                </span>
              </motion.p>
            )}
          </AnimatePresence>

          <ul className="mt-6 grid grid-cols-3 gap-2 border-t border-line pt-5">
            {trust.map((t) => (
              <li key={t.label} className="group/trust flex flex-col items-center gap-1.5 text-center text-[0.7rem] leading-tight text-muted sm:text-xs">
                <Icon name={t.icon} className="size-5 text-bronze transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/trust:-translate-y-0.5 group-hover/trust:scale-110" />
                {t.label}
              </li>
            ))}
          </ul>
        </div>
      </Beam>
    </div>
  );
}
