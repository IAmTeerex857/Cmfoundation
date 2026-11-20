import type { MetadataRoute } from "next";
import { bookHref, bookPages } from "@/lib/books";
import { isReadable } from "@/lib/manuscripts";
import { site } from "@/lib/site";

const routes = [
  "",
  "/about",
  "/founder",
  "/founder/gallery",
  "/founder/tributes",
  "/founder/words-on-marble/dateline-1995",
  "/founder/words-on-marble/dateline-2016",
  "/literature",
  "/our-work",
  "/events",
  "/events/book-presentation-2026",
  "/support",
  "/books/order",
  "/contact",
  "/privacy",
  "/terms",
  "/donation-policy",
];

// Every book has its own indexable page (instructions §11.3). The reader itself is not indexed;
// search engines are pointed to the book pages.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((r) => ({ url: `${site.url}${r}`, changeFrequency: "monthly" as const, priority: r === "" ? 1 : 0.7 })),
    ...bookPages.map((b) => ({ url: `${site.url}${bookHref(b.slug)}`, changeFrequency: "monthly" as const, priority: isReadable(b.slug) ? 0.9 : 0.6 })),
  ];
}
