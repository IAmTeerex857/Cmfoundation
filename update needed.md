# Updates Needed — CMF Foundation Website

What we still need from the Foundation to finish the website. Items are in priority order.

The original audit counted **49 image slots**: 23 using real CMF photos, 15 using stock photos, and 11 using placeholder book covers.

> **Implementation update (October 2026):** The live code no longer references the stock-photo folder. Thirteen original, photorealistic editorial illustrations now cover the 15 former stock placements, and five books now use supplied official covers from the shared Drive folder. Six books still use generated cover artwork with live HTML titles/authors. These are polished interim assets, not documentary proof of CMF events or official cover scans. The three milestone scenes and the six remaining generated covers should still be replaced when verified originals arrive. The Cheta section now uses an existing public NILA profile portrait; permission and a Foundation-owned original should still be confirmed. See `public/images/GENERATED_ASSETS.md`.

---

## 1. Book covers and files (highest priority)

Five official covers were supplied and installed on October 14, 2026. Six covers remain interim placeholders. We still need:

- the **front cover** for each unchecked title below (JPG or PNG, at least 1000px tall), and
- the **PDF** of every published book. Readers can read them free online on the site, but cannot download them. Put them in `books/`; the file names are listed in `books/README.md`.

| Book | Author | Collection | Cover | PDF |
|---|---|---|---|---|
| False Men and True Christians | Dr C. C. Mbadinuju | Founder's Library | ☐ | ☐ |
| God's Kind of Leader (1991) | Dr C. C. Mbadinuju | Founder's Library | ☐ | ☐ |
| The Present Truth (1998) | Dr C. C. Mbadinuju | Founder's Library | ☐ | ☐ |
| Exploring the Godhead (2018) | Cheta C. Mbadinuju | Current Series | ✓ | ☐ |
| The Wages of Sin (2020) | Cheta C. Mbadinuju | Current Series | ✓ | ☐ |
| A Criminal in Heaven (2022) | Cheta C. Mbadinuju | Current Series | ✓ | ☐ |
| All Is Vanity | Cheta C. Mbadinuju | Forthcoming 2027 | ✓ | — |
| A Lawyer's Woes | Cheta C. Mbadinuju | Forthcoming 2027 | ☐ | — |
| Judge Not! | Cheta C. Mbadinuju | Forthcoming 2027 | ☐ | — |
| Much Ado About Rapture | Cheta C. Mbadinuju | Forthcoming 2027 | ✓ | — |
| Assured, Not Entitled | Cheta C. Mbadinuju | Forthcoming 2027 | ☐ | — |

**Also needed:**
- The publication year for *False Men and True Christians*.
- The Founder's other books. The site says he wrote 22 works, but the library only lists 3. Please send titles, years and covers for the rest.

The covers appear on: Home, the Literature page and library, event cards, and the Home FAQ card.

---

## 2. Photos the site still needs

| Where | What's there now | What we need |
|---|---|---|
| Literature → "The Series Continues" | Existing public NILA profile portrait of Cheta | **A Foundation-owned original portrait of Cheta C. Mbadinuju**, plus permission confirmation for the interim image |
| Founder → Photo gallery | 4 photos, each reused across the site | **More photos of Dr Mbadinuju**: family, ministry, governorship, later years |

There are only 4 photos of Dr Mbadinuju, so each one appears 3–5 times across the site. More photos would reduce that repetition.

---

## 3. Generated interim imagery to replace with real CMF photos

These spots now use original generated editorial imagery instead of free stock photos. If the Foundation has real photos, they will be far more credible. **The three milestones are the most important**, because generated scenes must not be presented as records of actual events.

| # | Page | Section | Interim visual now | Ideal real photo |
|---|---|---|---|---|
| 1 | Our Work | Milestone: Children's Ministry Support | Crowd of children | **The actual ministry event** |
| 2 | Our Work | Milestone: Peace and Security Posthumous Award | Elder at a ceremony | **The actual award ceremony** |
| 3 | Our Work | Milestone: CMF Literature Series Launch (Abuja) | Audience in a hall | **The actual Abuja launch** |
| 4 | Home | "Education" card | Student reading to her class | Any CMF education project |
| 5 | Home | "Community" card | Hands planting a seedling | Any CMF community project |
| 6 | Home | "Give" banner | Children in a window | Children or families CMF has supported |
| 7 | About | Hero, 2nd photo | Schoolgirls with books | CMF books being handed out |
| 8 | About | Green band | Boy with a stack of books | A reader with a CMF book |
| 9 | Literature | Green band | Bookshelves | Shelves of CMF books or the archive |
| 10 | Our Work | Education Support card | Smiling student | A real school CMF supports |
| 11 | Our Work | Community Projects card | Seedling hands | A real community project |
| 12 | Our Work | Free Literature Distribution card | Schoolgirls with books | Real book distribution |
| 13 | Our Work | "Join" banner | Classroom with raised hands | Volunteers or a CMF event crowd |
| 14 | Support | Partnerships section | Linked hands | A CMF partner event |
| 15 | Support | "Give" banner | Girl reading against a wall | Children or families CMF has supported |

Stock photo credits are in `public/images/stock/CREDITS.md`.

---

## 4. Real CMF photos already in place (no action needed)

| Photo | Used on |
|---|---|
| Dr Mbadinuju smiling (red cap) | Home "Who we are", Founder hero |
| Dr Mbadinuju with coral beads | Home hero avatars, Home founder story, About "Our Story", Founder page |
| Dr Mbadinuju in bowler hat | Home hero avatars, Home "Books Freely Given", About hero, Literature "Founder's Library", Founder gallery |
| Dr Mbadinuju as a barrister | Home hero avatars, Home "Legacy" card, Founder "A Life Well Lived", Founder gallery |
| Children (community photo) | Home hero, Our Work hero, social share preview |
| Water project | Home hero, Our Work infrastructure card, Uli Waterworks milestone |

**Photo tips:** please send original files, not WhatsApp copies, which are compressed. Landscape photos at least 1600px wide work best. Make sure the Foundation has permission to publish any photos of children.

---

## 5. Other information still needed

### Payments (Bachs payment links)
No API keys are needed. In the Bachs dashboard, create payment links where the donor chooses the amount, with the redirect after payment set to `https://cm.foundation/support/thank-you`:
- [x] **Naira (NGN)** one-off payment link: received October 17, 2026 and built in. Please rename its checkout title in Bachs, which currently reads "Pay Meal", and set its redirect after payment to `/support/thank-you`.
- [ ] Optional: **US dollar (USD)** one-off payment link (`BACHS_PAYMENT_LINK_USD`)
- [ ] Optional: **monthly** payment link (`BACHS_PAYMENT_LINK_MONTHLY`)

### Contact details
- [x] **Name:** Chinwoke Mbadinuju Foundation (CMF).
- [x] **CMF Head Office:** Otunba Kayode Close, Asokoro, Abuja FCT. Added to the contact page and footer with the supplied map link.
- [x] **General email:** hello@cm.foundation.
- [x] **Phone:** +234 81 5675 2002.
- [ ] Real **social media links**: Facebook, X, Instagram, YouTube, LinkedIn. The icons currently point to each platform's home page.
- [ ] Confirm the remaining **email addresses**: partnerships@, media@ and events@cm.foundation
- [ ] Confirm **office hours** (currently Mon–Fri, 9am–5pm WAT)
- [ ] **Resend** for the contact form and newsletter: an API key, the `cm.foundation` domain verified in Resend, the inbox that should receive messages, and optionally a segment ID for newsletter subscribers

### Content to review and approve
- [ ] **FAQ answers.** The designs only listed the questions, so we drafted the answers.
- [ ] **Privacy Policy, Terms of Use and Donation Policy.** These pages are placeholders.
- [ ] **Event details.** Confirm the dates and times, add registration links, and give the exact day for the "Judge Not!" presentation (currently shown as April 2027, TBC).
- [ ] **Wording change.** We changed "His passing did not *create* the mission" to "did not *end* the mission", which reads like the intended meaning. Please confirm.
- [ ] **Quote attribution.** "Service is the rental we pay for the space we occupy" is usually credited to Shirley Chisholm. Please confirm it should be attributed to Dr Mbadinuju.

### Launch
- [x] **Hosting.** On Vercel, deploying automatically from `main` of https://github.com/IAmTeerex857/Cmfoundation.
- [x] **Domain.** cm.foundation and www.cm.foundation are live on Vercel over HTTPS.
