import "server-only";

// Donations go through Bachs payment links: hosted checkout pages created in the Bachs dashboard.
// The site needs no API key, webhook or payment code of its own; card and bank details are only
// ever entered on Bachs' page. Set the links as environment variables and redeploy:
//
//   BACHS_PAYMENT_LINK_NGN       one-off gifts in naira          (defaults to NGN_LINK below)
//   BACHS_PAYMENT_LINK_USD       one-off gifts in US dollars     (optional)
//   BACHS_PAYMENT_LINK_MONTHLY   recurring monthly gifts         (optional)
//
// Create each link so the donor chooses the amount, and set its "after payment" redirect to
// https://<domain>/support/thank-you. Any link left unset is simply not offered.

/** The Foundation's naira donation link, used unless BACHS_PAYMENT_LINK_NGN overrides it. */
const NGN_LINK = "https://checkout.bachs.io/pay/pl_af3bb8de098d";

export type GivingOption = { id: "NGN" | "USD" | "monthly"; label: string; detail: string; href: string };

function httpsUrl(value: string | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function givingOptions(): GivingOption[] {
  const options: (GivingOption | null)[] = [
    withHref({ id: "NGN", label: "Give in Naira (₦)", detail: "Card, bank transfer and other local methods" }, process.env.BACHS_PAYMENT_LINK_NGN || NGN_LINK),
    withHref({ id: "USD", label: "Give in US Dollars ($)", detail: "For international cards" }, process.env.BACHS_PAYMENT_LINK_USD),
    withHref({ id: "monthly", label: "Give monthly", detail: "A regular gift that sustains the work" }, process.env.BACHS_PAYMENT_LINK_MONTHLY),
  ];
  return options.filter((o): o is GivingOption => o !== null);
}

function withHref(option: Omit<GivingOption, "href">, raw: string | undefined): GivingOption | null {
  const href = httpsUrl(raw);
  return href ? { ...option, href } : null;
}
