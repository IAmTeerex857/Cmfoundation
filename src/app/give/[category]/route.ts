import { isGivingCategory } from "@/lib/giving";
import { categoryLink, giveHref } from "@/lib/payment-links";

// /give/<category> sends the donor to that category's checkout (instructions §8.4). One stable URL
// per category means buttons, emails and QR codes never need to change when a link is replaced.
export async function GET(_req: Request, ctx: RouteContext<"/give/[category]">) {
  const { category } = await ctx.params;
  const href = isGivingCategory(category) ? categoryLink(category).href : giveHref();
  return new Response(null, { status: 302, headers: { Location: href, "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
