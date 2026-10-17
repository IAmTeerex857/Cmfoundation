import Link from "next/link";
import { footerExplore, legal, site } from "@/lib/site";
import { Icon } from "./icons";
import { Logo } from "./logo";
import { Newsletter } from "./newsletter";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-4 ${className}`}>
      {site.social.map((s) => (
        <li key={s.label}>
          <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="block text-ink transition-colors hover:text-bronze">
            <Icon name={s.icon} className="size-6" strokeWidth={1.6} />
          </a>
        </li>
      ))}
    </ul>
  );
}

// Navy footer with the gold mark, as in the Foundation's page designs.
export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="wrap pt-14">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Logo tone="light" />
          <SocialLinks className="[&_a]:text-white/85 [&_a:hover]:text-gold" />
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <h2 className="display-sm text-white">Subscribe to our newsletter</h2>
            <p className="mt-2 mb-5 max-w-sm text-sm text-white/70">News on new books, events and the Foundation&rsquo;s work.</p>
            <Newsletter />
          </div>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-1">
            {footerExplore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-display text-2xl leading-none uppercase transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="space-y-4 font-display text-2xl leading-none uppercase">
            <li>
              <a href={site.contact.phoneHref} className="flex items-center gap-3 transition-colors hover:text-gold">
                <Icon name="phone" className="size-6 text-gold" strokeWidth={1.6} /> {site.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-3 transition-colors hover:text-gold">
                <Icon name="mail" className="size-6 text-gold" strokeWidth={1.6} /> {site.contact.email}
              </a>
            </li>
            <li>
              <a href={site.contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 transition-colors hover:text-gold">
                <Icon name="pin" className="size-6 shrink-0 text-gold" strokeWidth={1.6} />
                <span>
                  <span className="block">{site.contact.officeName}</span>
                  <span className="mt-2 block font-sans text-sm leading-relaxed text-white/70 normal-case">{site.contact.location}</span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-gold/30 py-6 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
