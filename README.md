# Chinwoke Mbadinuju Foundation website

The CMF website, built with Next.js 16, React 19, TypeScript and Tailwind CSS 4. The site has three jobs:

1. **Information**: the Foundation, the Founder, its work, events and contact details.
2. **Reading**: the CMF Literature Series is free to read online in a built-in reader. Downloads are not offered.
3. **Donations**: through Bachs payment links.

The pages follow the Foundation's page designs in `../drive_assets/`: EB Garamond headings in navy, bronze eyebrows and square uppercase buttons on warm paper, in the CMF palette (bronze, navy, cream and logo gold). The header and footer keep their earlier look (Geist).

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
| **Email** | `RESEND_API_KEY` (or the Cloudflare fallback `CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_EMAIL_TOKEN`), `CONTACT_TO`, `CONTACT_FROM` | In production, the contact and newsletter forms return "temporarily unavailable". In development they accept submissions without sending. |

All variables are documented in [`.env.example`](.env.example). After you change a variable or add a PDF, redeploy.

**Bachs.** The naira link (`https://checkout.bachs.io/pay/pl_af3bb8de098d`) is built into `src/lib/payment-links.ts`. To add US-dollar or monthly giving, create those links in the Bachs dashboard so the donor chooses the amount, with the post-payment redirect set to `https://cm.foundation/support/thank-you`. Then set `BACHS_PAYMENT_LINK_USD` or `BACHS_PAYMENT_LINK_MONTHLY`.

**Email.**
- **DNS:** cm.foundation's DNS is on Cloudflare.
- **Receiving:** Cloudflare Email Routing forwards hello@ and every other @cm.foundation address to the Foundation's Gmail.
- **Sending:** the domain is verified in Resend. The website sends through Resend with a sending-only key (`RESEND_API_KEY`). Gmail also uses Resend's SMTP server to send as hello@cm.foundation.
- **Fallback:** without the Resend key, the site sends through Cloudflare Email Service. On the free plan that can only reach verified destination addresses.
- **DMARC:** set to `p=quarantine`.
- **Where messages go:** contact messages and newsletter sign-ups arrive in `CONTACT_TO`.

## How it fits together

```
books/                     Book PDFs (private, not in public/)
src/app/(site)/            Public pages, wrapped in the header and footer
src/app/read/[slug]/       Full-screen reader, one page per book with a PDF
src/app/api/books/[slug]/  Streams a PDF to the reader in byte ranges
src/app/api/contact/       Contact form → Foundation inbox
src/app/api/newsletter/    Newsletter sign-up → Foundation inbox
src/components/reader/     PDF.js reader (canvas rendering, zoom, page colours, resume)
src/lib/books.ts           Book catalogue: titles, covers, collections, topics
src/lib/manuscripts.ts     Which books have PDFs
src/lib/payment-links.ts   Bachs payment links from the environment
src/lib/email.ts           Email sending (Resend, Cloudflare fallback)
src/lib/site.ts            Name, contact details, navigation, social links
```

**The reader.** `/read/<slug>` renders pages to canvas with PDF.js. It fetches only the byte ranges it needs, so long books open quickly on mobile data. Only the pages near the current page are kept in memory. Readers can zoom, jump to a page, use the arrow keys, choose light, sepia or night colours, read full screen, and pick up where they left off. There is no download or print control. Opening `/api/books/<slug>` directly redirects to the reader. See `books/README.md` for what this does and does not protect.

**Content.** Book details are in `src/lib/books.ts`, founder content in `src/lib/founder.ts`, programmes and events in `src/lib/work.ts`, and FAQs in `src/lib/faqs.ts`.

## Deployment

Vercel is recommended. The PDFs ship with the `/api/books/[slug]` function through `outputFileTracingIncludes` in `next.config.ts`. That works comfortably up to about 200 MB of books. Beyond that, move the files to object storage (see `books/README.md`).

Project status and outstanding content are tracked in `PROJECT_STATUS.md` and `update needed.md`.
