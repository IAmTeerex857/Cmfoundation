"use client";

import { Icon } from "../icons";
import { smoothScroll } from "./smooth-scroll";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => (smoothScroll.current ? smoothScroll.current.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
      className="group flex items-center gap-2 rounded-full border border-white/20 py-1.5 pr-1.5 pl-4 text-white/80 transition-colors hover:border-gold hover:text-gold"
    >
      Back to top
      <span className="flex size-7 items-center justify-center overflow-hidden rounded-full bg-white/10">
        <Icon name="arrowDown" className="size-3.5 rotate-180 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-0.5" strokeWidth={2.2} />
      </span>
    </button>
  );
}
