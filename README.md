# Chinwoke Mbadinuju Foundation website

The CMF website, built with Next.js 16, React 19, TypeScript and Tailwind CSS 4. The site has three jobs:

1. **Information**: the Foundation, the Founder, its work, events and contact details.
2. **Reading**: the CMF Literature Series is free to read online in a built-in reader. Downloads are not offered.
3. **Donations**: through Bachs payment links.

The layout follows the [RiseUp](https://riseupx.framer.website/) and [Altruva](https://altruva.framer.website/) references. The colours are the CMF brand palette from the Foundation's designs in `../drive_assets/`: bronze, navy, cream and logo gold.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in what you have
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run lint
```

## Launch checklist

The code is complete, and donations are live through the Foundation's Bachs naira payment link. Two things are still needed:

| What | Where it goes | What happens until it is supplied |
|---|---|---|
| **Book PDFs** | `books/<slug>.pdf`. See [`books/README.md`](books/README.md) for the file names. | Cards show "Online edition coming soon · Request a printed copy". |
| **Resend** | `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`, and optionally `RESEND_SEGMENT_ID` | In production, the contact and newsletter forms return "temporarily unavailable". In development they accept submissions without sending. |

All variables are documented in [`.env.example`](.env.example). After you change a variable or add a PDF, redeploy.

**Bachs.** The naira link (`https://checkout.bachs.io/pay/pl_af3bb8de098d`) is built into `src/lib/payment-links.ts`. To add US-dollar or monthly giving, create those links in the Bachs dashboard so the donor chooses the amount, with the post-payment redirect set to `https://cm.foundation/support/thank-you`. Then set `BACHS_PAYMENT_LINK_USD` or `BACHS_PAYMENT_LINK_MONTHLY`.

**Resend.** Verify the sending domain (`cm.foundation`) in Resend, and use an address on it for `CONTACT_FROM`. To collect newsletter subscribers as Resend contacts, create a segment and set `RESEND_SEGMENT_ID`. This needs a full-access API key. Without a segment, each sign-up is emailed to `CONTACT_TO`.

## How it fits together

```
books/                     Book PDFs (private, not in public/)
src/app/(site)/            Public pages, wrapped in the header and footer
src/app/read/[slug]/       Full-screen reader, one page per book with a PDF
src/app/api/books/[slug]/  Streams a PDF to the reader in byte ranges
src/app/api/contact/       Contact form → Resend
src/app/api/newsletter/    Newsletter sign-up → Resend
src/components/reader/     PDF.js reader (canvas rendering, zoom, page colours, resume)
src/lib/books.ts           Book catalogue: titles, covers, collections, topics
src/lib/manuscripts.ts     Which books have PDFs
src/lib/payment-links.ts   Bachs payment links from the environment
src/lib/email.ts           Resend client
src/lib/site.ts            Name, contact details, navigation, social links
```

**The reader.** `/read/<slug>` renders pages to canvas with PDF.js. It fetches only the byte ranges it needs, so long books open quickly on mobile data. Only the pages near the current page are kept in memory. Readers can zoom, jump to a page, use the arrow keys, choose light, sepia or night colours, read full screen, and pick up where they left off. There is no download or print control. Opening `/api/books/<slug>` directly redirects to the reader. See `books/README.md` for what this does and does not protect.

**Content.** Book details are in `src/lib/books.ts`, founder content in `src/lib/founder.ts`, programmes and events in `src/lib/work.ts`, and FAQs in `src/lib/faqs.ts`.

## Deployment

Vercel is recommended. The PDFs ship with the `/api/books/[slug]` function through `outputFileTracingIncludes` in `next.config.ts`. That works comfortably up to about 200 MB of books. Beyond that, move the files to object storage (see `books/README.md`).

Project status and outstanding content are tracked in `PROJECT_STATUS.md` and `update needed.md`.
