"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { givingFocuses } from "@/lib/giving";
import type { GivingOption } from "@/lib/payment-links";
import { Icon } from "./icons";

const ease = [0.16, 1, 0.3, 1] as const;

// The donation card in the Support hero. Donors pick what they'd like to support, then continue to
// the hosted checkout and enter any amount there. The checkout can't carry the choice, so for a
// specific cause the card offers a prefilled email.
export function GiveCard({ options, email }: { options: GivingOption[]; email: string }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const [primary, ...others] = options;
  const focus = givingFocuses[active];

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
    <div data-reveal="fade" data-reveal-delay="200" className="self-start rounded-[28px] border border-line/70 bg-white p-6 shadow-[0_30px_60px_-40px_rgba(14,33,50,0.35)] sm:p-8">
      <h2 className="display-md">Give online</h2>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">Choose what you&rsquo;d like to support, then give any amount at checkout.</p>

      <div role="tablist" aria-label="What would you like to support?" className="mt-6 grid grid-cols-2 gap-1 rounded-3xl bg-sand p-1 sm:grid-cols-4 sm:rounded-full" onKeyDown={onKey}>
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
            className="relative rounded-full px-3 py-2.5 text-sm font-medium whitespace-nowrap text-muted transition-colors duration-300 hover:text-ink aria-selected:text-white"
          >
            {i === active && <motion.span layoutId="give-tab" transition={{ duration: 0.35, ease }} className="absolute inset-0 rounded-full bg-ink" />}
            <span className="relative">{f.tab}</span>
          </button>
        ))}
      </div>

      <div id="give-panel" role="tabpanel" aria-labelledby={`give-tab-${focus.id}`} className="mt-6 min-h-[5.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={focus.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-4"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sand text-bronze">
              <Icon name={focus.icon} className="size-5" strokeWidth={1.6} />
            </span>
            <div>
              <p className="font-display font-semibold tracking-[-0.01em] text-ink">{focus.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{focus.body}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {primary ? (
        <>
          <a
            href={primary.href}
            rel="noopener"
            className="mt-6 flex w-full items-center justify-between gap-3 rounded-full bg-navy py-2 pr-2 pl-6 font-medium text-white transition-colors duration-300 hover:bg-navy-soft"
          >
            {primary.label}
            <span className="flex size-10 items-center justify-center rounded-full bg-gold text-ink">
              <Icon name="arrowUpRight" className="size-4" strokeWidth={2} />
            </span>
          </a>
          {others.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {others.map((o) => (
                <a
                  key={o.id}
                  href={o.href}
                  rel="noopener"
                  className="flex flex-1 items-center justify-between gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-ink transition-colors hover:border-bronze hover:text-bronze"
                >
                  {o.label}
                  <Icon name="arrowUpRight" className="size-3.5" />
                </a>
              ))}
            </div>
          )}
          {focus.id !== "general" && (
            <p className="mt-4 text-center text-xs text-muted">
              After giving,{" "}
              <a href={mail} className="font-medium text-bronze underline-offset-2 hover:underline">
                tell us it&rsquo;s for {focus.tab.toLowerCase()}
              </a>{" "}
              and we&rsquo;ll direct it there.
            </p>
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
    </div>
  );
}
