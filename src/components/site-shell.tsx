import type { ReactNode } from "react";
import { giveHref } from "@/lib/payment-links";
import { Footer } from "./footer";
import { Header } from "./header";
import { ScrollEffects } from "./motion/scroll-effects";
import { ScrollProgress } from "./motion/scroll-progress";
import { SmoothScroll } from "./motion/smooth-scroll";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only z-[80] rounded-lg bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Skip to content
      </a>
      <SmoothScroll />
      <ScrollEffects />
      <ScrollProgress />
      <Header giveHref={giveHref()} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
