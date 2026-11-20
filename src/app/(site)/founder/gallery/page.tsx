import type { Metadata } from "next";
import { FounderSubpageHero } from "@/components/founder-subpage-hero";
import { PhotoGallery } from "@/components/photo-gallery";
import { founder, gallery } from "@/lib/founder";
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
    </>
  );
}
