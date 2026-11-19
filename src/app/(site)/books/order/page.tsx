import type { Metadata } from "next";
import { OrderForm } from "@/components/books/order-form";
import { Icon, type IconName } from "@/components/icons";
import { GoldRule } from "@/components/ui";
import { books, getBook } from "@/lib/books";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Order Institutional & Commemorative Copies",
  description: "Order printed copies of CMF publications for schools, churches, organisations, libraries, commemorative presentations and bulk purchases.",
  path: "/books/order",
});

const audiences: [IconName, string][] = [
  ["cap", "Schools and colleges"],
  ["building", "Churches and ministries"],
  ["handshake", "Organisations"],
  ["books", "Libraries"],
  ["gift", "Commemorative presentations"],
];

export default async function OrderPage({ searchParams }: PageProps<"/books/order">) {
  const { book } = await searchParams;
  const initial = typeof book === "string" && getBook(book)?.orderable ? book : undefined;
  const orderable = books.filter((b) => b.orderable).map((b) => ({ slug: b.slug, title: b.title }));
  return (
    <section className="py-14 lg:py-20">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <p className="eyebrow">Printed copies from CMF</p>
          <h1 className="display-lg mt-4">Order Institutional &amp; Commemorative Copies</h1>
          <GoldRule className="mt-6" />
          <p className="mt-6 leading-relaxed text-body">
            Every CMF publication on this site can be read free online. For printed copies, tell us which book you need, how many and what they are for.
            We will reply with pricing, delivery arrangements and availability.
          </p>
          <ul className="mt-8 space-y-3">
            {audiences.map(([icon, label]) => (
              <li key={label} className="flex items-center gap-3 text-ink">
                <Icon name={icon} className="size-6 text-bronze" strokeWidth={1.4} /> {label}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">
            Questions first? Email{" "}
            <a href={`mailto:${site.contact.email}`} className="text-bronze underline">
              {site.contact.email}
            </a>
            .
          </p>
        </div>
        <div className="tile p-6 sm:p-8">
          <OrderForm books={orderable} initialBook={initial} />
        </div>
      </div>
    </section>
  );
}
