import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Public_Sans } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const publicSans = Public_Sans({
  variable: "--font-public",
  subsets: ["latin"],
});

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
    images: ["/images/children-community.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0e2132",
};

// Root shell only. The public site's header and footer live in app/(site)/layout.tsx so the
// e-reader (app/read) can use the whole screen.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${bebas.variable} ${publicSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
