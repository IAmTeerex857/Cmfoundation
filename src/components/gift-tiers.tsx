import Link from "next/link";

// Suggested gifts, styled after RiseUp's donation rows. Amounts are a guide: donors choose the exact
// amount on the Bachs checkout, so every row leads to the giving options at the top of /support.
const tiers = [
  {
    amount: 10_000,
    title: "Share a Book",
    body: "Help keep the CMF Literature Series free to read online for everyone.",
    points: ["Digitising earlier works", "Free online library", "New releases"],
    tone: "bg-parchment text-ink",
  },
  {
    amount: 25_000,
    title: "Support a Learner",
    body: "Back schools, students and learning initiatives in the communities we serve.",
    points: ["Learning materials", "School support", "Literacy initiatives"],
    tone: "bg-bronze text-white",
  },
  {
    amount: 50_000,
    title: "Strengthen a Community",
    body: "Fund practical projects such as clean water and community infrastructure.",
    points: ["Clean water projects", "Community infrastructure", "Local partnerships"],
    tone: "bg-navy text-white",
  },
];

export function GiftTiers() {
  return (
    <div className="mx-auto max-w-3xl border-t border-tan/60">
      {tiers.map((t) => (
        <div key={t.title} className="grid gap-8 border-b border-tan/60 py-12 sm:grid-cols-2 sm:gap-10">
          <div className="flex flex-col">
            <p className="text-5xl font-normal tracking-tight text-ink">
              <span className="mr-1 align-[0.6em] text-xl text-bronze">₦</span>
              {t.amount.toLocaleString("en-NG")}
            </p>
            <p className="mt-2 text-sm text-muted">Suggested gift · or any amount you choose</p>
            <p className="mt-8 text-lg leading-relaxed text-muted">{t.body}</p>
            <Link
              href="/support#give"
              className="mt-8 self-start border border-ink px-8 py-3.5 text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Donate Now
            </Link>
          </div>
          <div className={`flex min-h-72 flex-col p-10 ${t.tone}`}>
            <h3 className="text-2xl">{t.title}</h3>
            <ol className="mt-auto space-y-5 pt-12">
              {t.points.map((p, i) => (
                <li key={p}>
                  {String(i + 1).padStart(2, "0")}. {p}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ))}
    </div>
  );
}
