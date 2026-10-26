# CMF Foundation project status

Reviewed October 14, 2026 from the local source, assets, project notes, and available Git history. This is an implementation inventory, not confirmation of a live deployment or a complete transcript of earlier conversations.

## Project structure and history

- `site/`: CMF website built with Next.js, React, TypeScript, and Tailwind CSS.
- `../drive_assets/`: seven supplied page design images, the CMF logo, seven photographic assets, and five newly supplied official book covers. All preserved.
- `public/images/`: website photographs, generated interim illustrations and covers, and image provenance notes.
- Git's `main` branch has only the initial Create Next App commit. The CMF implementation is still uncommitted. It was preserved during cleanup.
- No CMF Git remote is currently configured. The previous `origin` incorrectly pointed to the unrelated PremiumCare repository and was removed.

## Website implementation already present

| Area | Implemented locally |
| --- | --- |
| Shared design | Responsive layouts; CMF brand palette (bronze, navy, cream, logo gold) on the RiseUp/Altruva layouts; display and body typography; logo; desktop and mobile navigation; navy footer; reusable buttons, cards, photo layouts, statistics, FAQ accordions, and quote slider. |
| Home | Foundation introduction, four mission pillars, founder story, featured literature, impact statements, FAQs, upcoming events, and support calls to action. |
| About | Foundation background, establishment in 2012, founder connection, vision, mission, values, and four pillars. |
| Founder | Biography, life timeline, defining chapters, four-photo gallery, quotations, and links to the literature collection. |
| Literature | Founder's Library, current series, Cheta section, forthcoming titles, and a searchable library with collection/topic filters and date/title sorting. |
| Book catalogue | Eleven entries: three founder titles, three current titles, and five forthcoming titles. A title becomes readable in the online reader as soon as `books/<slug>.pdf` is added; until then its card offers a printed-copy request. No downloads are offered. |
| Our Work | Literature, education, community development, legacy preservation, initiatives, working principles, four milestones, events, and partnership/volunteer links. |
| Events | Three configured event entries, date formatting, upcoming-event filtering, book artwork, and contact-based expressions of interest. Dates and registration details need confirmation. |
| Support | Giving card linking to Bachs payment links (NGN, USD, monthly; each optional), partnership and volunteering options, and giving FAQs. |
| Reader | `/read/<slug>`: full-screen PDF.js reader with range loading, zoom, page jump, keyboard navigation, light/sepia/night page colours, full screen and resume. No download or print control. |
| Contact | Confirmed email/phone, Abuja head-office address and map, enquiry form, separate contact points, FAQs, and prefilled book/event enquiries. The footer also links to the supplied office map. |
| Newsletter | Footer sign-up via `/api/newsletter`: adds the subscriber to a Resend segment when `RESEND_SEGMENT_ID` is set, otherwise emails the Foundation inbox. |
| Supporting pages | Privacy, terms, donation policy, donation thank-you page, and custom not-found page. Policy text remains draft. |
| Discoverability | Page metadata, Open Graph image, site icon, sitemap, and robots rules. |
| Accessibility provisions | Skip link, labelled form controls, navigation controls, image alternatives, and reduced-motion styling are present; a full accessibility audit has not been performed. |

## Integration code and remaining setup

- **Donations:** Bachs payment links set by environment variable (see `.env.example`). The site holds no payment keys and runs no payment code; gift records and receipts live in the Bachs dashboard. With no links set, Support shows a coming-soon state.
- **Books:** PDFs live in `books/` (outside `public/`) and are streamed to the reader by `/api/books/[slug]` in byte ranges; direct visits redirect to the reader. See `books/README.md`.
- **Contact email:** Resend delivery, validation, and a honeypot are implemented. Production requires a valid API key, destination inbox, and verified sender. The development fallback can return success without delivering email.
- **Newsletter:** Resend contacts/segment when `RESEND_SEGMENT_ID` is set; otherwise the sign-up is emailed to the Foundation inbox.
- **Configuration:** `.env.example` documents the expected settings. No local `.env` or `.env.local` was found during this review. Hosted service settings and deployment were not inspected.

## Assets already prepared

- Original Drive reference assets are retained in `../drive_assets/`.
- Founder portraits are used throughout the site. The home hero shows one supplied photo (`students-reading.jpg`); `clean-water-handwashing.jpg` illustrates the home page's community section. Both replaced the earlier community and water-project photographs everywhere on October 19, 2026. The original water-project photo is still in `drive_assets/`.
- Thirteen generated editorial illustrations cover former stock-image placements.
- Five supplied official covers now display complete artwork without generated typography or cropping. Six titles still use generated interim backgrounds with live HTML titles/authors. See `public/images/SUPPLIED_ASSETS.md` for provenance.
- A public NILA portrait of Cheta is present; Foundation permission and an original replacement are still pending.
- The original stock folder and credit notes remain, although the current source no longer references its photographs.
- Generated milestone scenes are illustrative, not evidence of actual CMF events; replace them with verified photographs.

## Needed for the next website update

1. Review any further instructions or assets supplied by the Foundation. The original Drive link has now been received and its five additional covers installed.
2. The six remaining official book covers and downloadable PDFs; the remaining founder bibliography and missing publication details.
3. Verified event, ministry, award, education, community, and book-distribution photos; additional founder and Cheta portraits.
4. Confirm the departmental email addresses and office hours, and provide real social-profile URLs. The name, general email and phone are confirmed. Current social links point to platform homepages.
5. Office location is now complete: CMF Head Office, Otunba Kayode Close, Asokoro, Abuja FCT, with the supplied Google Maps pin. The unrelated Columbia location remains removed.
6. Approved event dates, registration details, FAQ answers, biographical claims, quotations, and policy copy.
7. Resend configuration and a test message; book PDFs (see `books/README.md`); a test donation through the naira payment link.
8. Done October 18, 2026: the repository is on GitHub, hosting is on Vercel (deploys from `main`) and cm.foundation is live. Remaining for production: Resend variables in Vercel, then book PDFs.

See `update needed.md` for the existing book-by-book and image-placement checklist.

## Cleanup completed October 14, 2026

- Removed the unrelated `../Premium-Care/` Git worktree, including its separate public care website, staff portal, Supabase code, branding, dependencies, and build output.
- Removed the unrelated local `update-columbia-address` branch and the PremiumCare `origin` remote/tracking reference.
- Before removal, verified a complete Git recovery bundle at `/private/tmp/cmf-cleanup-20261014/premium-care-recovery.bundle`. This is temporary recovery storage, not a permanent archive.
- The removed worktree had no uncommitted source changes. Its ignored files were dependency and build directories.
- No remote repository, hosted website, database, or deployment was changed. No Git history rewrite or object pruning was performed.
- Added a workspace-level `AGENTS.md` identifying CMF and requiring clarification when an unrelated project is requested here.
- Removed the unrelated Columbia address from shared contact data, the contact page, and the footer after user confirmation. Adjusted the contact cards to two columns and added the missing office details to the content checklist.
- All other existing CMF source and Drive assets were preserved.

## Verification after cleanup

- ESLint, TypeScript checking (`tsc --noEmit --incremental false`), and `git diff --check` passed.
- Compared SHA-256 hashes for 126 original CMF files: none were deleted; only the three address-related source files and the existing content checklist changed.
- Source and readable asset scans found no PremiumCare branding or removed-address references.
- Git lists only the CMF `main` worktree and branch, with no remotes.
- No production build, browser visual review, external integration test, or deployment was performed in this cleanup.

## Supplied assets and contact update — October 14, 2026

- Retrieved five additional covers from the shared Drive folder and preserved exact originals in `../drive_assets/` and `public/images/covers/official/`.
- Updated Exploring the Godhead, The Wages of Sin, A Criminal in Heaven, All Is Vanity, and Much Ado About Rapture throughout the site.
- Corrected A Criminal in Heaven and its subtitle to match the supplied cover; retained the existing internal slug so book-request and event references still resolve. Added other supplied cover subtitles to searchable catalogue metadata.
- Confirmed the Foundation name, general email and phone; added the Abuja head office to shared contact data, contact cards, map and footer.
- The embedded map uses the place identifier resolved from the supplied short link, while directions links retain the supplied URL.
- Updated the asset checklist: five covers received, six still needed; no book PDFs were present in the shared folder.
- Validation passed: ESLint, TypeScript, asset existence and exact-copy checks, and a production build with `npm run build -- --webpack`. Default Turbopack hit an environment port-binding restriction; the project build script was not changed.
- Browser verification passed at desktop and mobile widths: all five official cover images loaded without extra text overlays, library search and the retained book-request link worked, the Abuja address/map/footer links were present, and no horizontal overflow or page runtime errors were observed. Visually confirmed the embedded map shows CMF Head Office.
- These updates are local; no hosted deployment was performed.

## Read-online, rebrand and integrations update — October 16, 2026

- **Brand colours restored.** The site had taken the green/lime palette of the RiseUp/Altruva references. It now uses the CMF palette sampled from the Drive page designs and logo: bronze `#a2601a` (design buttons ≈ `#a8641a`, darkened slightly for AA text contrast), navy `#0e2132`, cream/sand backgrounds, logo gold `#d4a82a`. The footer is navy with the gold mark, as in the designs. Layouts and typography from the references are unchanged.
- **Book storage and online reader.** Added `books/` for PDFs, `/api/books/[slug]` (range streaming; direct navigation and cross-site requests redirect to the reader; unknown slugs 404), and `/read/[slug]`, statically generated for each book with a PDF. Library, home and forthcoming cards switch to "Read online — free" automatically. Download wording was replaced throughout.
- **Donations simplified to Bachs payment links.** Removed the API checkout route, webhook route, Bachs API client and custom donation form (no API key, webhook secret or product ID needed any more). Added `src/lib/payment-links.ts` and the giving card. Invalid or non-HTTPS links are ignored.
- **Resend.** Shared `src/lib/email.ts`; the contact route uses it; new `/api/newsletter` with honeypot and segment support.
- **Structure.** Public pages moved into the `src/app/(site)/` route group so the reader can be full screen; the root not-found page carries its own header and footer. Removed unused create-next-app SVGs. Added `pdfjs-dist` 6.3.289 (pinned).
- **Verification.** ESLint, `tsc --noEmit`, `git diff --check` and `next build` (Turbopack) pass. In headless Chrome against the production build: the reader rendered a generated 40-page and a 2,000-page/7 MB test PDF (range requests only, jump to page 1500, zoom with position kept, arrow keys, night mode, resume after reload, only five page bitmaps held at once) at desktop and mobile widths with no console errors; every page returned 200 with no horizontal overflow and all images loaded; API checks covered redirects, 206/416 ranges, cross-site refusal and path-traversal 404s. Payment links and email endpoints were tested only with placeholder/unset configuration. The test PDFs were removed. No real Bachs or Resend transaction has been made, and nothing was deployed or pushed.
- **Backup.** Before these changes the site source (excluding `node_modules` and `.next`) was archived to the session scratchpad as `cmf-site-backup-20261016.tgz`. That location is temporary.

## Payment link and repository — October 17, 2026

- The Foundation's Bachs naira payment link (`https://checkout.bachs.io/pay/pl_af3bb8de098d`) is built in as the default NGN giving option. The checkout lets the donor enter any amount in NGN. Its page is currently titled "Pay Meal". It should show the Foundation's name, and its post-payment redirect has not been verified.
- The CMF repository is `https://github.com/IAmTeerex857/Cmfoundation.git` (remote `origin`). It was empty before the first push.
- Remaining before launch: book PDFs and the Resend connection.

## Motion, typography and giving redesign — October 18, 2026

- **Type:** Geist for headings, Inter for text, both through `next/font`. Bebas Neue and Public Sans were removed, and the third-party loader fonts are overridden to match.
- **Motion system:** Lenis smooth scrolling, a gold scroll-progress bar and page fade-ins. Scroll reveals are declared in markup with `data-reveal` (up, fade, scale, left, right, blur, clip, and word-by-word headings) and parallax with `data-parallax`. They are driven by `src/components/motion/scroll-effects.tsx` with styles in `globals.css`. Reveals are progressive enhancement: content is visible without JavaScript and with reduced motion, and a fallback shows everything if the script never starts. Numbers count up as they come into view.
- **Header and micro-interactions:** the header compacts and hides while scrolling down, with a sliding nav indicator and an animated mobile menu. Buttons get sliding arrows and a sheen, cards lift, book covers tilt in 3D, FAQ answers expand smoothly, and the quote slider cross-fades with timed progress bars. The footer has a back-to-top control.
- **Giving card (`src/components/give-card.tsx`):** the donor chooses what to support using a liquid-gooey tab pill, the panel animates between choices, and the main button has a metal-fx liquid-gold ring with a gold border beam around the card. The Bachs link cannot pre-fill an amount (verified: `?amount=` is ignored), so the card offers a pre-filled email to tell the Foundation where to direct the gift.
- **Suggested gifts:** three cards with count-up amounts, a cursor spotlight and a featured card with the gold beam. Each links straight to the checkout and says which amount to enter.
- **Loading states:** generative-loaders show a decode title while a book opens and inline loaders on the contact and newsletter buttons.
- **Copy:** every em dash was rewritten, and no visible text names Bachs (the FAQ and donation policy say "our payment partner").
- **New dependencies (exact pins):** `motion@13.5.1`, `lenis@1.3.26`, `border-beam@1.4.1`, `liquid-gooey@0.2.2`, `metal-fx@2.0.11` and `generative-loaders@0.1.1`. motion and generative-loaders share one `framer-motion@13.5.1`.
- **Verified:** ESLint, `tsc`, `git diff --check` and the production build pass. Every page has no console or hydration errors in both dev and production. Rendered text was checked for em dashes and "Bachs". Scroll-throughs at 1366px and 390px left no content hidden and caused no horizontal overflow. The reader still opens and renders, with the new loader. Metal is mounted after hydration because it decides between WebGL and its fallback only in the browser. Not committed or pushed.

## Simpler giving — October 18, 2026

- **Giving card:** now plain. A title, the four choices with a sliding tab, a short description of the chosen cause, and one navy button to the checkout. The "Secure" pill, the gold beam, the metal button and the liquid tab were removed.
- **Suggested gifts:** removed from the home and Support pages. The checkout takes any amount.
- **Buttons:** the hover sheen, glow, press-scale and springy arrow chips were removed site-wide. Buttons now change colour and slide their arrow.
- **Dependencies:** `border-beam`, `liquid-gooey` and `metal-fx` were uninstalled.
- **Donate buttons go to checkout:** the header and mobile-menu "Donate Now", the home hero's "Donate Now", the "Give Now" image banners on Home and Support, and the "Give a Donation" card all link straight to the checkout (`giveHref()` in `src/lib/payment-links.ts`, which honours `BACHS_PAYMENT_LINK_NGN`). "Support the Mission" links still go to the Support page.
- **Giving card button:** now reads just "Give", with no payment-method line or checkout note underneath. The footer's large "CMF" mark is centred.

## Email moves from Resend to Cloudflare — October 19, 2026

- `src/lib/email.ts` now sends through Cloudflare Email Service's REST API (`/accounts/{id}/email/sending/send`). Resend and the newsletter segment option were removed; newsletter sign-ups are emailed to `CONTACT_TO`.
- Receiving: Cloudflare Email Routing will forward hello@cm.foundation to cmf.helloo@gmail.com.
- Done October 19, 2026:
  - cm.foundation's DNS moved from Namecheap to Cloudflare. The zone is active, and the Vercel A and `www` CNAME records are DNS only.
  - Email Routing forwards hello@ and every other @cm.foundation address to cmf.helloo@gmail.com (verified).
  - A test email from website@cm.foundation reached that inbox.
  - `CLOUDFLARE_ACCOUNT_ID`, `CONTACT_TO` (cmf.helloo@gmail.com) and `CONTACT_FROM` are set in Vercel production.
- The account is on Cloudflare's free plan, so Email Sending for the domain could not be enabled (API error 2036). The site can still send to verified destination addresses, which is all it needs.
- Done October 19, 2026:
  - `CLOUDFLARE_EMAIL_TOKEN` is set in Vercel and production was redeployed.
  - Live tests passed. The contact form and newsletter sign-up both returned success, and Cloudflare reported each email as delivered to cmf.helloo@gmail.com.
  - Email setup is complete.

## Replying as hello@cm.foundation, and DMARC — October 19, 2026

- Gmail (cmf.helloo@gmail.com) sends as hello@cm.foundation using Gmail's "Send mail as" through Resend SMTP (`smtp.resend.com:465`, user `resend`), on Resend's free plan.
  - The domain is verified in Resend (eu-west-1). Its records are `resend._domainkey` TXT, and `send` and `rsend` CNAMEs to Resend.
  - Open and click tracking are off.
  - The website itself still sends through Cloudflare (`src/lib/email.ts`).
- DMARC is `_dmarc` TXT `v=DMARC1; p=quarantine; adkim=r; aspf=r`. It was switched from `p=none` on October 19, 2026, at the Foundation's request.
- mail-tester.com scored a Resend-sent email from hello@cm.foundation 10/10: SPF pass, DKIM pass (d=cm.foundation), DMARC pass.
- The website now sends through Resend (`RESEND_API_KEY`: a sending-only key for cm.foundation, named "CMF website"), because Cloudflare doesn't document how mail sent to verified addresses is signed. Cloudflare Email Service remains the fallback in `src/lib/email.ts`.
- End-to-end checks on October 19, 2026:
  - All DNS records resolve: Cloudflare MX, SPF, both DKIM keys, Resend's `send` and `rsend`, and DMARC with `p=quarantine`.
  - An external email to hello@cm.foundation was accepted by Cloudflare's mail servers.
  - The live contact form and newsletter sign-up both sent through Resend.

## Social sharing and search metadata — October 19, 2026

- **Share card:** `public/og-hero.jpg` (1200 × 630) is a capture of the home page hero (recaptured October 26, 2026 for the redesign). Every page uses it for Open Graph and as a large Twitter/X card. If the hero changes, recapture it at a 1680 × 882 viewport.
- **Per-page metadata:** each page sets its title, description, canonical URL, `og:url` and Twitter tags through `pageMetadata()` in `src/lib/metadata.ts`. Privacy, Terms, Donation Policy and Thank You gained descriptions.
- **Root layout:** keywords, author, publisher and format detection.
- **Icons and structured data:** `src/app/apple-icon.png` is the gold mark on navy. The home page carries schema.org `NGO` JSON-LD with name, logo, founder, contact details and Abuja address. Social profile links are not included because the footer's social URLs are still placeholders.

## Pages rebuilt to the Foundation's designs — October 26, 2026

- **Design:** every page now follows its page design in `../drive_assets/` (Home, About, Founder, Literature, Our Work, Support, Contact). Events, the policy pages, Thank You and 404 use the same style. The header and footer are unchanged.
- **Type and colour:**
  - Headings are EB Garamond, self-hosted from `src/app/fonts/` (variable weight, Latin subset, from Fontsource 5.3.0, SIL Open Font License). Text stays Inter.
  - Headings and text are navy blue (`ink` #0c1f42, `body` #2a3a55). The header and logo keep their earlier slate (`text-slate`) and Geist (`font-ui`).
  - Buttons are square and uppercase; eyebrows are bronze; cards are white with hairline borders.
- **Shared pieces (`src/components/ui.tsx`):**
  - `PageHero`: text on warm paper with one photo fading in from the right, an optional quote at the right, a badge, and a `compact` size for long titles.
  - `SectionIntro`, `IconPillars`, `QuoteBlock`, `CtaBand`, `ArrowLink`, `GoldRule` and a squarer `Faq`.
  - The RiseUp and Altruva components, the quote slider, count-up and spotlight were removed.
- **Home:** one hero photo (`students-reading.jpg`), four pillars, featured books with a "Coming in 2027" panel, the clean-water community band and the founder section.
  - The marquee, statistics, FAQ, events and image banner were removed, since the design doesn't have them.
- **Book buttons:** "Read Free" when a title's PDF is in `books/`, otherwise "Request a Copy". Nothing is called a download.
- **Design images we don't have yet:**
  - About: the book-spine stack hero, and photos of an open book, a boy writing and a water tower.
  - Founder: photos for each period of his life and each chapter, the collage's group photo and archive notebook, and burial tribute photos and text.
  - Our Work: a landscape, a water tower and event photos.
  - Support: a seedling against a bokeh background, a sunset landscape, and a girl in a classroom.
  - Contact: CMF-branded book spines and the CMF mug.
  - Existing photos stand in for all of these.
- **Verified:** ESLint, `tsc` and `next build` pass. Every page was checked at 390 and 1440 px (heroes also at 1280 and 1920): no horizontal overflow, no runtime errors, no em dashes, no visible "Bachs". The library search and filters and the contact form's prefill and validation still work. The give buttons still go to checkout.

## Page review tweaks — October 26, 2026

- **Header:** "Donate Now" is now "Support Our Mission" and goes to /support (desktop and mobile).
- **Home:** a shorter hero, with Featured Books straight after it, so the books show on first load at 1440 × 900; the pillars row follows the books.
- **About:** the hero image is the design's own book stack (`public/images/about-book-stack.jpg`), cut from `2 CMF About Us 26.png`, enlarged 2× with light sharpening, and shown at a modest size so it stays clear.
- **Our Work:** the hero is the Foundation's water project photo (`public/images/cmf-water-project.jpg`, from `drive_assets/CMF Water Project.jpg`). The events section was removed.
- **Events:** 24 Nov 2026 (Abuja), 1 Jan 2027 (Judge Not!), 11 Feb 2027 (All Is Vanity).
- **FAQs:** fuller answers and new questions:
  - New questions: CAC registration, reading for free, how donations are used, volunteering, and where we are based.
  - Every FAQ list opens with the CAC question.
- **Literature:**
  - Forthcoming titles are part of the library. "All" shows all 11 books and "Forthcoming" filters to the five upcoming titles.
  - `/literature?collection=forthcoming#library` opens that filter; the home page links to it.
  - The separate forthcoming section was removed.
  - The hero covers are larger, and All Is Vanity carries a "Coming 2027" label.
  - Both author photos are the same size.
- **Founder:** empty photo frames for the timeline, the chapters, the collage and the memory cards (Photo Gallery and Burial Tribute) until the Foundation sends photos. The hero keeps the supplied photo `Odera 4.jpg`.

## Clean heroes, Read Now and the Drive additions — October 26, 2026

- **Heroes:** the photo fills the right side of the hero, unboxed, from top to bottom and out to the screen edge, with only a short soft edge where it meets the background (the earlier wide washed-out fade and glows are gone). Pages with a quote keep it in its own space at the far right. The home hero no longer has the quote, so its photo is larger.
- **Home:** more room in the hero and featured books, while the books (covers, titles and buttons) still show on the first screen at 1440 × 900. Books readable online now come first in Featured Books, marked "Read free" (today: God's Kind of Leader). Covers of different shapes share one baseline.
- **Read Now:** every published book's button reads "Read Now" and opens `/read/<slug>`. Without a PDF, that page says the online edition is being prepared and offers "Request a Copy".
- **Drive additions** (copied into `drive_assets/`):
  - Final covers for A Criminal in Heaven, A Lawyer's Woes, False Men and True Christians and God's Kind of Leader.
  - Four more founder titles: Journey Into the Past, Law and Religion in Nigeria, Spiritual Worship and Who Then Is This Jesus?
  - The memorial brochure "Destiny Fulfilled: The Life & Times", readable from the founder page's Burial Tribute card. It is not listed in the library.
  - Two PDFs, so God's Kind of Leader and the brochure are readable online.
  - About 60 archive photographs.
- **Founder page:**
  - Archive photos fill the hero, collage, timeline, chapters and memory cards.
  - "View Gallery" opens `/founder/gallery`: 50 photos with a full-size viewer that has previous, next, Escape and arrow-key controls.
  - Three frames remain empty: 1945, Early Life, and Faith & Ministry.
- **Repository size:** the two PDFs add about 82 MB (the largest file is 62 MB, under GitHub's 100 MB limit).

## Hero size, five featured books and image swaps — October 26, 2026

- **Heroes:** the unboxed photo now starts at about the middle of the hero (51%, or 54% for long titles) with a slightly shorter hero, so it is bigger than the boxed version but no longer dominates. Quotes on Our Work, Support and Contact sit on a small card over the photo's lower right, so the photo no longer fades on both sides.
- **Home:** Featured Books shows five books in a spaced row under the heading (readable titles first, marked "Read free"); "Coming in 2027" is a short line beside the heading with a Forthcoming button. All five covers show on the first screen at 1440 × 900; titles and buttons too at 1920 × 1080.
- **Images:** Our Work's hero is the clean-water photo (`clean-water-handwashing.jpg`); the Foundation's own water project photo moved to the "Sustainable Community Infrastructure" card. Events' hero is `generated/literature-launch.jpg`.
- **Literature:** larger hero covers; the "Coming 2027" tag sits above All Is Vanity, and library cards no longer put a tag on the cover (the card text already says when a title is coming).
- **Follow-up:** the header bar is shorter (80 px, 64 px once scrolled). Featured Books has a single "View All Books" button. The covers, titles and "Read Now" buttons all show on the first screen at 1440 × 900 and 1710 × 980.
- **Follow-up:** hero photos now stop at the content's right edge (in line with the header's "Support Our Mission" button) instead of running to the screen edge. They are still unboxed, with the soft left edge and no frame. On phones they are unchanged.
- **Follow-up:** the Founder hero uses the supplied portrait (`founder/hero-portrait.jpg`, red cap and white lace). The earlier ceremony photo stays in the gallery.
