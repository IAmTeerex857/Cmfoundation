# Measurement: GA4 events, Tag Manager, campaigns and reports

Instructions §9. Two layers:

1. **Google Analytics 4 through Google Tag Manager** for traffic, sources, devices, locations and reading
   events. Loaded **only after the visitor accepts analytics cookies** (banner, "Cookie settings" in the footer).
2. **The Foundation's own counts** (Supabase `daily_metrics`) for the management dashboard and reports:
   daily totals per event and book, with no cookie, IP address or identifier. They work for every visitor.
   Registrations, enquiries, orders, feedback and confirmed donations come from their own tables.

**Never sent to Google:** names, email addresses, notes, feedback text or anything identifying a reader (§9.5).

## Events

Pushed to `dataLayer` as `{ event: "<name>", ...parameters }` (or sent with `gtag` when GA4 is installed directly).

| Event | When | Parameters |
|---|---|---|
| `book_page_view` | A book's page (/books/…) is opened | `book`, `status` |
| `reading_start` | The reader is opened for a book | `book` |
| `chapter_reached` | A section is displayed | `book`, `section`, `section_index`, `sections_total` |
| `chapter_complete` | The reader scrolls to the end of a section | `book`, `section`, `section_index` |
| `reading_progress` | 25, 50 and 75% of the book's words passed | `book`, `percent` |
| `book_complete` | End of the final chapter or epilogue reached (a click never counts) | `book` |
| `registration_invite_shown` | The invitation after the Prologue is actually seen | `book` |
| `registration_invite_continue` | "Continue Reading Free" chosen | `book` |
| `registration_submitted` | Registration form sent (email not yet confirmed) | `book` |
| `sign_up` | Email confirmed, account created | `method` |
| `login` | Returning reader signed in | `method` |
| `note_create`, `bookmark_create`, `notes_emailed` | Workspace actions (no content) | `book` |
| `feedback_submit` | "Send feedback to CMF" | `book` |
| `audiobook_start`, `audiobook_progress` | Audiobook played; 25/50/75/100% | `book`, `percent` |
| `amazon_click` | "Buy on Amazon" clicked | `book` |
| `institutional_order_submit` | Order enquiry sent | `book`, `purpose` |
| `donation_page_view` | Support page opened | `page` |
| `donate_click` | Checkout started for a purpose | `category` |
| `generate_lead` | Contact form sent | `enquiry` (type) |
| `newsletter_signup` | Footer newsletter | `location` |

Confirmed donations are **not** measured from the thank-you page (§9.6); staff record them from payment records.

## Tag Manager configuration

1. **Google tag** (GA4 configuration): Measurement ID `G-…`, trigger *Initialization – All Pages*.
2. **Data Layer Variables**: `book`, `section`, `section_index`, `percent`, `status`, `category`, `purpose`, `enquiry`, `method`, `location`.
3. **Trigger** *CMF events*: Custom Event, event name matches RegEx
   `^(book_page_view|reading_start|chapter_reached|chapter_complete|reading_progress|book_complete|registration_invite_shown|registration_invite_continue|registration_submitted|sign_up|login|note_create|bookmark_create|notes_emailed|feedback_submit|audiobook_start|audiobook_progress|amazon_click|institutional_order_submit|donation_page_view|donate_click|generate_lead|newsletter_signup)$`
4. **GA4 Event tag**: Event name `{{Event}}`, parameters from the variables above, trigger *CMF events*.
5. Preview with Tag Assistant (accept the cookie banner first), then **Submit → Publish**.
6. In GA4 **Admin → Custom definitions**, add event-scoped dimensions `book`, `section`, `category`,
   `purpose`, `enquiry`, `status`, and a metric `percent`. Mark `sign_up`, `institutional_order_submit`,
   `donate_click` and `generate_lead` as **key events**.

## Campaign tracking (UTM) (§9.7)

GA4 reads `utm_source`, `utm_medium` and `utm_campaign` from any link. Short links already set up:

| Short link | Use | Lands on |
|---|---|---|
| `cm.foundation/qr` | QR codes on 24 November materials | Event page, `utm_source=qr&utm_medium=print&utm_campaign=nov24-book-presentation` |
| `cm.foundation/qr/library` | QR codes inside books or flyers | Free library, same tags |
| `cm.foundation/wa` | WhatsApp sharing | Event page, `utm_source=whatsapp&utm_medium=social` |
| `cm.foundation/li` | LinkedIn posts | Event page, `utm_source=linkedin&utm_medium=social` |
| `cm.foundation/press` | Media publications | Home, `utm_source=media&utm_medium=referral&utm_campaign=media-coverage` |

For anything else, add tags by hand (Google's Campaign URL Builder helps):

| Channel | utm_source | utm_medium | utm_campaign |
|---|---|---|---|
| Email newsletter | `newsletter` | `email` | e.g. `2026-12-newsletter` |
| Institutional letters | `letter` | `correspondence` | e.g. `schools-2027` |
| Future book launch | `qr` / `whatsapp` / … | `print` / `social` | e.g. `launch-all-is-vanity` |

Add new short links in `next.config.ts` (`redirects`).

## Looker Studio management report (§9.3, §9.8)

Create a report with **Google Analytics 4** and **Search Console** as data sources and these pages:

1. **Daily overview**: Active users, New vs returning, Sessions, Views, Engaged sessions, Engagement rate, Average engagement time (scorecards with date comparison).
2. **Acquisition**: Session default channel group (Organic Search, Direct, Organic Social, Referral, Email…), Session source/medium, Campaign table.
3. **Audience**: Country and City map/table, Device category, Browser.
4. **Content**: Page path (most visited pages), and a table of `book_page_view` / `reading_start` / `book_complete` by `book`.
5. **Search**: Search Console queries, impressions, clicks, average position, top landing pages.

Add a text box on each page with the reporting period and definitions. Schedule delivery under
**Share → Schedule email delivery** if staff also want the traffic report by email. Embed it in the
dashboard with `NEXT_PUBLIC_LOOKER_STUDIO_URL`.

Figures are estimates where measurement is limited: visitors who decline cookies are not in GA4, and ad blockers stop some tags.
