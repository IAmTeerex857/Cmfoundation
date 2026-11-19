import { endSession } from "@/lib/reader-auth";

export async function POST() {
  await endSession();
  return Response.json({ ok: true });
}
