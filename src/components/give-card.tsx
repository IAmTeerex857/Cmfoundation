"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { givingFocuses } from "@/lib/giving";
import { Icon } from "./icons";
import { SlideIcon } from "./ui";

// The giving card on /support. The donor picks a purpose and continues to that purpose's own
// checkout (via /give/<category>), so the payment record carries the purpose and nobody has to
// email afterwards (instructions §8.4).
export function GiveCard({ hasCheckout, email }: { hasCheckout: boolean; email: string }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const focus = givingFocuses[active];

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + givingFocuses.length) % givingFocuses.length;
    setActive(next);
    buttons.current[next]?.focus();
  };

  return (
    <div className="tile self-start p-6 shadow-[0_30px_60px_-40px_rgba(12,31,66,0.35)] sm:p-8">
      <h2 className="display-md">Give online</h2>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">Choose what your gift is for, then give any amount at checkout.</p>

      <div role="tablist" aria-label="What would you like to support?" className="mt-6 grid grid-cols-2 gap-1 rounded-[3px] bg-blush p-1 sm:grid-cols-4" onKeyDown={onKey}>
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
            className="rounded-[3px] px-3 py-2.5 text-sm font-medium whitespace-nowrap text-muted transition-colors hover:text-ink aria-selected:bg-ink aria-selected:text-white"
          >
            {f.tab}
          </button>
        ))}
      </div>

      <div id="give-panel" role="tabpanel" aria-labelledby={`give-tab-${focus.id}`} className="mt-6 flex min-h-[5.5rem] items-start gap-4">
        <Icon name={focus.icon} className="mt-0.5 size-9 shrink-0 text-bronze" strokeWidth={1.2} />
        <div>
          <p className="font-display text-xl text-ink">{focus.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{focus.body}</p>
        </div>
      </div>

      {hasCheckout ? (
        <>
          <a
            href={`/give/${focus.id}`}
            rel="noopener"
            onClick={() => track("donate_click", { category: focus.id })}
            className="group mt-6 flex w-full items-center justify-center gap-3 rounded-[3px] bg-bronze px-6 py-4 text-[0.82rem] leading-none font-semibold tracking-[0.08em] text-white uppercase transition-colors duration-300 hover:bg-bronze-dark"
          >
            Give to {focus.tab === "General" ? "the Foundation" : focus.tab.toLowerCase()}
            <SlideIcon name="arrow" />
          </a>
        </>
      ) : (
        <p className="mt-6 rounded-[3px] bg-blush p-5 text-sm text-muted">
          Online giving opens soon. In the meantime, email{" "}
          <a className="text-bronze underline" href={`mailto:${email}`}>
            {email}
          </a>
          .
        </p>
      )}
    </div>
  );
}
