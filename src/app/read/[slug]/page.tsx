import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ReaderLoader } from "@/components/reader/reader-loader";
import { TextReader } from "@/components/reader/text-reader";
import { bookHref, books, getBook } from "@/lib/books";
import { manuscriptPath, readableSlugs, textEdition } from "@/lib/manuscripts";
import { pageMetadata } from "@/lib/metadata";

// The reading interface for each book that can be read online. Books with a text edition
// (books/<slug>/edition.json) open in the text reader; a PDF-only title (the memorial brochure)
// opens in the page reader. Any other title sends visitors to its book page, which shows its status.
export const dynamicParams = false;

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/read/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};
  return {
    ...pageMetadata({
      title: `Read ${book.title}`,
      description: `Read ${book.title}${book.subtitle ? `: ${book.subtitle}` : ""} by ${book.author} free online. Part of the CMF Literature Series.`,
      path: `/read/${slug}`,
    }),
    // The book page (/books/<slug>) is the page for search engines; the reader points to it.
    alternates: { canonical: bookHref(slug) },
  };
}

export default async function ReadPage({ params }: PageProps<"/read/[slug]">) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  if (!readableSlugs().includes(slug)) redirect(bookHref(slug));

  const edition = textEdition(slug);
  if (edition) {
    return (
      <TextReader
        slug={slug}
        title={book.title}
        author={book.author}
        introEnds={edition.introEnds}
        sections={edition.sections.map(({ id, kind, number, title, subtitle, words }) => ({ id, kind, number, title, subtitle, words }))}
      />
    );
  }

  if (!manuscriptPath(slug)) redirect(bookHref(slug));
  return (
    <>
      <ReaderLoader book={{ slug: book.slug, title: book.title, author: book.author }} />
      <p className="hidden p-10 text-center print:block">CMF books can be read free online at the Chinwoke Mbadinuju Foundation website. Printing is not available.</p>
    </>
  );
}
