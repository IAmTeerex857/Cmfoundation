import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import Script from "next/script";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Runs before first paint so content that will animate in on scroll starts hidden (see globals.css).
const revealScript = `document.documentElement.classList.add("js-reveal")`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: "website",
    images: ["/images/students-reading.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0e2132",
};

// Root shell only. The public site's header and footer live in app/(site)/layout.tsx so the
// e-reader (app/read) can use the whole screen.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${geist.variable} ${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <Script id="reveal-init" strategy="beforeInteractive">
          {revealScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
