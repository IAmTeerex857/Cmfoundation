"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export type HeroSlide = { src: string; alt: string; caption: string };

const slots = [
  { aspect: "aspect-[16/11]", revealDelay: "250", fadeDelay: "0ms" },
  { aspect: "aspect-[16/10]", revealDelay: "420", fadeDelay: "450ms" },
];

// The home hero's two stacked photos. Every few seconds each frame cross-fades to the next photo in
// the set (the second frame a beat after the first), so with three or more photos the pair keeps
// changing. Holds still for reduced motion and while the tab is hidden.
export function HeroRotator({ slides, interval = 6000 }: { slides: HeroSlide[]; interval?: number }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setStep((s) => s + 1);
    }, interval);
    return () => window.clearInterval(id);
  }, [slides.length, interval]);

  return (
    <div className="grid gap-3 self-center">
      {slots.map((slot, k) => {
        const active = (step + k) % slides.length;
        return (
          <div key={k} data-reveal="clip" data-reveal-delay={slot.revealDelay} className={`relative ${slot.aspect} overflow-hidden rounded-3xl`}>
            <div data-parallax="0.05" className="absolute inset-0">
              {slides.map((s, i) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={i === active ? s.alt : ""}
                  aria-hidden={i !== active}
                  fill
                  priority={i === k % slides.length}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className={`object-cover transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${i === active ? "opacity-100" : "opacity-0"}`}
                  style={{ transitionDelay: slot.fadeDelay }}
                />
              ))}
            </div>
            {k === slots.length - 1 && (
              <span className="absolute bottom-3 left-3 flex animate-float items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-sm text-ink shadow-lg backdrop-blur motion-reduce:animate-none">
                <span className="size-2 rounded-full bg-bronze" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={slides[active].caption}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, delay: 0.45 }}
                  >
                    {slides[active].caption}
                  </motion.span>
                </AnimatePresence>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
