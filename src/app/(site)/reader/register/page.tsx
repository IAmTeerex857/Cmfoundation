import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/reader-account/forms";
import { GoldRule } from "@/components/ui";
import { getBook } from "@/lib/books";
import { safeNextPath } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Create a Free Reader Account",
  description: "An optional free account for readers of the CMF Literature Series. Reading never requires an account.",
  robots: { index: false },
};

export default async function RegisterPage({ searchParams }: PageProps<"/reader/register">) {
  const { next, book, unknown } = await searchParams;
  const b = typeof book === "string" ? getBook(book) : undefined;
  return (
    <section className="py-14 lg:py-20">
      <div className="wrap grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <p className="eyebrow">Free reader account</p>
          <h1 className="display-lg mt-4">Create a Free Reader Account</h1>
          {unknown && (
            <p role="status" className="mt-5 rounded-[3px] border border-line bg-blush px-4 py-3 text-sm text-ink">
              We couldn&rsquo;t find a reader account for that email address. Create one below; it only takes a moment.
            </p>
          )}
          <p className="mt-4 max-w-xl leading-relaxed text-body">
            Optional, and free. Every book can be read in full without an account{b ? `, including ${b.title}` : ""}. No donation or payment is ever needed.
          </p>
          <div className="mt-8">
            <RegisterForm next={safeNextPath(next)} book={b?.slug} />
          </div>
        </div>

        {/* Privacy statement beside the form (instructions §10.3) */}
        <aside className="self-start bg-blush p-7 sm:p-9" aria-labelledby="privacy-heading">
          <h2 id="privacy-heading" className="display-sm">
            Your privacy matters to us.
          </h2>
          <GoldRule className="mt-4" />
          <div className="mt-5 space-y-4 text-[0.95rem] leading-relaxed text-body">
            <p>We collect your name, location and email address to create and manage your free CMF reader account and provide your chosen reading features.</p>
            <p>Your personal notes remain private unless you choose to share them with the Foundation.</p>
            <p>
              We will not use your registration as permission to send promotional emails. You may separately subscribe to publication announcements and
              Foundation updates.
            </p>
            <p>You may request access to, correction of or deletion of your personal information, subject to applicable legal requirements.</p>
            <p>
              Read our full{" "}
              <Link href="/privacy" className="text-bronze underline">
                Privacy Policy
              </Link>{" "}
              for further information.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
