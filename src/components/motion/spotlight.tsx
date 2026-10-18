"use client";

import type { HTMLAttributes, PointerEvent } from "react";

/**
 * A surface with a soft light that follows the pointer. The light is drawn by the `spotlight`
 * child layer; this component only tracks the pointer position as CSS variables.
 */
export function Spotlight({ children, className = "", onPointerMove, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - box.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - box.top}px`);
    onPointerMove?.(e);
  };
  return (
    <div onPointerMove={move} className={`relative isolate ${className}`} {...rest}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(255 255 255 / 0.22), transparent 60%)" }}
      />
      {children}
    </div>
  );
}
