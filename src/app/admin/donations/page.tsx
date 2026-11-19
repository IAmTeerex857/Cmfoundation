import { db, dbConfigured } from "@/lib/db";
import { givingFocuses } from "@/lib/giving";
import { currentAdmin } from "@/lib/reader-auth";
import { recordDonation, recordSponsorship } from "../actions";

// Donations are recorded only once confirmed in the payment provider's dashboard or a bank statement
// (instructions §9.6), and kept separate from book orders and sponsorships (§8.4).

type Donation = { id: string; received_on: string; amount: number; currency: string; category: string; method: string; reference: string | null; donor_name: string | null; recorded_by: string | null };
type Sponsorship = { id: string; organisation: string; arrangement: string; amount: number | null; currency: string | null; status: string; starts_on: string | null };

const input = "w-full rounded-xl border border-black/[0.08] bg-[#faf7f2] px-3 py-2.5 text-sm outline-none focus:border-bronze focus:bg-white";

export default async function Donations() {
  if (!(await currentAdmin()) || !dbConfigured()) return null;
  const [donations, sponsorships] = await Promise.all([
    db.select<Donation>("donations", { order: "received_on.desc", limit: 200 }),
    db.select<Sponsorship>("sponsorships", { order: "created_at.desc", limit: 100 }),
  ]);
  return (
    <div>
      <h1 className="font-display text-[clamp(2.4rem,4vw,3.4rem)] leading-none">Donations &amp; sponsorships</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Record each gift after confirming it in the payment partner&rsquo;s dashboard or on the bank statement. A visit to the thank-you page is not proof
        of payment.
      </p>

      <form action={recordDonation} className="mt-6 grid gap-3 rounded-[22px] bg-white ring-1 ring-black/[0.05] p-5 sm:grid-cols-4">
        <label className="text-sm">
          Date received
          <input type="date" name="received_on" required className={input} />
        </label>
        <label className="text-sm">
          Amount
          <input name="amount" required inputMode="decimal" className={input} />
        </label>
        <label className="text-sm">
          Currency
          <select name="currency" className={input}>
            <option>NGN</option>
            <option>USD</option>
            <option>GBP</option>
            <option>EUR</option>
          </select>
        </label>
        <label className="text-sm">
          Purpose
          <select name="category" className={input}>
            {givingFocuses.map((f) => (
              <option key={f.id} value={f.id}>
                {f.tab}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Method
          <select name="method" className={input}>
            <option value="online">Online checkout</option>
            <option value="bank-transfer">Bank transfer</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="text-sm">
          Payment reference
          <input name="reference" className={input} />
        </label>
        <label className="text-sm">
          Donor name (optional)
          <input name="donor_name" className={input} />
        </label>
        <label className="text-sm">
          Donor email (optional)
          <input name="donor_email" type="email" className={input} />
        </label>
        <label className="text-sm sm:col-span-3">
          Note
          <input name="note" className={input} />
        </label>
        <button className="self-end rounded-xl bg-bronze px-4 py-2.5 text-sm font-semibold text-white">Record donation</button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-[22px] bg-white ring-1 ring-black/[0.05]">
        <table className="w-full text-sm">
          <thead className="bg-[#faf8f4] text-left text-xs text-muted uppercase">
            <tr>
              {["Date", "Amount", "Purpose", "Method", "Reference", "Donor", "Recorded by"].map((h) => (
                <th key={h} className="px-3 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-muted">
                  No donations recorded yet.
                </td>
              </tr>
            )}
            {donations.map((d) => (
              <tr key={d.id} className="border-t border-line">
                <td className="px-3 py-2">{d.received_on}</td>
                <td className="px-3 py-2 tabular-nums">
                  {d.currency} {Number(d.amount).toLocaleString("en-NG")}
                </td>
                <td className="px-3 py-2 capitalize">{d.category}</td>
                <td className="px-3 py-2">{d.method}</td>
                <td className="px-3 py-2">{d.reference ?? "–"}</td>
                <td className="px-3 py-2">{d.donor_name ?? "–"}</td>
                <td className="px-3 py-2 text-muted">{d.recorded_by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-[1.15rem] font-medium">Sponsorships and project collaborations</h2>
      <form action={recordSponsorship} className="mt-4 grid gap-3 rounded-[22px] bg-white ring-1 ring-black/[0.05] p-5 sm:grid-cols-4">
        <label className="text-sm sm:col-span-2">
          Organisation
          <input name="organisation" required className={input} />
        </label>
        <label className="text-sm sm:col-span-2">
          Arrangement
          <input name="arrangement" required placeholder="e.g. Book-printing sponsorship" className={input} />
        </label>
        <label className="text-sm">
          Amount (optional)
          <input name="amount" inputMode="decimal" className={input} />
        </label>
        <label className="text-sm">
          Currency
          <select name="currency" className={input}>
            <option>NGN</option>
            <option>USD</option>
          </select>
        </label>
        <label className="text-sm">
          Status
          <select name="status" className={input}>
            {["proposed", "approved", "active", "completed", "declined"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <button className="self-end rounded-xl bg-bronze px-4 py-2.5 text-sm font-semibold text-white">Add</button>
      </form>
      <ul className="mt-4 space-y-2 text-sm">
        {sponsorships.map((s) => (
          <li key={s.id} className="flex flex-wrap justify-between gap-3 rounded-[22px] bg-white ring-1 ring-black/[0.05] px-4 py-3">
            <span>
              <strong>{s.organisation}</strong> · {s.arrangement}
            </span>
            <span className="text-muted">
              {s.amount ? `${s.currency} ${Number(s.amount).toLocaleString("en-NG")} · ` : ""}
              {s.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
