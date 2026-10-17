"use client";

import { useEffect, useState } from "react";

type Quote = { text: string; by: string; role: string; place: string };

export function QuoteSlider({ quotes, label = "In his words" }: { quotes: Quote[]; label?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || quotes.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % quotes.length), 7000);
    return () => clearInterval(t);
  }, [paused, quotes.length]);

  const q = quotes[i];
  return (
    <section className="bg-navy text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="wrap py-20 lg:py-24">
        <p className="text-xl text-tan">{label}</p>
        <figure className="mt-10 min-h-[22rem] sm:min-h-[18rem]" aria-live="polite">
          <blockquote className="text-[clamp(1.6rem,3.4vw,2.75rem)] leading-[1.25] font-light tracking-[-0.01em] text-tan">&ldquo;{q.text}&rdquo;</blockquote>
          <figcaption className="mt-4">
            <span className="highlight text-[clamp(1.4rem,3vw,2.5rem)] leading-snug text-ink!">
              {q.by}, {q.role}
            </span>
            <p className="mt-10 text-2xl">{q.place}</p>
          </figcaption>
        </figure>
        <div className="mt-10 flex gap-2" role="tablist" aria-label="Choose a quote">
          {quotes.map((_, n) => (
            <button
              key={n}
              role="tab"
              aria-selected={n === i}
              aria-label={`Quote ${n + 1}`}
              onClick={() => setI(n)}
              className="size-4.5 bg-white/25 transition-colors aria-selected:bg-white/70"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
