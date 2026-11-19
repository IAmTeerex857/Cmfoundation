import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Book PDFs sit outside /public (see books/README.md). Ship them with the route that streams
  // them to the reader, since that route reads them from disk at request time.
  outputFileTracingIncludes: {
    "/api/books/*": ["./books/**/*.pdf"],
    "/api/books/*/sections/*": ["./books/**/edition.json"],
    "/read/*": ["./books/**/edition.json"],
    "/books/*": ["./books/**/edition.json"],
  },
  // Short links for printed QR codes and shared posts. Each lands on its page with campaign
  // tracking (UTM) attached, so the source shows in Google Analytics. See docs/ANALYTICS.md.
  async redirects() {
    const launch = "/events/book-presentation-2026";
    const utm = (source: string, medium: string, campaign = "nov24-book-presentation") =>
      `utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
    return [
      { source: "/qr", destination: `${launch}?${utm("qr", "print")}`, permanent: false },
      { source: "/qr/library", destination: `/literature?${utm("qr", "print")}#library`, permanent: false },
      { source: "/wa", destination: `${launch}?${utm("whatsapp", "social")}`, permanent: false },
      { source: "/li", destination: `${launch}?${utm("linkedin", "social")}`, permanent: false },
      { source: "/press", destination: `/?${utm("media", "referral", "media-coverage")}`, permanent: false },
    ];
  },
};

export default nextConfig;
