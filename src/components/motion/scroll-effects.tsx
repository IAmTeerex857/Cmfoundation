"use client";

import { useEffect } from "react";

const REVEAL_MS = 1300;
const STAGGER_MS = 90;
const MAX_STAGGER = 6;

/**
 * Drives the scroll animations declared in markup (styles in globals.css):
 *
 * - `data-reveal` (`up` default, `fade`, `scale`, `left`, `right`, `blur`, `clip`, `words`):
 *   the element animates in when it enters the viewport. Elements entering together are
 *   staggered in document order; `data-reveal-delay="200"` adds a fixed delay in ms.
 * - `data-parallax="0.12"`: the element drifts against the scroll by that fraction of its
 *   distance from the viewport centre. Put it on an inner element (an image), not the one
 *   that reveals.
 *
 * Works for server-rendered markup and for content added later (filters, "load more").
 */
export function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("js-reveal");
      return;
    }

    const timers = new Set<number>();

    const reveal = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        entering.forEach((el, i) => {
          reveal.unobserve(el);
          const delay = Math.min(i, MAX_STAGGER) * STAGGER_MS + Number(el.dataset.revealDelay ?? 0);
          el.style.setProperty("--reveal-delay", `${delay}ms`);
          el.classList.add("is-in");
          // Hand the element back to its own styles (hover transitions etc.) once it has settled.
          const t = window.setTimeout(() => {
            timers.delete(t);
            el.removeAttribute("data-reveal");
            el.classList.remove("is-in");
            el.style.removeProperty("--reveal-delay");
          }, delay + REVEAL_MS);
          timers.add(t);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    const parallax = new Set<HTMLElement>();
    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      for (const el of parallax) {
        const box = el.parentElement?.getBoundingClientRect() ?? el.getBoundingClientRect();
        if (box.bottom < -200 || box.top > window.innerHeight + 200) continue;
        const speed = Number(el.dataset.parallax) || 0.1;
        // Zoom in just enough to hide the drift, and never drift past that margin, so no edge shows.
        const scale = 1 + Math.abs(speed) * 2;
        const slack = (box.height * (scale - 1)) / 2;
        const shift = Math.max(-slack, Math.min(slack, (box.top + box.height / 2 - mid) * -speed));
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(${scale})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateParallax);
    };

    const scan = (node: ParentNode) => {
      node.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => reveal.observe(el));
      node.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => parallax.add(el));
    };

    scan(document);
    updateParallax();
    root.classList.add("reveal-ready");

    const mutations = new MutationObserver((records) => {
      let added = false;
      for (const r of records)
        for (const n of r.addedNodes)
          if (n instanceof HTMLElement) {
            if (n.matches("[data-reveal]")) reveal.observe(n);
            if (n.matches("[data-parallax]")) parallax.add(n);
            scan(n);
            added = true;
          }
      if (added) {
        for (const el of parallax) if (!el.isConnected) parallax.delete(el);
        onScroll();
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      reveal.disconnect();
      mutations.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      timers.forEach((t) => clearTimeout(t));
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
