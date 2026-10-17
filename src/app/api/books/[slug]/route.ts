import { createReadStream, statSync } from "node:fs";
import { Readable } from "node:stream";
import { manuscriptPath, READER_HEADER } from "@/lib/manuscripts";

// Streams a book's PDF to the on-site reader, in byte ranges so long books open quickly.
//
// Reading is free; downloading is not offered. Requests without the reader's header — someone
// opening or sharing this URL directly — are sent to the reader page instead of receiving the file.
// No web reader can make copying impossible, but there is no download button, no public file URL
// and no browser PDF viewer with a save option.

export const dynamic = "force-dynamic";

const baseHeaders = {
  "Content-Type": "application/pdf",
  "Content-Disposition": "inline",
  "Accept-Ranges": "bytes",
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Cross-Origin-Resource-Policy": "same-origin",
};

function stream(file: string, start: number, end: number) {
  return Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream<Uint8Array>;
}

export async function GET(req: Request, ctx: RouteContext<"/api/books/[slug]">) {
  const { slug } = await ctx.params;
  const file = manuscriptPath(slug);
  if (!file) return new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });

  const fromReader = req.headers.get(READER_HEADER) === "1" && req.headers.get("sec-fetch-site") !== "cross-site";
  if (!fromReader) return Response.redirect(new URL(`/read/${slug}`, req.url), 307);

  const size = statSync(file).size;
  const range = req.headers.get("range");

  if (!range) {
    return new Response(stream(file, 0, size - 1), { status: 200, headers: { ...baseHeaders, "Content-Length": String(size) } });
  }

  // Single ranges only ("bytes=start-end", "bytes=start-" or "bytes=-suffix"), which is all PDF.js asks for.
  const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  let start = match?.[1] ? Number(match[1]) : NaN;
  let end = match?.[2] ? Number(match[2]) : size - 1;
  if (match && !match[1] && match[2]) {
    start = Math.max(size - Number(match[2]), 0);
    end = size - 1;
  }
  end = Math.min(end, size - 1);
  if (!Number.isInteger(start) || !Number.isInteger(end) || start > end || start >= size) {
    return new Response(null, { status: 416, headers: { ...baseHeaders, "Content-Range": `bytes */${size}` } });
  }

  return new Response(stream(file, start, end), {
    status: 206,
    headers: { ...baseHeaders, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
  });
}
