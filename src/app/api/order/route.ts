import { bad, field, readJson, sendFailure, validEmail } from "@/lib/api";
import { getBook } from "@/lib/books";
import { isCountry } from "@/lib/countries";
import { countMetric, recordEnquiry } from "@/lib/db";
import { sendToFoundation } from "@/lib/email";
import { isOrderPurpose } from "@/lib/orders";

// Institutional and commemorative order enquiries (instructions §7.3), delivered to the Foundation
// inbox with a subject that keeps them apart from donations and general messages.
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return bad("Invalid request.");
  if (body.company) return Response.json({ ok: true });

  const name = field(body, "name", 120);
  const organisation = field(body, "organisation", 160);
  const email = field(body, "email", 254).toLowerCase();
  const country = field(body, "country", 80);
  const destination = field(body, "destination", 200);
  const bookSlug = field(body, "book", 80);
  const quantity = Number.parseInt(field(body, "quantity", 7), 10);
  const purpose = field(body, "purpose", 60);
  const instructions = field(body, "instructions", 3000);
  const book = getBook(bookSlug);

  if (!name || !email || !destination || !purpose) return bad("Please complete all required fields.");
  if (!validEmail(email)) return bad("Please enter a valid email address.");
  if (!isCountry(country)) return bad("Please choose a country from the list.");
  if (!(book?.orderable || bookSlug === "several")) return bad("Please choose a book.");
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 100000) return bad("Please enter a quantity.");
  if (!isOrderPurpose(purpose)) return bad("Please choose the intended purpose.");

  const title = book ? book.title : "Several titles";
  await recordEnquiry({ kind: "order", topic: purpose, book: book?.slug ?? "several", quantity, country, name, email, payload: { organisation, destination, instructions } });
  await countMetric("institutional_order_submit", book?.slug ?? "several");
  try {
    await sendToFoundation({
      subject: `[CMF website] Institutional order enquiry: ${quantity} × ${title}`,
      text: [
        `Name: ${name}`,
        `Organisation: ${organisation || "(not given)"}`,
        `Email: ${email}`,
        `Country: ${country}`,
        `Delivery destination: ${destination}`,
        `Book: ${title}`,
        `Quantity: ${quantity}`,
        `Purpose: ${purpose}`,
        "",
        `Additional instructions:\n${instructions || "(none)"}`,
        "",
        "Please reply with pricing, delivery arrangements and availability. This is a book order, not a donation.",
      ].join("\n"),
      replyTo: email,
    });
  } catch (err) {
    return sendFailure(err, "order");
  }
  return Response.json({ ok: true });
}
