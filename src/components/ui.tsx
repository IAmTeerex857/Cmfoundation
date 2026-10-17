import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon, type IconName } from "./icons";

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
  outline: "border border-ink text-ink hover:bg-ink hover:text-white",
  dark: "bg-ink text-white hover:bg-navy",
  light: "border border-white/80 text-white hover:bg-white hover:text-ink",
  ghost: "text-ink hover:text-bronze px-0!",
};

export function Button({ href, children, variant = "primary", icon = "arrowUpRight", className = "", ...rest }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-[0.95rem] font-medium transition-colors ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
      {icon && <Icon name={icon} className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />}
    </Link>
  );
}

export function CircleArrow({ className = "", tone = "primary" }: { className?: string; tone?: "primary" | "dark" }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full text-white transition-transform group-hover:translate-x-0.5 ${tone === "primary" ? "bg-bronze" : "bg-ink"} ${className || "size-9"}`}
    >
      <Icon name="arrow" className="size-1/2" strokeWidth={2} />
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
  if (center) {
    return (
      <div className={`mx-auto max-w-2xl text-center ${className}`}>
        <Tag className="display-lg">{title}</Tag>
        {aside && <p className="mt-5 text-muted">{aside}</p>}
      </div>
    );
  }
  return (
    <div className={`flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between ${className}`}>
      <Tag className="display-lg max-w-2xl">{title}</Tag>
      {aside && <div className="max-w-sm text-muted lg:pb-2">{aside}</div>}
    </div>
  );
}

/* ---------- Marquee ---------- */

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-line bg-cream py-7 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <ul className="flex w-max animate-marquee gap-14 motion-reduce:animate-none" aria-label={items.join(", ")}>
        {row.map((t, i) => (
          <li key={i} aria-hidden={i >= items.length} className="flex items-center gap-14 font-display text-4xl whitespace-nowrap text-ink/35">
            {t}
            <span className="text-2xl text-bronze">✦</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Statement (RiseUp) ---------- */

export function Statement({ children, highlight }: { children: ReactNode; highlight?: string }) {
  return (
    <p className="text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.28] font-light tracking-[-0.01em] text-ink">
      {children} {highlight && <span className="highlight">{highlight}</span>}
    </p>
  );
}

/* ---------- Ruled icon list (RiseUp) ---------- */

export function IconList({ items }: { items: { icon: IconName; title: string; body: string; href?: string }[] }) {
  return (
    <div className="grid gap-x-8 sm:grid-cols-2">
      {items.map((it) => {
        const inner = (
          <>
            <Icon name={it.icon} className="size-11 text-ink" strokeWidth={1.3} />
            <h3 className="mt-4 text-xl font-medium text-ink">{it.title}</h3>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-body">{it.body}</p>
          </>
        );
        return (
          <div key={it.title} className="border-b border-ink/40 py-8">
            {it.href ? (
              <Link href={it.href} className="group block">
                {inner}
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink group-hover:text-bronze">
                  Read more <Icon name="arrow" className="size-4" />
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
        <article key={it.title} className="tile flex min-h-72 flex-col p-6">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl text-ink">[ {String(i + 1).padStart(2, "0")} ]</span>
            <span className="flex gap-1" aria-hidden="true">
              {Array.from({ length: Math.min(items.length, 4) }, (_, d) => (
                <span key={d} className={`size-1.5 ${d <= i ? "bg-bronze" : "border border-muted/60"}`} />
              ))}
            </span>
          </div>
          <h3 className="display-sm mt-auto pt-16">{it.title}</h3>
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
    <div className={`relative aspect-[16/15] ${outer}`}>
      <div className={`absolute ${flip ? "top-[15%] right-[20%] bottom-0 left-0" : "top-[15%] right-0 bottom-0 left-[20%]"} ${inner}`} />
      <div className={`absolute ${flip ? "top-[29%] right-[33%] bottom-0 left-0" : "top-[29%] right-0 bottom-0 left-[33%]"} overflow-hidden`}>
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 30vw, 70vw" className="object-cover" style={{ objectPosition: position }} />
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
        <h2 className="text-[clamp(2rem,3.6vw,3rem)] leading-[1.12] font-normal tracking-[-0.01em] text-ink">{title}</h2>
        <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed text-muted">{children}</div>
      </div>
      <div className={reverse ? "lg:order-1" : ""}>{image}</div>
    </div>
  );
}

export function ReadMore({ href, children = "Read more" }: { href: string; children?: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3 text-ink hover:text-bronze">
      {children} <Icon name="arrow" className="size-5 transition-transform group-hover:translate-x-1" strokeWidth={1.4} />
    </Link>
  );
}

/* ---------- Image cards (Altruva) ---------- */

export function ImageCard({ href, title, image, alt = "", children }: { href: string; title: string; image?: string; alt?: string; children?: ReactNode }) {
  return (
    <Link href={href} className="group tile block p-3 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-cream">
        {image ? (
          <Image src={image} alt={alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
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

export function StatTiles({ items }: { items: { value: string; title: string; body: string }[] }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <div key={s.title} className={`flex min-h-80 flex-col p-7 ${statTones[i % 4]}`}>
          <p className="text-base">{s.value}</p>
          <h3 className="mt-auto text-2xl leading-snug">{s.title}</h3>
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
        <div key={s.label} className="sm:px-6 sm:first:pl-0">
          <dt className="sr-only">{s.label}</dt>
          <dd className="font-display text-6xl leading-none text-ink">{s.value}</dd>
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
          className="group rounded-2xl border border-ink/25 px-6 transition-colors open:border-transparent open:bg-sand"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg text-ink [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-sand text-ink group-open:bg-bronze group-open:text-white">
              <Icon name="plus" className="size-4 group-open:hidden" strokeWidth={1.8} />
              <Icon name="minus" className="hidden size-4 group-open:block" strokeWidth={1.8} />
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
    <section className="bg-sand">
      <div className="wrap grid items-center gap-10 py-14 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:py-20">
        <div>
          <h1 className="display-xl">{title}</h1>
          {children && <div className="lede mt-6 max-w-xl space-y-4">{children}</div>}
          {actions && <div className="mt-8 flex flex-wrap gap-4">{actions}</div>}
        </div>
        <div className={`grid gap-3 ${images.length > 1 ? "grid-rows-2" : ""}`}>
          {images.map((img) => (
            <div key={img.src} className={`relative overflow-hidden rounded-2xl ${images.length > 1 ? "aspect-[16/9]" : "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]"}`}>
              <Image src={img.src} alt={img.alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: img.position ?? "center" }} />
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
        <div className="relative isolate flex min-h-[28rem] flex-col justify-between overflow-hidden rounded-2xl p-6 sm:min-h-[34rem] sm:p-8">
          <Image src={image} alt="" fill sizes="(min-width: 1140px) 1140px, 100vw" className="-z-10 object-cover" style={{ objectPosition: position }} />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />
          <p className="display-lg max-w-md self-end text-right text-white">{title}</p>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <p className="font-display text-[clamp(6rem,20vw,15rem)] leading-[0.8] text-white">{word}</p>
            <Button href={href} className="mb-2">
              {cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Green band (RiseUp) ---------- */

export function GreenBand({ title, body, image, position = "center", children }: { title: string; body: string; image: string; position?: string; children: ReactNode }) {
  return (
    <section className="bg-bronze text-white">
      <div className="wrap grid items-center gap-10 py-20 lg:grid-cols-2">
        <div>
          <h2 className="text-[clamp(2rem,3.6vw,3rem)] leading-[1.12]">{title}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed">{body}</p>
          <div className="mt-8 flex flex-wrap gap-4">{children}</div>
        </div>
        <div className="relative aspect-[5/3] overflow-hidden lg:ml-auto lg:w-[90%]">
          <Image src={image} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: position }} />
        </div>
      </div>
    </section>
  );
}
