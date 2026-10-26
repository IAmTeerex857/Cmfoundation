import type { MetadataRoute } from "next";
import { readableSlugs } from "@/lib/manuscripts";
import { site } from "@/lib/site";

const routes = ["", "/about", "/founder", "/founder/gallery", "/literature", "/our-work", "/events", "/support", "/contact", "/privacy", "/terms", "/donation-policy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((r) => ({ url: `${site.url}${r}`, changeFrequency: "monthly" as const, priority: r === "" ? 1 : 0.7 })),
    ...readableSlugs().map((slug) => ({ url: `${site.url}/read/${slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
