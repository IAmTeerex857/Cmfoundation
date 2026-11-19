import { TextLines, Working } from "@/components/loaders";

// Shown while the reader opens: a quiet page in the reading column with the first lines arriving.
export default function Loading() {
  return (
    <div className="min-h-dvh bg-[#fffdf8] text-ink" aria-busy="true">
      <div className="flex h-14 items-center justify-between border-b border-black/[0.06] px-4">
        <div className="h-3.5 w-40 rounded-full bg-black/[0.06]" />
        <Working label="Opening the book" />
      </div>
      <div className="mx-auto max-w-[38rem] px-5 pt-16">
        <div className="mx-auto h-9 w-2/3 rounded-xl bg-black/[0.06]" />
        <div className="mx-auto mt-4 h-4 w-1/3 rounded-full bg-black/[0.05]" />
        <div className="mt-14">
          <TextLines blocks={6} size="1.6rem" label="Opening the book" />
        </div>
      </div>
    </div>
  );
}
