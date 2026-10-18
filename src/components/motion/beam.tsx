"use client";

import { BorderBeam, type BorderBeamProps } from "border-beam";

/** Client boundary for border-beam's gold glow, so server components can use it. */
export function Beam({ children, ...props }: BorderBeamProps) {
  return (
    <BorderBeam colorVariant="gold" theme="light" duration={5} strength={0.85} {...props}>
      {children}
    </BorderBeam>
  );
}
