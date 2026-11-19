# CMF website manual

For the Foundation's team who look after cm.foundation day to day. What is still needed from the Foundation, and the
one-off settings, are in [WHATS_LEFT.md](WHATS_LEFT.md).

---

## 1. Signing in to the dashboard

1. Go to **cm.foundation/admin**.
2. Enter the management email (`hello@cm.foundation`) and the management password, then press **Sign in**.

- **How long you stay signed in:** 400 days on each device, the longest browsers allow. The password does not expire.
- **On a shared computer:** press **Sign out** at the bottom of the sidebar (at the top of the screen on a phone).
- **Adding a person or changing the password:** ask the web developer. They update `ADMIN_EMAILS` or `ADMIN_PASSWORD` in Vercel.

The dashboard is not listed in search engines. Anyone who is not on the list sees only the sign-in card.

## 2. The dashboard at a glance

The sidebar has four pages. **Inbox** shows a bronze number when something new is waiting.

| Page | What it is for |
|---|---|
| **Overview** | How the library is being read, who the readers are, and what needs a reply |
| **Inbox** | Contact messages, institutional book orders and reader feedback |
| **Donations** | Recording confirmed gifts and sponsorships |
| **Readers** | Reader numbers and the newsletter export |

Choose the period at the top right of the Overview: **7 days**, **30 days**, **90 days** or **Year**. Every figure is
compared with the same number of days before it.

## 3. Reading the Overview

| Card | What it shows |
|---|---|
| **Reading starts** (top left) | How many times a book was opened in the reader. The pill shows the change against the previous period. Below it: chapters read to the end, books finished, book page views, new reader accounts, and how many readers saw the invitation to register. |
| **Reading by book** | Reading starts per book. The leading book is solid bronze. "Finished" is the share of starts that reached the end of the final chapter. |
| **Readers** (navy card) | New reader accounts this period, the leading country, and the totals. |
| **Day by day** | Reading starts per day (per week for the Year view). The latest bar is solid. Hover a bar for that day's new readers. |
| **Where readers are** | Registered reader accounts by country. |
| **Needs you** | New messages, book orders, feedback, and checkouts not yet matched to a recorded donation. Each opens the right page. It says **Nothing is waiting** when everything is handled. |
| **Literature performance** | Per book: page views, starts, readers passing 25%, 50% and 75%, finished, completion rate, notes made and Amazon clicks. |
| **Support** | Confirmed donations, checkouts started, institutional orders and copies, newsletter sign-ups, and messages by type. |

**How the figures are counted:**
- A click never counts as reading. **Finished** means the reader reached the end of the last chapter.
- Counts come from the Foundation's own records, with no cookies and nothing that identifies a person. So they include
  everyone, not only visitors who accepted cookies.
- **Visitors, sources, devices and search terms for everyone** (not only readers) are in Google Analytics. Use the link
  at the foot of the Overview.

**Export orders** (top right) downloads every institutional order as a spreadsheet.

## 4. Every morning

1. Read the **daily summary email**. It arrives at 7am Lagos time; weekly on Mondays and monthly on the 1st.
2. Open **Inbox** and work through anything marked **new**:
   - **Reader feedback:** reply by email if the reader left an address, then set the status to *replied* or *read*.
   - **Book orders:** reply with pricing, delivery arrangements and availability. Set *in-progress*, then *done*.
   - **Messages** (partnership, sponsorship, in-kind help, volunteering, events, media): reply, or pass to the right person.
3. Glance at **Needs you** on the Overview. When it says **Nothing is waiting**, you are done.

Every message sent through the website is saved in the Inbox, even if the email copy goes astray.

## 5. Recording donations

Record a gift **only after you have confirmed it** in the payment partner's dashboard (Bachs) or on the bank statement.
A visit to the thank-you page is not proof of payment.

1. Open **Donations**.
2. Enter the details:
   - date received, amount and currency
   - purpose (the payment link it came through tells you)
   - method and payment reference
3. Donor name and email are optional. Use them only for acknowledgements and receipts.
4. Record sponsorships on the same page.

Book orders are **not** donations: they stay in the Inbox.

## 6. Readers and the newsletter

- **Readers** shows how many reader accounts exist and how many agreed to receive emails.
- **Export the newsletter list** only to send the Foundation's own updates, and only to people who opted in.
  Remove anyone who unsubscribes.
- Reading is always free and never needs an account. The invitation to register appears once, after a book's
  introduction, next to **Continue Reading Free**.

## 7. Privacy rules for staff

- Readers' **personal notes are private** and are not in the dashboard. Never ask a reader for them.
- Do not copy reader details into personal phones, chats or spreadsheets outside the Foundation's accounts.
- Readers can see or delete their own data at **cm.foundation/reader**. If they write instead, reply within 30 days.
- If you suspect a data breach (a lost laptop with exports, a strange sign-in email), tell the Trustee and the web
  developer **the same day**.

## 8. Books

- **Adding a new book:** send the developer:
  - the final EPUB
  - front and back covers (no spine)
  - the details: subtitle, year, edition, ISBN and pages

  The book gets its own page and becomes readable once it is added. Until then it shows **Coming Soon** or **Not Yet Online**.
- **Correcting a book:** send the corrected EPUB; the online edition is re-imported in minutes.
- **Amazon links and audiobooks:** send them when ready. The book pages show them automatically.

## 9. Short links for printed and shared material

| Link | Use | Opens |
|---|---|---|
| `cm.foundation/qr` | QR codes on 24 November materials | The event page |
| `cm.foundation/qr/library` | QR codes inside books or on flyers | The free library |
| `cm.foundation/wa` | Sharing on WhatsApp | The event page |
| `cm.foundation/li` | LinkedIn posts | The event page |
| `cm.foundation/press` | Media publications | The home page |

Each one is counted separately in Google Analytics, so you can see which channel brought readers. New short links: ask
the developer.

## 10. Who to ask

| Need | Who |
|---|---|
| Website changes, new books, access, passwords | The web developer |
| Payment links and checkout | Bachs dashboard (Foundation account) |
| Email forwarding for @cm.foundation | Cloudflare (see [WHATS_LEFT.md](WHATS_LEFT.md), Part B) |
| Hosting, uptime and errors | Vercel project dashboard |
