"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import { Icon } from "./icons";
import { Logo } from "./logo";
import { smoothScroll } from "./motion/smooth-scroll";

const ease = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();

  // Compact once the page moves; slide away while reading down, return on any upward scroll.
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (!open) setHidden(y > 240 && y > previous + 2 ? true : y < previous - 2 ? false : hidden);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) smoothScroll.current?.stop();
    else smoothScroll.current?.start();
  }, [open]);

  const isActive = (href: string) => pathname.startsWith(href);
  const indicator = hovered ?? nav.find((n) => isActive(n.href))?.href ?? null;

  return (
    <header
      className={`sticky top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        hidden && !open ? "-translate-y-full" : ""
      } ${scrolled || open ? "bg-cream/85 shadow-[0_8px_30px_-18px_rgba(14,33,50,0.35)] backdrop-blur-xl" : "bg-sand/90 backdrop-blur-md"}`}
    >
      <div className={`wrap flex items-center justify-between gap-6 transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled ? "h-[4.5rem]" : "h-24"}`}>
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHovered(null)}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHovered(item.href)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="relative rounded-full px-3.5 py-2 text-[0.92rem] whitespace-nowrap text-ink transition-colors aria-[current=page]:text-bronze"
            >
              {indicator === item.href && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 -z-10 rounded-full bg-ink/[0.06]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/support"
            className="group hidden items-center gap-2 rounded-full bg-bronze py-3 pr-3 pl-5 text-[0.92rem] font-medium whitespace-nowrap text-white transition-colors hover:bg-bronze-dark sm:inline-flex"
          >
            Donate Now
            <span className="flex size-7 items-center justify-center rounded-full bg-white/15">
              <Icon name="arrowUpRight" className="size-3.5" strokeWidth={2.2} />
            </span>
          </Link>
          <button
            type="button"
            className="relative flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden="true" className="relative block h-3.5 w-5">
              <span className={`absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute top-1.5 left-0 h-[1.5px] w-5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            data-lenis-prevent
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease }}
            className={`overflow-y-auto bg-cream lg:hidden ${scrolled ? "h-[calc(100dvh-4.5rem)]" : "h-[calc(100dvh-6rem)]"}`}
          >
            <ul className="wrap py-4">
              {[{ label: "Home", href: "/" }, ...nav].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.08 + i * 0.05 }}
                  className="border-b border-ink/10"
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={(item.href === "/" ? pathname === "/" : isActive(item.href)) ? "page" : undefined}
                    className="group flex items-center justify-between py-4 font-display text-3xl font-semibold tracking-[-0.03em] text-ink aria-[current=page]:text-bronze"
                  >
                    {item.label}
                    <Icon name="arrow" className="size-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" strokeWidth={1.8} />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div className="wrap pb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.45 }}>
              <Link href="/support" onClick={() => setOpen(false)} className="block rounded-full bg-bronze px-5 py-4 text-center font-medium text-white">
                Donate Now
              </Link>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
