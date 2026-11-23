import type { Metadata } from "next";
import Link from "next/link";
import { FounderSubpageHero } from "@/components/founder-subpage-hero";
import { PhotoGallery } from "@/components/photo-gallery";
import { awardGallery, burialGallery, founder, gallery } from "@/lib/founder";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Photo Gallery",
  description: `A visual journey through the life and times of ${founder.name}, ${founder.title}, in photographs from the Foundation's archive.`,
  path: "/founder/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <FounderSubpageHero eyebrow="The Founder" title="Photo Gallery">
        <p>A visual journey through the life and times of {founder.name}: his studies, his family, public service and his later years.</p>
      </FounderSubpageHero>
      <section className="py-14 lg:py-16">
        <div className="wrap">
          <PhotoGallery photos={gallery} />
        </div>
      </section>
      <section id="award" className="scroll-mt-24 border-t border-line py-14 lg:py-16">
        <div className="wrap grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-start">
          <div>
            <p className="eyebrow">PASA 2026</p>
            <h2 className="display-md mt-2">Peace and Security Award</h2>
            <p className="mt-3 max-w-md leading-relaxed text-body">The posthumous Peace and Security Award conferred on Dr Mbadinuju, received on his behalf.</p>
          </div>
          <PhotoGallery photos={awardGallery} columns="columns-1 sm:columns-2" />
        </div>
      </section>
      <section id="funeral" className="scroll-mt-24 border-t border-line bg-blush py-14 lg:py-16">
        <div className="wrap">
          <p className="eyebrow">Uli, November 2023</p>
          <h2 className="display-md mt-2">Laid to Rest</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-body">
            Photographs from his funeral ceremony in Uli, his hometown.{" "}
            <Link href="/founder/tributes" className="text-bronze underline underline-offset-2">
              Read the tributes
            </Link>{" "}
            paid to him at the time.
          </p>
          <div className="mt-8">
            <PhotoGallery photos={burialGallery} />
          </div>
        </div>
      </section>
    </>
  );
}
