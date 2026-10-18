"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Quote = { text: string; by: string; role: string; place: string };

const INTERVAL = 7000;
const ease = [0.16, 1, 0.3, 1] as const;

export function QuoteSlider({ quotes, label = "In his words" }: { quotes: Quote[]; label?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const running = !paused && inView && !reduce && quotes.length > 1;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setI((n) => (n + 1) % quotes.length), INTERVAL);
    return () => clearTimeout(t);
  }, [running, i, quotes.length]);

  const q = quotes[i];
  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-navy text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span aria-hidden="true" className="pointer-events-none absolute -top-16 right-6 font-display text-[22rem] leading-none font-bold text-white/[0.04] select-none sm:right-16">
        &ldquo;
      </span>
      <div className="wrap relative py-20 lg:py-24">
        <p data-reveal="fade" className="eyebrow text-gold">
          {label}
        </p>
        <figure className="mt-10 grid min-h-[22rem] sm:min-h-[18rem]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
              transition={{ duration: 0.7, ease }}
            >
              <blockquote className="font-display text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[1.25] font-medium tracking-[-0.03em] text-balance text-tan">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6">
                <motion.span
                  initial={{ backgroundSize: "0% 100%" }}
                  animate={{ backgroundSize: "100% 100%" }}
                  transition={{ duration: 0.9, ease, delay: 0.35 }}
                  className="highlight text-[clamp(1.2rem,2.4vw,1.9rem)] leading-snug font-medium text-ink!"
                >
                  {q.by}, {q.role}
                </motion.span>
                <p className="mt-8 text-xl text-white/80">{q.place}</p>
              </figcaption>
            </motion.div>
          </AnimatePresence>
        </figure>
        {quotes.length > 1 && (
          <div className="mt-10 flex gap-2" role="tablist" aria-label="Choose a quote">
            {quotes.map((_, n) => (
              <button
                key={n}
                role="tab"
                aria-selected={n === i}
                aria-label={`Quote ${n + 1}`}
                onClick={() => setI(n)}
                className="group relative h-1.5 w-10 overflow-hidden rounded-full bg-white/20 transition-[width] duration-500 aria-selected:w-16"
              >
                {n === i && (
                  <motion.span
                    key={`${i}-${running}`}
                    className="absolute inset-y-0 left-0 rounded-full bg-gold"
                    initial={{ width: running ? "0%" : "100%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: running ? INTERVAL / 1000 : 0, ease: "linear" }}
                  />
                )}
                <span className="absolute inset-0 rounded-full bg-white/0 transition-colors group-hover:bg-white/20" />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
