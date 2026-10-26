import { SiteShell } from "@/components/site-shell";
import { Button, GoldRule } from "@/components/ui";

// The root not-found renders outside app/(site), so it brings its own header and footer.
export default function NotFound() {
  return (
    <SiteShell>
      <section className="bg-gradient-to-r from-[#f8ecd9] via-blush to-blush py-24 lg:py-32">
        <div className="wrap max-w-2xl text-center">
          <p data-reveal="fade" className="eyebrow">
            Page not found
          </p>
          <p data-reveal="scale" className="mt-4 font-display text-[clamp(6rem,18vw,10rem)] leading-none font-medium text-bronze">
            404
          </p>
          <h1 data-reveal className="display-lg mt-4">
            This page could not be found.
          </h1>
          <GoldRule className="mx-auto mt-6" />
          <p className="mt-6 text-[1.08rem] leading-relaxed text-body">The page may have moved. Try the home page or explore the free library.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/">Back to Home</Button>
            <Button href="/literature#library" variant="outline">
              Free Library
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
