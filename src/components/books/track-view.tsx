"use client";

import { useEffect } from "react";
import { type AnalyticsEvent, track } from "@/lib/analytics";

/** Records one analytics event when a page is shown (e.g. a book page opened). */
export function TrackView({ event, params }: { event: AnalyticsEvent; params: Record<string, string> }) {
  useEffect(() => {
    track(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/** An outbound purchase link that records the click (instructions §7.2). */
export function TrackedLink({ href, event, params, className, children }: { href: string; event: AnalyticsEvent; params: Record<string, string>; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className={className} onClick={() => track(event, params)}>
      {children}
    </a>
  );
}
