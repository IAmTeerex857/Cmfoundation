"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

function format(n: number, group: boolean) {
  return group ? n.toLocaleString("en-NG") : String(n);
}

/**
 * Counts up to `value` the first time it scrolls into view. The final number is rendered on the
 * server, so it is correct without JavaScript and for screen readers. Use `group={false}` for years.
 */
export function CountUp({ value, from = 0, group = true, duration = 1.6 }: { value: number; from?: number; group?: boolean; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(from, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => {
        el.textContent = format(Math.round(n), group);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, from, group, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(value, group)}
    </span>
  );
}
