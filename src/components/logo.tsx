import Image from "next/image";
import Link from "next/link";

export function Logo({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-3 ${className}`} aria-label="Chinwoke Mbadinuju Foundation, home">
      <Image
        src="/images/logo-mark.png"
        alt=""
        width={419}
        height={283}
        priority
        className="h-10 w-auto transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-110"
      />
      <span className={`font-display text-[0.95rem] leading-[1.1] font-semibold tracking-[0.06em] whitespace-nowrap uppercase ${tone === "dark" ? "text-ink" : "text-white"}`}>
        Chinwoke Mbadinuju
        <br />
        Foundation
      </span>
    </Link>
  );
}
