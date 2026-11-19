import { CoverPlaceholder, TextLines } from "@/components/loaders";

// Shown while a book's page loads: the cover and the description in their own places.
export default function Loading() {
  return (
    <section className="py-14 lg:py-20" aria-busy="true">
      <div className="wrap grid gap-10 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-14">
        <div className="mx-auto w-full max-w-[16rem]">
          <CoverPlaceholder size={256} label="Loading the book" />
        </div>
        <div className="text-ink">
          <div className="h-5 w-28 rounded-full bg-black/[0.06]" />
          <div className="mt-5 h-12 w-3/4 rounded-2xl bg-black/[0.06]" />
          <div className="mt-8">
            <TextLines blocks={4} size="1.5rem" label="Loading the book" />
          </div>
        </div>
      </div>
    </section>
  );
}
