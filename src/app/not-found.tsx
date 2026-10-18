import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui";

// The root not-found renders outside app/(site), so it brings its own header and footer.
export default function NotFound() {
  return (
    <SiteShell>
      <section className="bg-sand py-28">
        <div className="wrap max-w-2xl text-center">
          <p data-reveal="scale" className="font-display text-[clamp(7rem,20vw,11rem)] leading-none font-bold tracking-[-0.06em] text-bronze">404</p>
          <h1 data-reveal className="display-lg mt-2">This page could not be found.</h1>
          <p className="lede mt-5 text-lg">The page may have moved. Try the home page or explore the free library.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/">Back to Home</Button>
            <Button href="/literature#library" variant="outline" icon={null}>
              Free Library
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
