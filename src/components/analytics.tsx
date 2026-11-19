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
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-[4px] border border-line bg-white p-5 shadow-[0_24px_60px_-24px_rgba(12,31,66,0.45)] sm:p-6"
        >
          <p className="font-display text-lg text-ink">Help us understand how the library is used</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            With your permission we use Google Analytics cookies to count visits and see which books are read, so we can improve the site. We never send
            your name, email or notes to Google. You can change your mind at any time from &ldquo;Cookie settings&rdquo; at the foot of every page.{" "}
            <Link href="/privacy#cookies" className="text-bronze underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => decide("granted")}
              className="rounded-[3px] bg-bronze px-5 py-3 text-[0.78rem] font-semibold tracking-[0.08em] text-white uppercase hover:bg-bronze-dark"
            >
              Accept analytics
            </button>
            <button
              type="button"
              onClick={() => decide("denied")}
              className="rounded-[3px] border border-bronze px-5 py-3 text-[0.78rem] font-semibold tracking-[0.08em] text-bronze uppercase hover:bg-bronze hover:text-white"
            >
              Decline
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
