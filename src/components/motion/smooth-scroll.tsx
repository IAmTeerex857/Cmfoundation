"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** The page's Lenis instance, for components that need to pause scrolling (e.g. the mobile menu). */
export const smoothScroll: { current: Lenis | null } = { current: null };

/** Smooth, eased wheel scrolling for the public site. Respects reduced-motion preferences. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      anchors: { offset: -96 },
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    });
    smoothScroll.current = lenis;
    return () => {
      lenis.destroy();
      smoothScroll.current = null;
    };
  }, []);

  // Pages change height between routes; let Lenis re-measure.
  useEffect(() => {
    smoothScroll.current?.resize();
  }, [pathname]);

  return null;
}
