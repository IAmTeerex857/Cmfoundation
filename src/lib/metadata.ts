import type { Metadata } from "next";
import { site } from "./site";

// Shared page metadata: title, description, canonical URL and the social share card.

export const defaultTitle = `${site.name} | ${site.tagline}`;

/** The social share card (1200 × 630), used by every page. */
export const shareImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Chinwoke Mbadinuju Foundation: Knowledge changes lives. A better tomorrow is possible. Christian literature, education and community development in Nigeria.",
};

/**
 * Metadata for one page. Next.js replaces (rather than merges) the openGraph and twitter objects
 * of a parent layout, so the shared fields are repeated here.
 */
export function pageMetadata({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const fullTitle = title ? `${title} | ${site.name}` : defaultTitle;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: site.name, locale: "en_GB", url: path, title: fullTitle, description, images: [shareImage] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [shareImage] },
  };
}
