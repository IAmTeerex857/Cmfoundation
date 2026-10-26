import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { PhotoGallery } from "@/components/photo-gallery";
import { GoldRule } from "@/components/ui";
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
      <section className="bg-gradient-to-r from-[#f8ecd9] via-blush to-blush">
        <div className="wrap py-14 lg:py-16">
          <Link
            href="/founder"
            className="inline-flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.06em] text-bronze uppercase transition-colors hover:text-bronze-dark"
          >
            <Icon name="arrowLeft" className="size-4" /> Back to the Founder
          </Link>
          <p className="eyebrow mt-8">The Founder</p>
          <h1 className="display-xl mt-4">Photo Gallery</h1>
          <GoldRule className="mt-6" />
          <p className="mt-6 max-w-2xl text-[1.08rem] leading-relaxed text-body">
            A visual journey through the life and times of {founder.name}: his studies, his family, public service and his later years.
          </p>
        </div>
      </section>
      <section className="py-14 lg:py-16">
        <div className="wrap">
          <PhotoGallery photos={gallery} />
        </div>
      </section>
    </>
  );
}
