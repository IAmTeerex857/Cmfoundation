import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/book-cover";
import { AudiobookPlayer } from "@/components/books/audiobook-player";
import { CoverGallery } from "@/components/books/cover-gallery";
import { StatusBadge } from "@/components/books/status-badge";
import { TrackedLink, TrackView } from "@/components/books/track-view";
import { Icon } from "@/components/icons";
import { Button, GoldRule } from "@/components/ui";
import { type Book, bookHref, bookStatus, getBook, libraryBooks } from "@/lib/books";
import { isReadable, textEdition } from "@/lib/manuscripts";
import { site } from "@/lib/site";

// A permanent, shareable page for every title (instructions §5.2 and §5.3). Clicking a cover
// anywhere on the site opens this page; reading starts from here.
export const dynamicParams = false;

export function generateStaticParams() {
  return libraryBooks.map((b) => ({ slug: b.slug }));
}

function summary(book: Book) {
  return book.description ? `${book.description.split(". ").slice(0, 2).join(". ")}.` : `${book.title} by ${book.author}, from the CMF Literature Series.`;
}

export async function generateMetadata({ params }: PageProps<"/books/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};
  const cover = book.cover.type === "official" ? book.cover : null;
  const title = `${book.title}${book.subtitle ? `: ${book.subtitle}` : ""}`;
  const description = summary(book).slice(0, 300);
  const images = cover ? [{ url: cover.image, width: cover.width, height: cover.height, alt: `Cover of ${book.title}` }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: bookHref(slug) },
    openGraph: { type: "book", siteName: site.name, locale: "en_GB", url: bookHref(slug), title: `${title} | ${book.author}`, description, images, authors: [book.author] },
    twitter: { card: "summary_large_image", title, description, images: images?.map((i) => i.url) },
  };
}

const action = "flex w-full items-center justify-between gap-3 rounded-[3px] px-5 py-4 text-left text-[0.8rem] leading-tight font-semibold tracking-[0.08em] uppercase";

export default async function BookPage({ params }: PageProps<"/books/[slug]">) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book || book.listed === false) notFound();

  const readable = isReadable(slug);
  const status = bookStatus(book, readable);
  const edition = textEdition(slug);
  const contents = edition?.sections.filter((s) => s.kind === "prologue" || s.kind === "chapter" || s.kind === "part" || /^(preface|introduction|epilogue|conclusion)$/i.test(s.title)) ?? [];
  const start = edition?.sections.find((s) => s.id === edition.introEnds);
  const cover = book.cover.type === "official" ? book.cover : null;
  const others = libraryBooks.filter((b) => b.author === book.author && b.slug !== slug).slice(0, 4);

  // schema.org Book, for search engines (instructions §11.3).
  const structured = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
    author: { "@type": "Person", name: book.author },
    ...(book.year && book.collection !== "forthcoming" ? { datePublished: String(book.year) } : {}),
    ...(book.edition ? { publisher: { "@type": "Organization", name: `${site.name} (${book.edition.publisher})` }, bookEdition: book.edition.history } : {}),
    ...(book.edition?.isbn ? { isbn: book.edition.isbn } : {}),
    ...(book.edition?.pages ? { numberOfPages: book.edition.pages } : {}),
    inLanguage: "en",
    ...(book.description ? { description: book.description } : {}),
    ...(cover ? { image: `${site.url}${cover.image}` } : {}),
    url: `${site.url}${bookHref(slug)}`,
    ...(readable ? { isAccessibleForFree: true, potentialAction: { "@type": "ReadAction", target: `${site.url}/read/${slug}` } } : {}),
  };

  const details: [string, string | number | undefined][] = [
    ["Author", book.author],
    ["Subtitle", book.subtitle],
    ["Published", book.edition?.history ?? (book.collection === "forthcoming" ? `Forthcoming${book.year ? `, ${book.year}` : ""}` : book.year ? String(book.year) : undefined)],
    ["Series", book.edition?.publisher],
    ["Format", book.edition?.format],
    ["Pages", book.edition?.pages],
    ["ISBN", book.edition?.isbn],
    ["Language", book.edition?.language],
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
      <TrackView event="book_page_view" params={{ book: slug, status }} />

      <nav aria-label="Breadcrumb" className="wrap pt-6 text-sm text-muted">
        <Link href="/literature" className="hover:text-bronze">
          Literature
        </Link>
        <span className="mx-2">/</span>
        <Link href="/literature#library" className="hover:text-bronze">
          Library
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{book.title}</span>
      </nav>

      <section className="wrap grid gap-12 pt-8 pb-16 lg:grid-cols-[22rem_1fr] lg:gap-16 lg:pb-20">
        <div>{cover ? <CoverGallery title={book.title} author={book.author} front={cover} back={book.back} /> : <BookCover book={book} className="mx-auto w-full max-w-[22rem]" />}</div>

        <div>
          <StatusBadge status={status} />
          <h1 className="display-xl mt-4 lg:text-[clamp(2.6rem,4vw,3.6rem)]">{book.title}</h1>
          {book.subtitle && <p className="mt-3 font-display text-[1.45rem] leading-snug text-body italic">{book.subtitle}</p>}
          <p className="mt-4 text-[1.05rem] text-ink">
            by <span className="font-semibold">{book.author}</span>
          </p>
          <GoldRule className="mt-7" />

          {book.description ? (
            <p className="mt-7 max-w-2xl text-[1.08rem] leading-relaxed text-body">{book.description}</p>
          ) : (
            <p className="mt-7 max-w-2xl leading-relaxed text-muted">A full description of this title will be added when its edition is published online.</p>
          )}

          {/* Reading and purchasing options (§5.3 E) */}
          <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-2">
            {readable ? (
              <Link href={`/read/${slug}`} className={`${action} bg-bronze text-white hover:bg-bronze-dark sm:col-span-2`}>
                <span>
                  Read Free Online
                  <span className="mt-1 block text-[0.78rem] font-normal tracking-normal normal-case opacity-90">
                    Opens at the beginning of the book{start ? `. You can go straight to the ${start.title}.` : "."} No account needed.
                  </span>
                </span>
                <Icon name="arrow" className="size-5 shrink-0" />
              </Link>
            ) : (
              <p className={`${action} cursor-default border border-line bg-white text-muted sm:col-span-2`} aria-disabled="true">
                {status === "coming-soon" ? "Coming Soon" : status === "forthcoming" ? "Forthcoming" : "Online edition in preparation"}
              </p>
            )}

            {book.audiobook?.status === "available" ? (
              <a href="#audiobook" className={`${action} border border-bronze text-bronze hover:bg-bronze hover:text-white`}>
                Listen to Audiobook <Icon name="arrowDown" className="size-4" />
              </a>
            ) : book.audiobook?.status === "coming-soon" ? (
              <p className={`${action} cursor-default border border-dashed border-line text-muted`} aria-disabled="true">
                Audiobook Coming Soon
              </p>
            ) : null}

            {book.amazonUrl && (
              <TrackedLink href={book.amazonUrl} event="amazon_click" params={{ book: slug }} className={`${action} border border-bronze text-bronze hover:bg-bronze hover:text-white`}>
                <span>
                  Buy on Amazon
                  <span className="mt-1 block text-[0.72rem] font-normal tracking-normal normal-case opacity-80">External retailer, opens in a new tab</span>
                </span>
                <Icon name="arrowUpRight" className="size-4 shrink-0" />
              </TrackedLink>
            )}

            {book.orderable && (
              <Link href={`/books/order?book=${slug}`} className={`${action} border border-ink text-ink hover:bg-ink hover:text-white sm:col-span-2`}>
                <span>
                  Order Institutional &amp; Commemorative Copies from CMF
                  <span className="mt-1 block text-[0.78rem] font-normal tracking-normal normal-case opacity-80">
                    For schools, churches, organisations, libraries, presentations and bulk orders.
                  </span>
                </span>
                <Icon name="arrow" className="size-5 shrink-0" />
              </Link>
            )}
          </div>

          {/* Bibliographic information (§5.3 C) */}
          <dl className="mt-12 grid max-w-2xl grid-cols-[8rem_1fr] gap-x-6 gap-y-3 border-t border-line pt-8 text-[0.95rem]">
            {details
              .filter(([, v]) => v !== undefined && v !== "")
              .map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
          </dl>
        </div>
      </section>

      {book.audiobook?.status === "available" && (
        <section id="audiobook" className="scroll-mt-24 border-t border-line py-14">
          <div className="wrap grid gap-8 lg:grid-cols-[22rem_1fr] lg:gap-16">
            <div>
              <p className="eyebrow">Audiobook</p>
              <h2 className="display-md mt-3">Listen to {book.title}</h2>
            </div>
            <AudiobookPlayer slug={slug} title={book.title} src={book.audiobook.src} chapters={book.audiobook.chapters} />
          </div>
        </section>
      )}

      {contents.length > 0 && (
        <section className="border-t border-line bg-blush/60 py-14 lg:py-16">
          <div className="wrap grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
            <div>
              <p className="eyebrow">Inside the book</p>
              <h2 className="display-md mt-3">Contents</h2>
              {readable && (
                <Button href={`/read/${slug}`} className="mt-7">
                  Start Reading
                </Button>
              )}
            </div>
            <ol className="columns-1 gap-10 text-[0.98rem] sm:columns-2">
              {contents.map((s) => (
                <li key={s.id} className={`break-inside-avoid py-1.5 ${s.kind === "part" ? "mt-3 font-semibold text-ink" : "text-body"}`}>
                  {readable ? (
                    <Link href={`/read/${slug}#${s.id}`} className="hover:text-bronze">
                      {s.kind === "chapter" && s.number ? <span className="mr-2 text-muted">{s.number}.</span> : null}
                      {s.title}
                      {s.subtitle && s.kind === "part" ? <span className="block text-sm font-normal text-muted">{s.subtitle}</span> : null}
                    </Link>
                  ) : (
                    s.title
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="border-t border-line py-14 lg:py-16">
          <div className="wrap">
            <h2 className="display-md">More by {book.author}</h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {others.map((b) => (
                <li key={b.slug} className="max-w-[10rem]">
                  <Link href={bookHref(b.slug)} className="group block">
                    <BookCover book={b} className="book-tilt w-full" />
                    <span className="mt-3 block font-display text-[1.05rem] leading-snug text-ink group-hover:text-bronze">{b.title}</span>
                  </Link>
                  <StatusBadge status={bookStatus(b, isReadable(b.slug))} className="mt-2" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
