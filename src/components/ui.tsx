import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon, type IconName } from "./icons";
import { SplitWords } from "./motion/split-words";

// Motion conventions (see globals.css and components/motion/scroll-effects.tsx):
// data-reveal animates an element in on scroll.

/* ---------- Buttons ---------- */

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "dark" | "light" | "ghost";
  icon?: IconName | null;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

const variants = {
  primary: "bg-bronze text-white hover:bg-bronze-dark",
  outline: "border border-bronze bg-white/50 text-bronze hover:bg-bronze hover:text-white",
  dark: "bg-ink text-white hover:bg-navy",
  light: "border border-white/70 text-white hover:bg-white hover:text-ink",
  ghost: "text-ink hover:text-bronze px-0!",
};

/** An icon that slides out on hover while a copy slides in behind it. */
export function SlideIcon({ name, className = "size-4", strokeWidth = 2 }: { name: IconName; className?: string; strokeWidth?: number }) {
  const diagonal = name === "arrowUpRight";
  const out = diagonal ? "group-hover:translate-x-full group-hover:-translate-y-full" : name === "arrowDown" ? "group-hover:translate-y-full" : "group-hover:translate-x-full";
  const into = diagonal ? "-translate-x-full translate-y-full" : name === "arrowDown" ? "-translate-y-full" : "-translate-x-full";
  const motion = "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";
  return (
    <span aria-hidden="true" className={`relative inline-block shrink-0 overflow-hidden ${className}`}>
      <Icon name={name} className={`absolute inset-0 size-full ${motion} ${out}`} strokeWidth={strokeWidth} />
      <Icon name={name} className={`absolute inset-0 size-full ${motion} ${into} group-hover:translate-0`} strokeWidth={strokeWidth} />
    </span>
  );
}

/** Square, uppercase button with a sliding arrow, as in the designs. */
export function Button({ href, children, variant = "primary", icon = "arrow", className = "", ...rest }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-3 rounded-[3px] px-6 py-3.5 text-[0.82rem] leading-none font-semibold tracking-[0.08em] uppercase transition-colors duration-300 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
      {icon && <SlideIcon name={icon} />}
    </Link>
  );
}

/* ---------- FAQ ---------- */

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.q} data-reveal className="faq group rounded-[3px] border border-line bg-white px-5 transition-colors duration-300 hover:border-bronze/50">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.02rem] text-ink [&::-webkit-details-marker]:hidden">
            {item.q}
            <Icon name="plus" className="size-5 shrink-0 text-bronze transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-45" strokeWidth={1.6} />
          </summary>
          <p className="max-w-xl pb-5 text-[0.95rem] leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ---------- Page hero (designs) ---------- */

/**
 * Text on warm paper at the left; the photo fills the right of the hero, unframed, from top to
 * bottom and out to the edge of the screen, with a short soft edge where it meets the paper. `aside`
 * (a short quote) sits on a small card over the photo's lower right on wide screens. `badge` is a
 * label in the same place; `footer` holds a row of tags or a note under the actions. With `as="h2"` it serves as a feature band further down a page. `compact` suits
 * long titles; `short` trims the height so the next section shows sooner.
 */
export function PageHero({
  eyebrow,
  title,
  children,
  actions,
  footer,
  image,
  aside,
  badge,
  as: Tag = "h1",
  compact = false,
  short = false,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  image: { src: string; alt: string; position?: string };
  aside?: ReactNode;
  badge?: ReactNode;
  as?: "h1" | "h2";
  compact?: boolean;
  short?: boolean;
}) {
  const height = short ? "py-12 lg:min-h-[21rem] lg:py-8" : "py-14 lg:min-h-[29rem] lg:py-16";
  return (
    <section className="relative flex flex-col overflow-hidden bg-gradient-to-r from-[#f8ecd9] via-blush to-blush">
      <div className={`wrap relative z-10 lg:flex lg:items-center ${height}`}>
        <div className={`max-w-xl ${compact ? "lg:max-w-[min(38rem,50%)]" : "lg:max-w-[min(34rem,45%)]"}`}>
          {eyebrow && (
            <p data-reveal="fade" className="eyebrow">
              {eyebrow}
            </p>
          )}
          <Tag
            data-reveal="words"
            className={`${Tag === "h2" ? "display-lg" : compact ? "display-lg lg:text-[clamp(2.3rem,3.2vw,2.9rem)]" : short ? "display-xl lg:text-[clamp(2.6rem,3.8vw,3.3rem)]" : "display-xl"} mt-4`}
          >
            <SplitWords>{title}</SplitWords>
          </Tag>
          {children && (
            <div data-reveal data-reveal-delay="300" className={`${short ? "mt-5" : "mt-6"} space-y-4 leading-relaxed text-body ${Tag === "h1" ? "text-[1.08rem]" : ""}`}>
              {children}
            </div>
          )}
          {actions && (
            <div data-reveal data-reveal-delay="420" className={`${short ? "mt-6" : "mt-8"} flex flex-wrap gap-4`}>
              {actions}
            </div>
          )}
          {footer && (
            <div data-reveal data-reveal-delay="520" className="mt-8">
              {footer}
            </div>
          )}
        </div>
      </div>
      <div
        className={`relative aspect-[4/3] sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-8 lg:aspect-auto xl:right-[calc((100vw-1140px)/2)] ${compact ? "lg:left-[54%]" : "lg:left-[49%]"}`}
      >
        <div
          data-reveal="fade"
          data-reveal-delay="150"
          className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_6%)] lg:[mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,0.6)_2.5%,#000_6%,#000_94%,rgba(0,0,0,0.6)_97.5%,transparent)]"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={Tag === "h1"}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
            style={{ objectPosition: image.position ?? "center" }}
          />
        </div>
        {badge && (
          <div className="absolute right-4 bottom-4 flex items-center gap-3 rounded-[3px] bg-white/95 px-4 py-2.5 sm:right-8 sm:bottom-8">
            {badge}
          </div>
        )}
      </div>
      {aside && (
        <div
          data-reveal="fade"
          data-reveal-delay="500"
          className="absolute right-[max(2rem,calc((100vw-1140px)/2))] bottom-8 hidden max-w-[15rem] rounded-[3px] bg-paper/95 px-6 py-5 xl:block [&_.pull-quote]:text-[1.2rem]"
        >
          {aside}
        </div>
      )}
    </section>
  );
}

/* ---------- Design pieces ---------- */

export function GoldRule({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block h-px w-14 bg-bronze/60 ${className}`} />;
}

/** Eyebrow, serif heading and optional text, the opening of most sections in the designs. */
export function SectionIntro({
  eyebrow,
  title,
  children,
  rule = false,
  size = "lg",
  className = "",
  as: Tag = "h2",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  rule?: boolean;
  size?: "lg" | "md";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <p data-reveal="fade" className="eyebrow">
          {eyebrow}
        </p>
      )}
      <Tag data-reveal="words" className={`${size === "lg" ? "display-lg" : "display-md"} ${eyebrow ? "mt-3" : ""}`}>
        <SplitWords>{title}</SplitWords>
      </Tag>
      {rule && <GoldRule className="mt-6" />}
      {children && (
        <div data-reveal data-reveal-delay="200" className="mt-5 space-y-4 leading-relaxed text-body">
          {children}
        </div>
      )}
    </div>
  );
}

/** Uppercase bronze text link with an arrow ("LEARN MORE →"). */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.06em] text-bronze uppercase transition-colors hover:text-bronze-dark ${className}`}>
      {children}
      <SlideIcon name="arrow" className="size-4" />
    </Link>
  );
}

/** Italic bronze quote with a short rule and attribution. */
export function QuoteBlock({ text, by, className = "" }: { text: ReactNode; by?: ReactNode; className?: string }) {
  return (
    <figure className={className}>
      <blockquote className="pull-quote">&ldquo;{text}&rdquo;</blockquote>
      {by && (
        <figcaption className="mt-4">
          <GoldRule className="mb-3 w-10" />
          <span className="font-display text-lg text-ink">{by}</span>
        </figcaption>
      )}
    </figure>
  );
}

/** Outlined bronze icons over serif titles, separated by hairlines (the designs' pillar rows). */
export function IconPillars({
  items,
  className = "",
}: {
  items: { icon: IconName; title: string; body: ReactNode; href?: string; cta?: string }[];
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-line ${className}`}>
      {items.map((it, i) => (
        <div key={it.title} data-reveal data-reveal-delay={String(i * 90)} className="group flex flex-col items-center px-3 text-center sm:px-6">
          <Icon name={it.icon} className="size-12 text-bronze transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1" strokeWidth={1.1} />
          <h3 className="display-sm mt-4">{it.title}</h3>
          <p className="mt-2 max-w-[17rem] text-[0.95rem] leading-relaxed text-muted">{it.body}</p>
          {it.href && (
            <ArrowLink href={it.href} className="mt-4">
              {it.cta ?? "Learn more"}
            </ArrowLink>
          )}
        </div>
      ))}
    </div>
  );
}

/** Closing call to action: heading and buttons at the left, a short italic line at the right. */
export function CtaBand({
  eyebrow,
  title,
  children,
  actions,
  aside,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  actions: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="border-t border-line bg-blush py-16 lg:py-20">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <SectionIntro eyebrow={eyebrow} title={title}>
            {children}
          </SectionIntro>
          <div data-reveal data-reveal-delay="300" className="mt-8 flex flex-wrap gap-4">
            {actions}
          </div>
        </div>
        {aside && (
          <div data-reveal="fade" data-reveal-delay="300" className="flex items-center gap-8 lg:justify-center">
            <Icon name="leaf" className="size-16 shrink-0 text-gold" strokeWidth={1.1} />
            <div className="border-l border-bronze/40 pl-8">{aside}</div>
          </div>
        )}
      </div>
    </section>
  );
}
