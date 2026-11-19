# What's left: CMF website

_Updated 19 November 2026._ Everything in the Foundation's instructions of 18 November is built and live at
[cm.foundation](https://cm.foundation). What remains is information only the Foundation can supply, and a few
settings that are done by hand.

> **Urgent:** item 1 (the venue and time of the 24 November presentation). Everything else can follow the launch.

---

## Part A: Needed from Cheta

The site already handles each gap cleanly: nothing is broken or marked as missing while these are outstanding.

### Before 24 November

1. **Venue and start time of the 24 November presentation in Abuja.** It is not in any material received so far. The event page currently says the details are shared with guests.

### Books

2. **Which upcoming titles are current?** Cheta's three new books list *The Devil's Antics*, *Those Unanswered Prayers* and *Autopsy of The Last Temptation*. The website lists *A Lawyer's Woes*, *Judge Not!* and *Assured, Not Entitled*. Both lists include *All Is Vanity* and *Much Ado About Rapture*.
3. **Back covers** for *False Men and True Christians* and *God's Kind of Leader*.
4. **Amazon links** for *Exploring the Godhead*, *The Wages of Sin* and *A Criminal in Heaven* (when ready).
5. **Audiobook recordings** (when ready). The book pages already show "Audiobook Coming Soon".
6. **The other founder books:**
   - EPUB or PDF files for *The Present Truth*, *Journey Into the Past*, *Law and Religion in Nigeria*, *Spiritual Worship* and *Who Then Is This Jesus?*.
   - Publication years for the last four.
   - Titles and covers for the rest of his 22 works.

### Payments

7. **Zenith Bank details** for local transfers (bank, account name, account number).
8. **Bachs:**
   - One payment link for each purpose: general, scholarships, literature, community.
   - Rename the checkout title, which currently reads "Pay Meal".
   - Set the redirect after payment to `https://cm.foundation/support/thank-you`.

### Contact and events

9. **Social media profile links** (Facebook, X, Instagram, YouTube, LinkedIn). The icons are hidden until these exist.
10. **partnerships@, media@ and events@ addresses:** create them, or keep everything going through hello@. Until then, those contact points open the contact form.
11. **Office hours.** Hidden until confirmed.
12. **Times and registration links** for *Judge Not!* (1 January 2027) and *All Is Vanity* (11 February 2027).
13. **Staff** who need access to the management dashboard (their email addresses).

### To approve

The site already reads as final; nothing on it says "draft" or "awaiting approval".

14. The nonprofit statement, Privacy Policy, Terms of Use, Donation Policy and FAQ answers.
15. The quotations on the founder page, including "Service is the rent…", which is usually credited to Shirley Chisholm.

### Photos

16. **Real photos of the three milestones:**
    - the children's ministry donation
    - the Peace and Security award
    - the Abuja launch
17. **A portrait of Cheta** that the Foundation owns, and permission for the interim one currently used.
18. **More photos of Dr Mbadinuju**, especially his early life and his faith and ministry.

**Settled, no longer needed:**
- ISBNs: the cover-wrap numbers are used, and they are the only ones with a valid check digit.
- Typos in the books: corrected on the site.
- Covers for the forthcoming books: left as they are.

---

## Part B: The manual (settings done by hand)

### 1. Receive email at hello@cm.foundation (do this first)

Mail to hello@cm.foundation is forwarded by Cloudflare to cmf.helloo@gmail.com, which no longer works. Messages sent through the website are not lost: every contact message, book order, piece of reader feedback and newsletter sign-up is also saved in **cm.foundation/admin → Inbox**. Emails people write *directly* to hello@ are lost until this is fixed.

1. Sign in to **dash.cloudflare.com** and open **cm.foundation → Email → Email Routing**.
2. Under **Destination addresses**, add a working inbox and click the confirmation link Cloudflare emails to it.
3. Under **Routing rules**, edit the rule for `hello@cm.foundation` and point it to the new address. Do the same for the catch-all rule if one exists.

### 2. The management dashboard

- **Address:** cm.foundation/admin.
- **Sign in:** the email `hello@cm.foundation` and the management password (kept in Vercel as `ADMIN_PASSWORD`; ask the developer if you need it).
- **How long you stay signed in:** 400 days on each device, the longest browsers allow. The password itself never expires.
- **Sign out:** at the bottom of the sidebar; use it on shared computers.
- **Add a person or change the password:** ask the developer to update `ADMIN_EMAILS` or `ADMIN_PASSWORD` in Vercel.

Day-to-day use is described in `docs/ADMIN_GUIDE.md`.

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
