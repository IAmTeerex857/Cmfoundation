import "server-only";
import type { GivingCategory } from "./giving";

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
//
// Support categories (instructions §8.4). Create one Bachs link per category, named after it
// (e.g. "CMF: School fees and scholarships"), so every payment record shows its purpose:
//
//   BACHS_PAYMENT_LINK_SCHOLARSHIPS   BACHS_PAYMENT_LINK_LITERATURE   BACHS_PAYMENT_LINK_COMMUNITY
//
// General gifts use the main naira link. A category without its own link falls back to it.

/** The Foundation's naira donation link, used unless BACHS_PAYMENT_LINK_NGN overrides it. */
const NGN_LINK = "https://checkout.bachs.io/pay/pl_af3bb8de098d";

export type GivingOption = { id: "NGN" | "USD" | "monthly"; label: string; href: string };

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
    withHref({ id: "NGN", label: "Give" }, process.env.BACHS_PAYMENT_LINK_NGN || NGN_LINK),
    withHref({ id: "USD", label: "Give in US Dollars ($)" }, process.env.BACHS_PAYMENT_LINK_USD),
    withHref({ id: "monthly", label: "Give monthly" }, process.env.BACHS_PAYMENT_LINK_MONTHLY),
  ];
  return options.filter((o): o is GivingOption => o !== null);
}

/** Where "Donate" and "Give" buttons lead: straight to the main checkout, or the Support page if none is set. */
export function giveHref() {
  return givingOptions()[0]?.href ?? "/support#give";
}

function withHref(option: Omit<GivingOption, "href">, raw: string | undefined): GivingOption | null {
  const href = httpsUrl(raw);
  return href ? { ...option, href } : null;
}

const categoryEnv: Record<GivingCategory, string | undefined> = {
  general: undefined,
  scholarships: "BACHS_PAYMENT_LINK_SCHOLARSHIPS",
  literature: "BACHS_PAYMENT_LINK_LITERATURE",
  community: "BACHS_PAYMENT_LINK_COMMUNITY",
};

/** The checkout for one support category, and whether it is that category's own link. */
export function categoryLink(category: GivingCategory): { href: string; dedicated: boolean } {
  const env = categoryEnv[category];
  const own = env ? httpsUrl(process.env[env]) : undefined;
  return own ? { href: own, dedicated: true } : { href: giveHref(), dedicated: category === "general" };
}

/**
 * Bank details for local transfers, shown on the Support page: the Foundation's Zenith Bank accounts,
 * supplied on 23 November 2026. Set to null to hide the block.
 */
export const bankTransfer: { bank: string; accountName: string; accountNumbers: string[]; note?: string } | null = {
  bank: "Zenith Bank",
  accountName: "Chinwoke Mbadinuju Foundation",
  accountNumbers: ["1313554886", "1313554910"],
};
