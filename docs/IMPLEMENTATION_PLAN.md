# CMF website: implementation report and plan

Response to *Website Strategic Refinement and Digital Library Development: Master Implementation
Instructions* (18 November 2026). This covers the developer deliverables in section 13.

## 1. Technology stack (§13.2)

| Layer | Technology | Notes |
|---|---|---|
| Website | Next.js 16, React 19, TypeScript, Tailwind CSS | Existing site, refined rather than redesigned (§4.1) |
| Hosting | Vercel, deploying from GitHub `main` | cm.foundation over HTTPS |
| DNS and incoming email | Cloudflare | hello@cm.foundation forwards to the Foundation's Gmail |
| Outgoing email | Resend | Sign-in links, copies of feedback and notes, reports |
| Reader database | Supabase (PostgreSQL) | Accounts, workspace, inbox, donations, aggregate counts |
| Measurement | Google Tag Manager, GA4, Search Console, Looker Studio | Loaded only with cookie consent |
| Payments | Bachs hosted checkout | No card data touches the website |
| Audiobooks | Media storage (Supabase Storage or Cloudflare R2) | Player built; recordings awaited |

## 2. Reader accounts and data (§13.3, §13.8)

- **Passwordless sign-in (§6.1).** Registration asks for name, country (city or state optional) and email, plus a required privacy acknowledgement and a separate, unticked newsletter box (§10.4). A signed link valid for 30 minutes confirms the email; each link works once. The session is a signed, http-only cookie. There is no password, phone number or address.
- **Reading never requires an account (§5.5, §6.5).** Guests read every book in full, with font, spacing and colour settings, bookmarks and notes kept on their own device.
- **Registered readers** get the same tools synchronised to their account: reading position, notes (linked to a chapter or a selected passage), bookmarks, preferences and a personal library of books started and completed (§6.2). "Email my notes" sends notes to their confirmed address.
- **Notes and feedback are separate (§6.3).** Notes are private: they are never sent to the Foundation, never shown in the dashboard and never sent to Google. Only "Send feedback to CMF" reaches the Foundation, into the dashboard inbox and email, with a copy to the reader.
- **Database security (§11.5).** Every table has row-level security on and no public policies. Only the website's server, with a secret key, can read or write, and each request is scoped to the signed-in reader. Readers can download or delete their data from their account page (§10.2). Retention rules in the Privacy Policy are applied automatically every day.

## 3. What was delivered

### Phase One: 24 November launch

| # | Deliverable | Status |
|---|---|---|
| 1 | Five complete books uploaded and verified | ✅ Imported from the supplied EPUBs as structured text (§11.2); original PDFs archived |
| 2 | Individual book pages | ✅ `/books/<title>` for every title, permanent and shareable |
| 3 | Front and back covers | ✅ Front and back with a toggle; spine never shown |
| 4 | Free reading without registration | ✅ Opens at the title page; "Go to the Prologue" jumps ahead |
| 5 | Optional registration pathway | ✅ Invitation after the Prologue (or equivalent), once per book, with "Continue Reading Free" |
| 6 | Privacy Policy | ✅ Full policy published; for legal review (§10.4) |
| 7 | Corrected publication metadata | ✅ From the books' copyright pages (see §6 below) |
| 8 | GA4 tracking | ✅ Built; goes live when the GTM/GA4 IDs are set |
| 9 | Search Console | ✅ Sitemap and verification support; Foundation to verify the domain |
| 10 | 24 November event page | ✅ `/events/book-presentation-2026`, with QR and social short links |
| 11 | Mobile reading and links tested | ✅ Desktop and phone, see §5 |
| 12 | Donation and enquiry pathways | ✅ Purpose-specific giving, institutional orders, enquiries |

Also done: Home button in the main menu; home page reordered to §4.2 with the §4.3 introduction; lighter page colours (§2.6); the four areas of activity with literature and education first (§2.3); discreet-service and nonprofit wording (§2.4, §2.5); Support page rebuilt around "Read Freely. Support Voluntarily." with six pathways and project partnerships (§8); accurate status labels (§5.1); Book structured data for search engines (§11.3).

### Phase Two: reader engagement

All ten items built: notes workspace (side panel on desktop, drawer on phones), chapter- and passage-linked notes, saved positions, personal library, bookmarks, Email My Notes, reader feedback, reading preferences, detailed book analytics, and the management dashboard at `/admin` (daily overview, literature performance, audience development, support and partnerships, traffic via Looker Studio).

### Phase Three: platform expansion

| Item | Status |
|---|---|
| Audiobook integration | ✅ Player with chapters, play/pause, progress, speed and resume; shows "Audiobook Coming Soon" until recordings are uploaded |
| Progressive publication releases | ✅ Adding an EPUB with `npm run import-book` publishes a title; statuses update automatically |
| Institutional and commemorative ordering | ✅ Order form on every book page, recorded separately from donations |
| Donor and partnership reporting | ✅ Confirmed donations by purpose and sponsorship records in the dashboard; CSV exports |
| Automated management reports | ✅ Daily summary, Monday weekly engagement report, monthly strategic report by email |
| Improved search visibility | ✅ Indexable book pages, Book and Event structured data, sitemap, canonical URLs |
| Reader engagement campaigns | ✅ Consent-based newsletter list export; UTM short links |
| Multilingual capability | Not started: §12 says "where justified by readership". GA4 country data will show whether it is needed. |

## 4. Paid or third-party services (§13)

| Service | Cost | Needed for |
|---|---|---|
| Supabase | Free to start; **Pro US$25/month** recommended for daily backups and no idle pausing | Accounts, sync, dashboard |
| Google Analytics, Tag Manager, Search Console, Looker Studio | Free | Measurement |
| Resend | Free up to 3,000 emails a month; US$20/month beyond | Sign-in and reader emails |
| Vercel | Current plan; daily scheduled job fits the free tier | Hosting |
| Audio storage | Free tiers suffice for a few audiobooks | Audiobooks |

All accounts should be in the Foundation's name (§13).

## 5. Testing and acceptance checklist (§13.10, §11.6)

Run on a desktop browser and on an Android and an iPhone, including a slow mobile connection.

- [x] Every page loads with no errors and no sideways scrolling at 390 px and 1440 px
- [x] Book cover → book page (not the reader); front/back toggle; no spine
- [x] Read Free Online opens the title page; "Go to the Prologue" works; contents jump to any chapter
- [x] Invitation appears once at the end of the Prologue; "Continue Reading Free" goes on; it does not reappear
- [x] Text size, spacing, page colour and typeface change and are remembered
- [x] Notes (with selected passage) and bookmarks save; reload resumes at the last position
- [x] Registration cannot be sent without the privacy acknowledgement; newsletter box not pre-ticked
- [x] Email link signs the reader in and returns them to the book; session cookie is http-only
- [x] Non-staff are refused at /admin
- [x] Feedback and institutional order forms submit
- [x] /give/<purpose> reaches the checkout; QR and social short links carry campaign tags
- [ ] **After Supabase is connected:** notes and bookmarks appear on a second device; a used sign-in link is refused; data download and account deletion work
- [ ] **After GTM/GA4 are set:** accept cookies and confirm events in GA4 DebugView; decline and confirm nothing loads
- [ ] **After email is confirmed live:** registration, sign-in, feedback copy and Email My Notes arrive (check spam)
- [ ] Test donation through each purpose link and record it in the dashboard
- [ ] Search Console shows the sitemap read with no errors

## 6. Editorial corrections made, and questions for the Foundation (§11.4)

Corrected from the books' own copyright pages:

- *Exploring the Godhead*, *The Wages of Sin* and *A Criminal in Heaven* were listed as 2018, 2020 and 2022. Their copyright pages say **© 2026, first edition**. Now 2026.
- *God's Kind of Leader* was listed as 1991. Its copyright page says **first published 1988, reprinted 2023**.
- *False Men and True Christians*: **first published 1986, republished 2026**; subtitle *The Last-Days Message for All* added.

Please confirm or supply:

1. **ISBNs.** The separate back-cover images show a placeholder (*The Wages of Sin*, "ISBN 978-0-000000-00-0") and the same ISBN on two books (978-978-985-512-3). The full cover wraps show 978-978-67-3073-8, -3075-2 and -3071-4, which the site uses, with back covers taken from the wraps. Please confirm, and send final high-resolution back covers.
2. **Back covers** for *False Men and True Christians* and *God's Kind of Leader*.
3. **Typos in the source files:** "CMF Remebrance Series" (*The Wages of Sin* title page), "Chriatians" (*God's Kind of Leader*, chapter 12 title), "Chnwoke" (*False Men*, Important Note). *Exploring the Godhead* calls itself both the Remembrance Series and the Literature Series. The site reproduces the text as supplied; corrected EPUBs can be imported at any time.
4. **Forthcoming list.** The books list *The Devil's Antics*, *Those Unanswered Prayers* and *Autopsy of The Last Temptation* as upcoming, while the site lists *A Lawyer's Woes*, *Judge Not!* and *Assured, Not Entitled*. Which is current?
5. **Amazon links** for the three titles, and the **audiobook recordings** when ready.
6. **Zenith account details** for local transfers (mentioned as attached, but not in the emails).
7. **Quotations.** Unverified quotes have been taken off the home and Our Work pages. Others remain on the founder page awaiting confirmation (including "Service is the rental…", usually credited to Shirley Chisholm).
8. **Nonprofit statement (§2.5)** and Privacy Policy: please confirm against the governing documents and the privacy compliance review.
9. **24 November details:** venue and time to show on the event page.

## 7. Delivery timetable (§13.9)

| When | What |
|---|---|
| Now | All three phases built and tested locally; documentation written |
| Before 24 November | Foundation creates Supabase and Google accounts (see `docs/SETUP.md`); settings added; deploy; run the remaining checklist items |
| 24 November | Launch; QR codes point to cm.foundation/qr |
| Week after launch | Review first figures, fix anything readers report |
| As supplied | Corrected EPUBs, covers, ISBNs, Amazon links, audiobooks |

## 8. Post-launch support and maintenance (§13.12)

| Frequency | Task |
|---|---|
| Daily (CMF staff) | Inbox and daily summary (`docs/ADMIN_GUIDE.md`) |
| Weekly | Check the weekly report, Search Console coverage and Vercel errors |
| Monthly | Dependency and security updates; review the monthly report; test sign-in and a donation link |
| Quarterly | Review who has dashboard access; restore a backup to confirm backups work; review the Privacy Policy |
| As needed | New books, covers, events and audiobooks |
