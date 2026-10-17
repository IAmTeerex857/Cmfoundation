import Image from "next/image";
import Link from "next/link";

export function Logo({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`} aria-label="Chinwoke Mbadinuju Foundation — home">
      <Image src="/images/logo-mark.png" alt="" width={419} height={283} priority className="h-10 w-auto" />
      <span className={`font-display text-[1.35rem] leading-[0.95] whitespace-nowrap uppercase ${tone === "dark" ? "text-ink" : "text-white"}`}>
        Chinwoke Mbadinuju
        <br />
        Foundation
      </span>
    </Link>
  );
}
