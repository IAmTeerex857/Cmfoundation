import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/reader-account/forms";
import { safeNextPath } from "@/lib/paths";

export const metadata: Metadata = { title: "Reader Sign-in", robots: { index: false } };

export default async function SignInPage({ searchParams }: PageProps<"/reader/sign-in">) {
  const { next, expired } = await searchParams;
  return (
    <section className="py-14 lg:py-20">
      <div className="wrap max-w-xl">
        <p className="eyebrow">Free reader account</p>
        <h1 className="display-lg mt-4">Sign in</h1>
        {expired && (
          <p role="alert" className="mt-5 rounded-[3px] border border-line bg-blush px-4 py-3 text-sm text-ink">
            That link has expired or has already been replaced. Enter your email and we&rsquo;ll send a new one.
          </p>
        )}
        <p className="mt-4 leading-relaxed text-body">Enter the email address you registered with. We&rsquo;ll send you a link that signs you in. No password is needed.</p>
        <div className="mt-8">
          <SignInForm next={safeNextPath(next)} />
        </div>
        <p className="mt-6 text-sm text-muted">
          New here?{" "}
          <Link href="/reader/register" className="text-bronze underline">
            Create a free reader account
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
