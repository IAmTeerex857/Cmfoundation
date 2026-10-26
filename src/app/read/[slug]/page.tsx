import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/book-cover";
import { Logo } from "@/components/logo";
import { ReaderLoader } from "@/components/reader/reader-loader";
import { books, getBook } from "@/lib/books";
import { readableSlugs } from "@/lib/manuscripts";
import { pageMetadata } from "@/lib/metadata";

// One reader page per published book. Books whose PDF is in books/ open in the reader; the rest show
// that their online edition is being prepared. Adding a PDF and redeploying publishes it.
export const dynamicParams = false;

export function generateStaticParams() {
  const readable = readableSlugs();
  return books.filter((b) => b.collection !== "forthcoming" || readable.includes(b.slug)).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/read/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};
  return pageMetadata({
    title: `Read ${book.title}`,
    description: `Read ${book.title}${book.subtitle ? `: ${book.subtitle}` : ""} by ${book.author} free online. Part of the CMF Literature Series.`,
    path: `/read/${slug}`,
  });
}

export default async function ReadPage({ params }: PageProps<"/read/[slug]">) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  if (!readableSlugs().includes(slug)) {
    if (book.collection === "forthcoming") notFound();
    return <ComingSoon slug={slug} />;
  }

  return (
    <>
      <ReaderLoader book={{ slug: book.slug, title: book.title, author: book.author }} />
      <p className="hidden p-10 text-center print:block">CMF books can be read free online at the Chinwoke Mbadinuju Foundation website. Printing is not available.</p>
    </>
  );
}

function ComingSoon({ slug }: { slug: string }) {
  const book = getBook(slug)!;
  return (
    <main className="flex min-h-dvh flex-col bg-gradient-to-r from-[#f8ecd9] via-blush to-blush">
      <div className="wrap py-6">
        <Logo />
      </div>
      <div className="wrap grid flex-1 items-center gap-10 pb-16 sm:grid-cols-[13rem_1fr] sm:gap-12">
        <BookCover book={book} className="w-40 sm:w-full" />
        <div>
          <p className="eyebrow">The CMF Literature Series</p>
          <h1 className="display-lg mt-3">{book.title}</h1>
          <p className="mt-2 text-body">{book.author}</p>
          <p className="mt-6 max-w-lg leading-relaxed text-body">
            The online edition of this book is being prepared and will be free to read here soon. In the meantime, we can send you a copy.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/contact?enquiry=books&book=${book.slug}`}
              className="inline-flex items-center rounded-[3px] bg-bronze px-6 py-3.5 text-[0.82rem] leading-none font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-bronze-dark"
            >
              Request a Copy
            </Link>
            <Link
              href="/literature#library"
              className="inline-flex items-center rounded-[3px] border border-bronze px-6 py-3.5 text-[0.82rem] leading-none font-semibold tracking-[0.08em] text-bronze uppercase transition-colors hover:bg-bronze hover:text-white"
            >
              Back to the Library
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
