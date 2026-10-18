"use client";

import { InlineLoader } from "generative-loaders";
import dynamic from "next/dynamic";

// The reader draws with canvas and PDF.js and reads browser-only preferences, so it renders on the
// client. The fallback mirrors its frame so the page doesn't jump while it loads.
const BookReader = dynamic(() => import("./book-reader").then((m) => m.BookReader), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex flex-col bg-navy">
      <div className="h-14 shrink-0 border-b border-white/10 sm:h-16" />
      <div className="flex flex-1 items-center justify-center bg-[#e9e3d8]">
        <InlineLoader variant="fold" size={34} color="var(--color-bronze)" label="Loading the reader" />
      </div>
    </div>
  ),
});

export function ReaderLoader(props: { book: { slug: string; title: string; author: string } }) {
  return <BookReader {...props} />;
}
