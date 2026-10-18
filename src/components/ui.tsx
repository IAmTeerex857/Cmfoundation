import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon, type IconName } from "./icons";
import { CountUp } from "./motion/count-up";
import { SplitWords } from "./motion/split-words";

// Motion conventions (see globals.css and components/motion/scroll-effects.tsx):
// data-reveal animates an element in on scroll, data-parallax drifts an image against the scroll.

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
  outline: "border border-ink/80 text-ink hover:bg-ink hover:text-white",
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

export function Button({ href, children, variant = "primary", icon = "arrowUpRight", className = "", ...rest }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[0.95rem] font-medium transition-colors duration-300 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
      {icon && <SlideIcon name={icon} />}
    </Link>
  );
}

export function CircleArrow({ className = "", tone = "primary" }: { className?: string; tone?: "primary" | "dark" }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full text-white transition-colors duration-300 ${
        tone === "primary" ? "bg-bronze group-hover:bg-bronze-dark" : "bg-ink group-hover:bg-bronze"
      } ${className || "size-9"}`}
    >
      <SlideIcon name="arrow" className="size-1/2" />
    </span>
  );
}

/* ---------- Section headers ---------- */

export function SectionHead({
  title,
  aside,
  center = false,
  className = "",
  as: Tag = "h2",
}: {
  title: ReactNode;
  aside?: ReactNode;
  center?: boolean;
  className?: string;
  as?: "h1" | "h2";
}) {
  const heading = (
    <Tag data-reveal="words" className={`display-lg ${center ? "" : "max-w-2xl"}`}>
      <SplitWords>{title}</SplitWords>
    </Tag>
  );
  if (center) {
    return (
      <div className={`mx-auto max-w-2xl text-center ${className}`}>
        {heading}
        {aside && (
          <p data-reveal="fade" data-reveal-delay="250" className="mt-5 text-muted">
            {aside}
          </p>
        )}
      </div>
    );
  }
  return (
    <div className={`flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between ${className}`}>
      {heading}
      {aside && (
        <div data-reveal data-reveal-delay="250" className="max-w-sm text-muted lg:pb-2">
          {aside}
        </div>
      )}
    </div>
  );
}

/* ---------- Marquee ---------- */

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="group/marquee overflow-hidden border-y border-line bg-cream py-7 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <ul className="flex w-max animate-marquee gap-14 group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none" aria-label={items.join(", ")}>
        {row.map((t, i) => (
          <li
            key={i}
            aria-hidden={i >= items.length}
            className="flex items-center gap-14 font-display text-[2rem] font-semibold tracking-[-0.03em] whitespace-nowrap text-ink/25 transition-colors duration-300 hover:text-ink"
          >
            {t}
            <span className="inline-block animate-[spin_12s_linear_infinite] text-xl text-bronze motion-reduce:animate-none">✦</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Statement (RiseUp) ---------- */

export function Statement({ children, highlight }: { children: ReactNode; highlight?: string }) {
  return (
    <p data-reveal="blur" className="text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.3] font-light tracking-[-0.02em] text-ink">
      {children} {highlight && <span className="highlight">{highlight}</span>}
    </p>
  );
}

/* ---------- Ruled icon list (RiseUp) ---------- */

export function IconList({ items }: { items: { icon: IconName; title: string; body: string; href?: string }[] }) {
  return (
    <div className="grid gap-x-10 sm:grid-cols-2">
      {items.map((it) => {
        const inner = (
          <>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-sand text-ink transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:bg-bronze group-hover:text-white">
              <Icon name={it.icon} className="size-7" strokeWidth={1.4} />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-ink">{it.title}</h3>
            <p className="mt-2.5 text-[1.02rem] leading-relaxed text-body">{it.body}</p>
          </>
        );
        return (
          <div key={it.title} data-reveal className="rule-draw group py-8 text-ink">
            {it.href ? (
              <Link href={it.href} className="block">
                {inner}
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors group-hover:text-bronze">
                  Read more <SlideIcon name="arrow" />
                </span>
              </Link>
            ) : (
              inner
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Numbered cards (Altruva) ---------- */

export function NumberedCards({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 ${items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {items.map((it, i) => (
        <article
          key={it.title}
          data-reveal
          className="tile group flex min-h-72 flex-col p-6 transition-[transform,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_50px_-28px_rgba(14,33,50,0.45)]"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-semibold tracking-tight text-ink/70 tabular-nums">[ {String(i + 1).padStart(2, "0")} ]</span>
            <span className="flex gap-1" aria-hidden="true">
              {Array.from({ length: Math.min(items.length, 4) }, (_, d) => (
                <span
                  key={d}
                  className={`size-1.5 rounded-full transition-colors duration-300 ${d <= i ? "bg-bronze" : "border border-muted/60 group-hover:border-bronze"}`}
                  style={{ transitionDelay: `${d * 60}ms` }}
                />
              ))}
            </span>
          </div>
          <h3 className="display-sm mt-auto pt-16 text-2xl">{it.title}</h3>
          <div className="mt-3 leading-relaxed text-body">{it.body}</div>
        </article>
      ))}
    </div>
  );
}

/* ---------- Nested frame image (RiseUp) ---------- */

export function NestedFrame({ src, alt, tone = "tan", flip = false, position = "center" }: { src: string; alt: string; tone?: "tan" | "navy"; flip?: boolean; position?: string }) {
  const [outer, inner] = tone === "tan" ? ["bg-tan", "bg-tan-light"] : ["bg-navy", "bg-navy-soft"];
  return (
    <div data-reveal="fade" className={`relative aspect-[16/15] ${outer}`}>
      <div data-reveal={flip ? "left" : "right"} data-reveal-delay="150" className={`absolute ${flip ? "top-[15%] right-[20%] bottom-0 left-0" : "top-[15%] right-0 bottom-0 left-[20%]"} ${inner}`} />
      <div data-reveal="clip" data-reveal-delay="320" className={`absolute ${flip ? "top-[29%] right-[33%] bottom-0 left-0" : "top-[29%] right-0 bottom-0 left-[33%]"} overflow-hidden`}>
        <div data-parallax="0.06" className="absolute inset-0">
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 30vw, 70vw" className="object-cover" style={{ objectPosition: position }} />
        </div>
      </div>
    </div>
  );
}

export function Split({
  title,
  children,
  image,
  reverse = false,
}: {
  title: ReactNode;
  children: ReactNode;
  image: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div className={reverse ? "lg:order-2" : ""}>
        <h2 data-reveal="words" className="font-display text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.035em] text-balance text-ink">
          <SplitWords>{title}</SplitWords>
        </h2>
        <div data-reveal data-reveal-delay="200" className="mt-6 space-y-4 text-[1.05rem] leading-relaxed text-muted">
          {children}
        </div>
      </div>
      <div className={reverse ? "lg:order-1" : ""}>{image}</div>
    </div>
  );
}

export function ReadMore({ href, children = "Read more" }: { href: string; children?: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3 font-medium text-ink transition-colors hover:text-bronze">
      <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-bottom-left bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_1px]">
        {children}
      </span>
      <SlideIcon name="arrow" className="size-5" strokeWidth={1.6} />
    </Link>
  );
}

/* ---------- Image cards (Altruva) ---------- */

export function ImageCard({ href, title, image, alt = "", children }: { href: string; title: string; image?: string; alt?: string; children?: ReactNode }) {
  return (
    <Link
      href={href}
      data-reveal
      className="group tile block p-3 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-28px_rgba(14,33,50,0.5)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-cream">
        {image ? (
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
          />
        ) : (
          children
        )}
      </div>
      <div className="flex items-center justify-between gap-4 px-1 pt-4 pb-1">
        <h3 className="display-sm">{title}</h3>
        <CircleArrow />
      </div>
    </Link>
  );
}

/* ---------- Stat tiles (RiseUp) ---------- */

const statTones = ["bg-parchment text-ink", "bg-sand text-ink", "bg-bronze text-white", "bg-navy-soft text-white"];

/** Renders a counted-up number for plain numeric values ("22", "2012"); anything else as text. */
function StatValue({ value }: { value: string }) {
  if (!/^\d{1,4}$/.test(value)) return <>{value}</>;
  const n = Number(value);
  const isYear = n >= 1900 && n <= 2100;
  return <CountUp value={n} from={isYear ? n - 40 : 0} group={!isYear} />;
}

export function StatTiles({ items }: { items: { value: string; title: string; body: string }[] }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <div
          key={s.title}
          data-reveal
          className={`group flex min-h-80 flex-col p-7 transition-[border-radius] duration-500 hover:rounded-3xl ${statTones[i % 4]}`}
        >
          <p className="text-base tabular-nums">
            <StatValue value={s.value} />
          </p>
          <h3 className="mt-auto font-display text-2xl leading-snug font-semibold tracking-[-0.02em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
            {s.title}
          </h3>
          <p className={`mt-4 text-[0.95rem] leading-relaxed ${i % 4 >= 2 ? "text-white/85" : "text-body"}`}>{s.body}</p>
        </div>
      ))}
    </div>
  );
}

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 sm:divide-x sm:divide-line">
      {items.map((s) => (
        <div key={s.label} data-reveal className="sm:px-6 sm:first:pl-0">
          <dt className="sr-only">{s.label}</dt>
          <dd className="font-display text-5xl leading-none font-semibold tracking-[-0.04em] text-ink">
            <StatValue value={s.value} />
          </dd>
          <dd className="mt-2 text-muted">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- FAQ (Altruva) ---------- */

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details
          key={item.q}
          open={i === 0}
          data-reveal
          className="faq group rounded-2xl border border-ink/15 px-6 transition-[background-color,border-color] duration-300 hover:border-ink/35 open:border-transparent open:bg-sand"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg text-ink [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sand text-ink transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-open:rotate-45 group-open:bg-bronze group-open:text-white">
              <Icon name="plus" className="size-4" strokeWidth={1.8} />
            </span>
          </summary>
          <p className="max-w-lg pb-6 text-[0.95rem] leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ---------- Page hero (Altruva) ---------- */

export function PageHero({
  title,
  children,
  images,
  actions,
}: {
  title: ReactNode;
  children?: ReactNode;
  images: { src: string; alt: string; position?: string }[];
  actions?: ReactNode;
}) {
  return (
    <section className="overflow-hidden bg-sand">
      <div className="wrap grid items-center gap-10 py-14 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:py-20">
        <div>
          <h1 data-reveal="words" className="display-xl">
            <SplitWords>{title}</SplitWords>
          </h1>
          {children && (
            <div data-reveal data-reveal-delay="300" className="lede mt-6 max-w-xl space-y-4">
              {children}
            </div>
          )}
          {actions && (
            <div data-reveal data-reveal-delay="420" className="mt-8 flex flex-wrap gap-4">
              {actions}
            </div>
          )}
        </div>
        <div className={`grid gap-3 ${images.length > 1 ? "grid-rows-2" : ""}`}>
          {images.map((img, i) => (
            <div
              key={img.src}
              data-reveal="clip"
              data-reveal-delay={String(200 + i * 150)}
              className={`relative overflow-hidden rounded-2xl ${images.length > 1 ? "aspect-[16/9]" : "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]"}`}
            >
              <div data-parallax="0.05" className="absolute inset-0">
                <Image src={img.src} alt={img.alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: img.position ?? "center" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Big image CTA (Altruva) ---------- */

export function ImageCta({ word, title, cta, href, image, position = "center" }: { word: string; title: string; cta: string; href: string; image: string; position?: string }) {
  return (
    <section className="py-20">
      <div className="wrap">
        <div data-reveal="clip" className="relative isolate flex min-h-[28rem] flex-col justify-between overflow-hidden rounded-3xl p-6 sm:min-h-[34rem] sm:p-8">
          <div data-parallax="0.12" className="absolute inset-0 -z-10">
            <Image src={image} alt="" fill sizes="(min-width: 1140px) 1140px, 100vw" className="object-cover" style={{ objectPosition: position }} />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/80 via-navy/30 to-navy/40" />
          <p data-reveal="words" data-reveal-delay="300" className="display-lg max-w-md self-end text-right text-white">
            <SplitWords>{title}</SplitWords>
          </p>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <p data-reveal="words" data-reveal-delay="450" className="font-display text-[clamp(5rem,17vw,13rem)] leading-[0.85] font-bold tracking-[-0.06em] text-white">
              <SplitWords>{word}</SplitWords>
            </p>
            <Button href={href} className="mb-2">
              {cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Colour band (RiseUp) ---------- */

export function GreenBand({ title, body, image, position = "center", children }: { title: string; body: string; image: string; position?: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden bg-bronze text-white">
      <div className="wrap grid items-center gap-10 py-20 lg:grid-cols-2">
        <div>
          <h2 data-reveal="words" className="font-display text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.035em] text-balance">
            <SplitWords>{title}</SplitWords>
          </h2>
          <p data-reveal data-reveal-delay="200" className="mt-5 max-w-md text-lg leading-relaxed text-white/90">
            {body}
          </p>
          <div data-reveal data-reveal-delay="320" className="mt-8 flex flex-wrap gap-4">
            {children}
          </div>
        </div>
        <div data-reveal="clip" data-reveal-delay="150" className="relative aspect-[5/3] overflow-hidden rounded-2xl lg:ml-auto lg:w-[90%]">
          <div data-parallax="0.07" className="absolute inset-0">
            <Image src={image} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: position }} />
          </div>
        </div>
      </div>
    </section>
  );
}
