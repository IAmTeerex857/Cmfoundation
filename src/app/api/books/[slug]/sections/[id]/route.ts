import { textEdition } from "@/lib/manuscripts";

// One section (chapter, prologue, preface…) of a book's text edition, for the online reader.
// Sections are fetched one at a time so a long book opens quickly on a slow connection. They are
// the same for every reader and are cached at the edge.

export async function GET(_req: Request, ctx: RouteContext<"/api/books/[slug]/sections/[id]">) {
  const { slug, id } = await ctx.params;
  const edition = textEdition(slug);
  const section = edition?.sections.find((s) => s.id === id);
  if (!section) return Response.json({ error: "Not found" }, { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  return Response.json(
    { id: section.id, html: section.html },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
