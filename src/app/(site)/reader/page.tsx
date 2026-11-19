import type { Metadata } from "next";
import { Account } from "@/components/reader-account/account";
import { libraryBooks } from "@/lib/books";

export const metadata: Metadata = { title: "Your Reader Account", robots: { index: false } };

export default async function ReaderPage({ searchParams }: PageProps<"/reader">) {
  const { welcome, signedin } = await searchParams;
  return (
    <section className="py-14 lg:py-20">
      <div className="wrap max-w-3xl">
        <p className="eyebrow">Free reader account</p>
        <h1 className="display-lg mt-4">Your Reading</h1>
        <div className="mt-10">
          <Account books={libraryBooks.map((b) => ({ slug: b.slug, title: b.title, author: b.author }))} welcome={welcome === "1"} signedIn={signedin === "1"} />
        </div>
      </div>
    </section>
  );
}
