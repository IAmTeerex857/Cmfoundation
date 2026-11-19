import { currentReader } from "@/lib/reader-auth";

export const dynamic = "force-dynamic";

/** The signed-in reader, for the reader workspace. Never cached. */
export async function GET() {
  const reader = await currentReader();
  return Response.json(
    { reader: reader ? { email: reader.email, name: reader.name ?? null, country: reader.country ?? null } : null },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
