"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

// Google Analytics 4 and Google Tag Manager, loaded only after the visitor accepts analytics cookies.
//   NEXT_PUBLIC_GA_ID   (G-XXXXXXXXXX)  GA4, installed directly: page views and the site's events (lib/analytics.ts).
//   NEXT_PUBLIC_GTM_ID  (GTM-XXXXXXX)   the Foundation's Tag Manager container, for any further tags.
// Both can be set. Do NOT also add a GA4 tag for the same measurement ID inside Tag Manager, or
// visits are counted twice. With neither set, no banner is shown and nothing is loaded.
//
// The choice is kept in this browser. "Cookie settings" in the footer reopens the banner.

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim();
const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();
const KEY = "cmf:consent";
export const OPEN_CONSENT_EVENT = "cmf:open-consent";

type Choice = "granted" | "denied";

function stored(): Choice | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function Analytics() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const c = stored();
    // The saved choice lives in browser storage, readable only after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(c);
    setOpen(c === null);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!GTM_ID && !GA_ID) return null;

  const decide = (c: Choice) => {
    try {
      window.localStorage.setItem(KEY, c);
    } catch {}
    // Withdrawing consent after tags have loaded needs a reload to stop them.
    if (choice === "granted" && c === "denied") window.location.reload();
    setChoice(c);
    setOpen(false);
  };

  return (
    <>
      {choice === "granted" && GTM_ID && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
      {choice === "granted" && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {open && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie preferences"
          className="fixed bottom-4 left-4 z-[60] w-[calc(100%-2rem)] max-w-[22rem] rounded-2xl border border-line bg-white p-5 shadow-[0_18px_50px_-20px_rgba(12,31,66,0.35)]"
        >
          <p className="text-[0.95rem] leading-relaxed text-ink">We use cookies to see which books are read and to improve the library.</p>
          <Link href="/privacy#cookies" className="mt-2 inline-block text-sm font-medium text-ink underline underline-offset-2 hover:text-bronze">
            Read our Privacy Policy
          </Link>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => decide("denied")}
              className="rounded-full border border-ink/80 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Reject All
            </button>
            <button
              type="button"
              onClick={() => decide("granted")}
              className="rounded-full bg-bronze px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-bronze-dark"
            >
              Accept All
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Footer link that reopens the cookie banner. Hidden when no analytics is configured. */
export function CookieSettingsLink({ className = "" }: { className?: string }) {
  if (!GTM_ID && !GA_ID) return null;
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>
      Cookie settings
    </button>
  );
}
