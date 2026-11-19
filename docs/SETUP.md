# Switching on the new features

The website works without any of the services below: books can be read, notes and bookmarks are kept
on the reader's device, and messages are emailed to the Foundation as before. Each service switches on
more of the Foundation's instructions. All accounts should be created **in the Foundation's name**, with
the developer invited as a member, so CMF keeps ownership (instructions §13).

Set every variable in **Vercel → Project → Settings → Environment Variables (Production)**, then
redeploy. The full list, with comments, is in `.env.example`.

## 1. Reader accounts (required for sign-in)

| Variable | Value |
|---|---|
| `READER_AUTH_SECRET` | Any long random string, e.g. the output of `openssl rand -base64 32`. Never share it. |

Resend is already configured (`RESEND_API_KEY`, `CONTACT_FROM`), which is what sends sign-in links to readers.

## 2. Supabase: the reader database (sync, inbox, dashboard, reports)

Cost: the **free plan** is enough to start. The **Pro plan (US$25 a month)** adds daily backups and
prevents the project pausing after a week without activity; recommended once readers depend on it (§10.2 asks for secure backups).

1. At supabase.com, create an organisation for the Foundation and a project named `cmf-website`.
   Region: **eu-west-2 (London)** or **eu-central-1 (Frankfurt)**, the closest to Nigeria. Save the database password somewhere safe.
2. Open **SQL Editor → New query**, paste the whole of `supabase/migrations/20261119000000_cmf_reader_platform.sql` and run it.
3. Open **Project Settings → API** and copy:

| Variable | Where |
|---|---|
| `SUPABASE_URL` | Project URL, e.g. `https://abcd1234.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` secret. **Server only**: never put it in a `NEXT_PUBLIC_` variable. |

Every table has row-level security switched on with no public access, so the public `anon` key can read nothing.

## 3. Management dashboard and reports

| Variable | Value |
|---|---|
| `ADMIN_EMAILS` | Comma-separated emails of authorised CMF staff, e.g. `hello@cm.foundation,manager@cm.foundation` |
| `REPORT_TO` | Who receives the daily, weekly and monthly reports (defaults to `CONTACT_TO`) |
| `CRON_SECRET` | Any long random string. Vercel sends it to the report job automatically. |

Staff open **cm.foundation/admin** and sign in with an emailed link. `vercel.json` runs the report job at
06:00 UTC (07:00 in Lagos) every day; Vercel's free plan allows a daily job.

## 4. Google measurement (free)

1. **Google Analytics 4**: at analytics.google.com, create an account *Chinwoke Mbadinuju Foundation*, a
   property *cm.foundation* (time zone Lagos, currency NGN) and a Web data stream for `https://cm.foundation`.
   In **Admin → Data retention**, choose **14 months**. Turn **Google signals off**.
2. **Google Tag Manager**: at tagmanager.google.com, create a Web container for cm.foundation. Configure it
   as described in `docs/ANALYTICS.md`, then publish.
3. Set `NEXT_PUBLIC_GTM_ID` (GTM-XXXXXXX). Use `NEXT_PUBLIC_GA_ID` (G-XXXXXXXXXX) only if you skip Tag Manager.
4. **Search Console**: add the domain property `cm.foundation`. Verify by DNS (a TXT record in Cloudflare;
   best) or with the HTML tag method by setting `GOOGLE_SITE_VERIFICATION`. Then submit `https://cm.foundation/sitemap.xml`.
5. **Looker Studio**: create the management report (see `docs/ANALYTICS.md`), then **Share → Embed report**,
   and set `NEXT_PUBLIC_LOOKER_STUDIO_URL` to the embed URL so it appears in the dashboard.

## 5. Donations by purpose (Bachs)

In the Bachs dashboard, create three more payment links where the donor chooses the amount, each named
after its purpose and redirecting to `https://cm.foundation/support/thank-you`:

| Variable | Link name |
|---|---|
| `BACHS_PAYMENT_LINK_SCHOLARSHIPS` | CMF: School fees and scholarships |
| `BACHS_PAYMENT_LINK_LITERATURE` | CMF: Printing and distribution of free literature |
| `BACHS_PAYMENT_LINK_COMMUNITY` | CMF: Community development |

General gifts keep using the existing naira link (also rename its checkout title from "Pay Meal").
Until a purpose has its own link, gifts for it go to the general link and the site says so.

**Bank transfers:** add the Zenith account details to `bankTransfer` in `src/lib/payment-links.ts` once the
Foundation sends them; the Support page then shows them.

**Verified payment confirmation (§9.6):** staff record confirmed gifts in the dashboard. If Bachs provides
webhook documentation (payload and signature), automatic recording can be added.

## 6. Audiobooks (when recordings are ready)

Upload each approved recording (MP3 or M4A) to a media host, e.g. a public **Supabase Storage** bucket
named `audiobooks`, or Cloudflare R2. In `src/lib/books.ts`, change the book's `audiobook` to:

```ts
audiobook: { status: "available", src: "https://…/the-wages-of-sin.mp3", chapters: [{ title: "Prologue", start: 0 }, { title: "1. The Inevitability of Death", start: 912 }] },
```

`start` is in seconds. Test it on a phone before publishing (§7.1).

## 7. Amazon

When each Amazon listing is live, add its URL as `amazonUrl` on the book in `src/lib/books.ts`. The
"Buy on Amazon" button appears only for books with a URL (§5.3).
