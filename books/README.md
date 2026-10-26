# Book PDFs

Put each book's PDF in this folder, named exactly after its slug. Then commit it and redeploy. The book
becomes readable on the website. No code change is needed.

| Book | File name |
|---|---|
| False Men and True Christians | `false-men-and-true-christians.pdf` |
| God's Kind of Leader | `gods-kind-of-leader.pdf` *(added October 26, 2026)* |
| The Present Truth | `the-present-truth.pdf` |
| Journey Into the Past | `journey-into-the-past.pdf` |
| Law and Religion in Nigeria | `law-and-religion-in-nigeria.pdf` |
| Spiritual Worship | `spiritual-worship.pdf` |
| Who Then Is This Jesus? | `who-then-is-this-jesus.pdf` |
| Exploring the Godhead | `exploring-the-godhead.pdf` |
| The Wages of Sin | `the-wages-of-sin.pdf` |
| A Criminal in Heaven | `the-criminal-in-heaven.pdf` |
| All Is Vanity *(forthcoming)* | `all-is-vanity.pdf` |
| A Lawyer's Woes *(forthcoming)* | `a-lawyers-woes.pdf` |
| Judge Not! *(forthcoming)* | `judge-not.pdf` |
| Much Ado About Rapture *(forthcoming)* | `much-ado-about-rapture.pdf` |
| Assured, Not Entitled *(forthcoming)* | `assured-not-entitled.pdf` |
| Destiny Fulfilled: The Life & Times *(memorial brochure, not listed in the library; opened from the founder page)* | `destiny-fulfilled.pdf` *(added October 26, 2026)* |

When a PDF is present:

- The book's **Read Now** button opens the reader at `/read/<slug>`. Without the PDF, that page says the online edition is being prepared and offers a copy.
- The reader page is listed in the sitemap.
- A forthcoming title also becomes readable. When it is published, change its `collection` and `year` in `src/lib/books.ts` so it moves into the main library.

To add a book that is not in the table, add an entry to `src/lib/books.ts` first. Its `slug` is the file name.

## Why the PDFs are here and not in `public/`

Anything in `public/` can be downloaded by anyone who has its URL. These files are served only through
`/api/books/<slug>`, which streams them to the on-site reader in small byte ranges. The reader draws
pages onto a canvas. It has no download or print button. A visitor who opens or shares the file URL
directly is redirected to the reader page.

This stops casual downloading. No website can stop a determined person from copying what is shown on their
screen.

## Preparing the files

- **Use text-based PDFs** exported from the typesetting file (InDesign, Word and so on), not scans. They are smaller and sharper.
- **Optimise for the web.** In Acrobat use *Save as Other → Optimized PDF*, with "fast web view" on. Aim for under about 30 MB per book. Large photographs should be downscaled to about 150 dpi.
- **Leave the PDF unencrypted.** The reader cannot open password-protected files.
- **Hosting limit.** The PDFs ship with the website's server function. On Vercel the whole function must stay under 250 MB. If the collection grows beyond about 200 MB, move the files to object storage (Vercel Blob, S3 or R2) and change `src/app/api/books/[slug]/route.ts` to read from there.
