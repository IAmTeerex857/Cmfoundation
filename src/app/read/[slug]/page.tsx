import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReaderLoader } from "@/components/reader/reader-loader";
import { getBook } from "@/lib/books";
import { readableSlugs } from "@/lib/manuscripts";
import { pageMetadata } from "@/lib/metadata";

// One reader page per book whose PDF is in books/. Adding a PDF and redeploying publishes it.
export const dynamicParams = false;

export function generateStaticParams() {
  return readableSlugs().map((slug) => ({ slug }));
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
  if (!book || !readableSlugs().includes(slug)) notFound();

  return (
    <>
      <ReaderLoader book={{ slug: book.slug, title: book.title, author: book.author }} />
      <p className="hidden p-10 text-center print:block">CMF books can be read free online at the Chinwoke Mbadinuju Foundation website. Printing is not available.</p>
    </>
  );
}
