import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Book PDFs sit outside /public (see books/README.md). Ship them with the route that streams
  // them to the reader, since that route reads them from disk at request time.
  outputFileTracingIncludes: {
    "/api/books/*": ["./books/**/*.pdf"],
  },
};

export default nextConfig;
