import { site } from "@/lib/site";
import type { GivingOption } from "@/lib/payment-links";
import { Icon, type IconName } from "./icons";

const optionIcons: Record<GivingOption["id"], IconName> = { NGN: "heart", USD: "gift", monthly: "calendar" };

// The donation card in the Support hero. Each option opens a Bachs payment link, where the donor
// chooses the amount and pays securely.
export function GivePanel({ options }: { options: GivingOption[] }) {
  if (options.length === 0) {
    return (
      <div className="tile self-start bg-cream p-8">
        <h2 className="display-md">Online giving is coming soon</h2>
        <p className="mt-4 text-muted">
          In the meantime, please contact us at{" "}
          <a className="text-bronze underline" href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>{" "}
          or {site.contact.phone} and we&rsquo;ll help you give.
        </p>
      </div>
    );
  }

  return (
    <div className="self-start rounded-2xl bg-cream p-2">
      <div className="tile space-y-6 p-6 sm:p-8">
        <div>
          <h2 className="display-md">Give securely online</h2>
          <p className="mt-2 text-sm text-muted">Choose how you&rsquo;d like to give. You&rsquo;ll enter your amount on our secure checkout.</p>
        </div>

        <ul className="space-y-3">
          {options.map((o) => (
            <li key={o.id}>
              <a
                href={o.href}
                rel="noopener"
                className="group flex items-center gap-4 rounded-xl border border-line bg-cream p-4 transition-colors hover:border-bronze hover:bg-white"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-bronze text-white">
                  <Icon name={optionIcons[o.id]} className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-ink">{o.label}</span>
                  <span className="block text-sm text-muted">{o.detail}</span>
                </span>
                <Icon name="arrowUpRight" className="size-5 shrink-0 text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bronze" strokeWidth={2} />
              </a>
            </li>
          ))}
        </ul>

        <p className="rounded-xl bg-cream px-4 py-3 text-sm leading-relaxed text-muted">
          Would you like your gift to support something specific — books, education or community projects? Email{" "}
          <a className="text-bronze underline" href={`mailto:${site.contact.email}?subject=My%20gift%20to%20CMF`}>
            {site.contact.email}
          </a>{" "}
          after giving and we&rsquo;ll direct it accordingly.
        </p>

        <p className="flex items-center justify-center gap-2 text-xs text-muted">
          <Icon name="shield" className="size-4 text-bronze" /> Secure checkout by Bachs. Your payment details never touch this website.
        </p>
      </div>
    </div>
  );
}
