import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { defaultTitle, shareImage } from "@/lib/metadata";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// Serif for page headings and quotes, as in the Foundation's page designs. Self-hosted EB Garamond
// (variable weight, Latin subset, from Fontsource 5.3.0; licence in fonts/EB-Garamond-OFL.txt).
const garamond = localFont({
  variable: "--font-garamond",
  src: [
    { path: "./fonts/eb-garamond-latin-wght-normal.woff2", weight: "400 800", style: "normal" },
    { path: "./fonts/eb-garamond-latin-wght-italic.woff2", weight: "400 800", style: "italic" },
  ],
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
    default: defaultTitle,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Chinwoke Mbadinuju Foundation",
    "CMF",
    "Dr Chinwoke Clement Mbadinuju",
    "CMF Literature Series",
    "Christian books",
    "free Christian literature",
    "education",
    "community development",
    "Nigeria",
    "Anambra",
    "charity",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: { type: "website", siteName: site.name, locale: "en_GB", title: defaultTitle, description: site.description, images: [shareImage] },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.description, images: [shareImage] },
};

export const viewport: Viewport = {
  themeColor: "#0e2132",
};

// Root shell only. The public site's header and footer live in app/(site)/layout.tsx so the
// e-reader (app/read) can use the whole screen.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${geist.variable} ${garamond.variable} ${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <Script id="reveal-init" strategy="beforeInteractive">
          {revealScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
