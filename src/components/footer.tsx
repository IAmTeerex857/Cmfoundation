import Link from "next/link";
import { footerExplore, legal, site } from "@/lib/site";
import { Icon } from "./icons";
import { Logo } from "./logo";
import { BackToTop } from "./motion/back-to-top";
import { Newsletter } from "./newsletter";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {site.social.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="flex size-10 items-center justify-center rounded-full text-ink transition-[color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-bronze"
          >
            <Icon name={s.icon} className="size-5" strokeWidth={1.6} />
          </a>
        </li>
      ))}
    </ul>
  );
}

const linkUnderline =
  "bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-bottom-left bg-no-repeat pb-0.5 transition-[background-size,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[length:100%_1px]";

// Navy footer with the gold mark, as in the Foundation's page designs.
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-4.5rem] text-center font-ui text-[clamp(10rem,28vw,22rem)] leading-none font-bold tracking-[-0.06em] text-white/[0.035] select-none"
      >
        CMF
      </span>
      <div className="wrap relative pt-14">
        <div data-reveal className="flex flex-wrap items-center justify-between gap-6">
          <Logo tone="light" />
          <SocialLinks className="[&_a]:text-white/85 [&_a:hover]:text-gold" />
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div data-reveal>
            <h2 className="font-ui text-[1.35rem] leading-[1.15] font-semibold tracking-[-0.025em] text-white">Subscribe to our newsletter</h2>
            <p className="mt-2 mb-5 max-w-sm text-sm text-white/70">News on new books, events and the Foundation&rsquo;s work.</p>
            <Newsletter />
          </div>

          <ul data-reveal className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-1">
            {footerExplore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`font-ui text-lg font-medium tracking-[-0.02em] hover:text-gold ${linkUnderline}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul data-reveal className="space-y-4 font-ui text-lg font-medium tracking-[-0.02em]">
            <li>
              <a href={site.contact.phoneHref} className="group flex items-center gap-3 transition-colors hover:text-gold">
                <Icon name="phone" className="size-5 text-gold transition-transform duration-500 group-hover:-rotate-12" strokeWidth={1.6} /> {site.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="group flex items-center gap-3 transition-colors hover:text-gold">
                <Icon name="mail" className="size-5 text-gold transition-transform duration-500 group-hover:-translate-y-0.5" strokeWidth={1.6} /> {site.contact.email}
              </a>
            </li>
            <li>
              <a href={site.contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 transition-colors hover:text-gold">
                <Icon name="pin" className="size-5 shrink-0 text-gold transition-transform duration-500 group-hover:-translate-y-0.5" strokeWidth={1.6} />
                <span>
                  <span className="block">{site.contact.officeName}</span>
                  <span className="mt-1.5 block font-sans text-sm leading-relaxed font-normal tracking-normal text-white/70">{site.contact.location}</span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-gold/25 py-6 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={`hover:text-gold ${linkUnderline}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
