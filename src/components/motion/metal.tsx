"use client";

import { MetalFx, type MetalFxProps } from "metal-fx";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * metal-fx's liquid-gold WebGL finish. It can only decide between the shader and its plain fallback
 * in the browser, so the server (and first client render) show the plain child, and the effect
 * mounts right after hydration.
 */
export function Metal({ children, className = "", ...props }: MetalFxProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!mounted) return <div className={className}>{children}</div>;
  return (
    <MetalFx preset="gold" theme="light" className={className} {...props}>
      {children}
    </MetalFx>
  );
}
