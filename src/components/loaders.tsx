"use client";

import { ImageLoader, InlineLoader, TextLoader } from "generative-loaders";

// Loading states in the CMF palette, from the generative-loaders package (MIT). Every loader
// respects reduced motion and announces itself politely to screen readers.

const BRONZE = "#a2601a";

/** A small working indicator for buttons and status lines. */
export function Working({ label = "Loading", size = 16, color = BRONZE }: { label?: string; size?: number; color?: string }) {
  return <InlineLoader variant="orbit" size={size} color={color} label={label} />;
}

/** A book-cover placeholder while the image or page loads. */
export function CoverPlaceholder({ size = 160, label = "Loading cover" }: { size?: number; label?: string }) {
  return <ImageLoader variant="bands" size={size} color={BRONZE} radius={3} label={label} />;
}

/** Placeholder lines for text on its way (chapters, messages, figures): each block is two shimmering lines. */
export function TextLines({ blocks = 3, size = "1.25rem", color = "currentColor", label = "Loading text" }: { blocks?: number; size?: string; color?: string; label?: string }) {
  return (
    <div aria-busy="true" aria-label={label} style={{ fontSize: size, color }}>
      {Array.from({ length: blocks }, (_, i) => (
        <TextLoader key={i} text="" variant="skeleton" color={color} aria-label={label} className="block" />
      ))}
    </div>
  );
}
