"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import { Icon } from "./icons";
import { Logo } from "./logo";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-sand/90 backdrop-blur-md">
      <div className="wrap flex h-24 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="text-[0.95rem] whitespace-nowrap text-ink transition-colors hover:text-bronze aria-[current=page]:text-bronze"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/support" className="hidden rounded-xl bg-bronze px-6 py-3.5 text-[0.95rem] whitespace-nowrap text-white hover:bg-bronze-dark sm:inline-block">
            Donate Now
          </Link>
          <button
            type="button"
            className="rounded-xl p-2.5 text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} className="size-6" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile" className="h-[calc(100dvh-6rem)] overflow-y-auto bg-sand lg:hidden">
          <ul className="wrap py-4">
            {[{ label: "Home", href: "/" }, ...nav].map((item) => (
              <li key={item.href} className="border-b border-ink/15">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={(item.href === "/" ? pathname === "/" : isActive(item.href)) ? "page" : undefined}
                  className="block py-4 font-display text-4xl text-ink uppercase aria-[current=page]:text-bronze"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="wrap pb-10">
            <Link href="/support" onClick={() => setOpen(false)} className="block rounded-xl bg-bronze px-5 py-4 text-center text-white">
              Donate Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
