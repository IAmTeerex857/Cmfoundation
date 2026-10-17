import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only z-[60] rounded-lg bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
