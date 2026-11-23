# What's left: CMF website

_Updated 23 November 2026._ Everything in the Foundation's instructions of 18 and 20 November, and in Cheta's
response of 23 November (Part A), is built and live at [cm.foundation](https://cm.foundation). What remains is
information the Foundation said it will forward, and a few settings that are done by hand.

**How to use the site and dashboard day to day:** see [MANUAL.md](MANUAL.md).

---

## Part A: Still to come from Cheta (as promised in his response of 23 November)

The site already handles each gap cleanly: nothing is broken or marked as missing while these are outstanding.

### Books

1. **Amazon links** for *Exploring the Godhead* and *A Criminal in Heaven* (promised for 24 November), then *The Wages of Sin*.
2. **Cover for *Autopsy of the Last Temptation*.** A plain generated cover stands in.
3. **Kept in view (KIV), no action now:** audiobooks (recordings in progress); the founder's other books (titles,
   covers, years and files); the back covers of *False Men and True Christians* and *God's Kind of Leader* (current
   presentation kept). The book stack photo also shows *The Restored Church* and *How I Governed Anambra State*,
   which are not on the site yet.

### Payments and links

4. **Bachs:** the details of Cheta's personal Bachs account, then one link per purpose (general, scholarships,
   literature, community), the checkout title (currently "Pay Meal") and the redirect to
   `https://cm.foundation/support/thank-you`.
5. **Social media profile links.** The icons stay hidden until the links arrive.

### Events

6. **Other event dates and registration links.** Only *All Is Vanity* (11 February 2027, online publication) is confirmed.

### Photos

7. **Letters requesting assistance** for the children's ministry milestone, to be shown with personal details concealed.
8. **Photos of the Abuja launch** after 24 November. The invitation card is used until then.
9. **More photos of Dr Mbadinuju** (via WhatsApp), especially early life, faith and ministry.
10. **A portrait of Cheta** that the Foundation owns, and permission for the interim one.

### To approve

11. The nonprofit statement, Privacy Policy, Terms of Use, Donation Policy and FAQ answers.
12. The quotations on the founder page, including "Service is the rent…", which is usually credited to Shirley Chisholm.

**Settled on 23 November:**
- 24 November venue and time from the invitation card: The Meeting Room, Shehu Musa Yar'Adua Centre, CBD, Abuja,
  11:00 a.m. – 4:00 p.m., with the RSVP contacts. The card is on the event page and is the Abuja milestone picture.
- Upcoming books: *Judge Not!* and *Assured, Not Entitled* removed (their old links go to the forthcoming list).
  *The Devil's Antics*, *Those Unanswered Prayers* and *Autopsy of the Last Temptation* added. All marked
  Forthcoming 2027; *All Is Vanity* shows 11 February 2027.
- Zenith Bank: Chinwoke Mbadinuju Foundation, 1313554886 and 1313554910, on the Support page.
- All enquiries go through hello@cm.foundation; no separate addresses.
- Office hours: Monday to Friday, 9:00 a.m. – 5:00 p.m. (contact page and footer).
- Dashboard staff: the three addresses are added in Vercel (`ADMIN_EMAILS`, kept out of this public repository). They
  sign in at cm.foundation/admin with their email and the shared management password.
- *A Lawyer's Woes* stays, as Forthcoming 2027.
- Photos of Dr Mbadinuju (WhatsApp, 23 November): 17 new pictures at the front of the gallery, a sharper copy of
  the toast picture, and five from the funeral in Uli in a new "Laid to Rest" section (one is on the Burial
  Tributes card). Six were already on the site, and one was too small to use.
- Peace and Security Award (PASA 2026): two photos in a section of the gallery, one on the milestone.
- About page hero: the book stack photo. Founder 1980s: "Editor and Lecturer at Daily Times, Legal practice,
  Church Administration and Christian Literature."

**Settled earlier:** founder pictures and the 1945 picture (20 November); *The Present Truth* is 2008; ISBNs from the
cover wraps; typos corrected; covers for the forthcoming books.

---

## Part B: The manual (settings done by hand)

### 1. Receive email at hello@cm.foundation (do this first)

Mail to hello@cm.foundation is forwarded by Cloudflare to cmf.helloo@gmail.com, which no longer works. Messages sent through the website are not lost: every contact message, book order, piece of reader feedback and newsletter sign-up is also saved in **cm.foundation/admin → Inbox**. Emails people write *directly* to hello@ are lost until this is fixed.

1. Sign in to **dash.cloudflare.com** and open **cm.foundation → Email → Email Routing**.
2. Under **Destination addresses**, add a working inbox and click the confirmation link Cloudflare emails to it.
3. Under **Routing rules**, edit the rule for `hello@cm.foundation` and point it to the new address. Do the same for the catch-all rule if one exists.

### 2. The management dashboard

- **Address:** cm.foundation/admin.
- **Sign in:** an authorised email (`hello@cm.foundation` or one of the three staff addresses) and the shared management password (kept in Vercel as `ADMIN_PASSWORD`; ask the developer if you need it).
- **How long you stay signed in:** 400 days on each device, the longest browsers allow. The password itself never expires.
- **Sign out:** at the bottom of the sidebar; use it on shared computers.
- **Add a person or change the password:** ask the developer to update `ADMIN_EMAILS` or `ADMIN_PASSWORD` in Vercel.

Day-to-day use (inbox, donations, reading the figures, privacy rules) is in [MANUAL.md](MANUAL.md).

### 3. Google Analytics settings (optional, about 10 minutes)

Analytics is already collecting visits. These extras improve the reports. Go to **analytics.google.com → Admin**:

1. **Data collection and modification → Data retention:** set to **14 months**.
2. **Data display → Custom definitions → Create custom dimension:**
   - Create one each, with scope **Event**, for `book`, `section`, `category`, `purpose`, `enquiry`, `status` and `percent`.
   - Type the parameter name exactly as the name.
3. **Data display → Key events → New key event:** add `sign_up`, `institutional_order_submit`, `donate_click` and `generate_lead`.
4. **Data streams → cm.foundation → Configure tag settings → List unwanted referrals:** add `checkout.bachs.io`.
5. Leave **Google signals** off.
6. Do not add a GA4 tag inside Tag Manager, or visits are counted twice.

### 4. Google Search Console (about 5 minutes)

1. Go to **search.google.com/search-console → Add property**. Then either:
   - **Domain (recommended, needs Cloudflare access):** add the TXT record Google shows you in Cloudflare DNS, then click Verify.
   - **URL prefix:** use `https://cm.foundation` with the **HTML tag** method. Copy the tag's `content` value, give it to the developer to set as `GOOGLE_SITE_VERIFICATION`, then click Verify after the redeploy.
2. **Sitemaps:** submit `sitemap.xml`.
3. In **Google Analytics → Admin → Product links → Search Console links**, link the two.

### 5. Looker Studio traffic report (optional)

1. At **lookerstudio.google.com**, create a report with the **Google Analytics** and **Search Console** data sources (pages listed in `docs/ANALYTICS.md`).
2. **File → Embed report → Enable embedding**, and copy the embed link.
3. Give the link to the developer to set as `NEXT_PUBLIC_LOOKER_STUDIO_URL`. The report then appears at the foot of the dashboard.
