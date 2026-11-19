import type { Metadata } from "next";
import Link from "next/link";
import { GoldRule } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How the Chinwoke Mbadinuju Foundation collects, uses and protects information when you read, register, write to us, order books or give.",
  path: "/privacy",
});

const UPDATED = "24 November 2026";

// The Foundation's privacy notice (instructions §10). Prepared against the Nigeria Data Protection
// Act 2023 and comparable international standards. The Foundation should confirm it through its
// privacy compliance review (§10.4); edit the sections below as decisions change.

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-line pt-8">
      <h2 className="display-sm">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-body [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  const email = site.contact.email;
  return (
    <>
      <section className="border-b border-line bg-gradient-to-r from-[#fcf5ea] via-blush to-blush py-14 lg:py-16">
        <div className="wrap">
          <p className="eyebrow">{site.name}</p>
          <h1 className="display-xl mt-4">Privacy Policy</h1>
          <GoldRule className="mt-7" />
          <p className="mt-6 max-w-2xl text-[1.08rem] leading-relaxed text-body">
            Our books are free to read, and you do not need to tell us anything about yourself to read them. This policy explains what we collect when you
            choose to register, write to us, order books or give, why we collect it, and the choices you have.
          </p>
          <p className="mt-3 text-sm text-muted">Last updated: {UPDATED}</p>
        </div>
      </section>

      <div className="wrap max-w-3xl space-y-10 py-14 lg:py-16">
        <nav aria-label="On this page" className="rounded-[4px] bg-blush p-6 text-sm">
          <p className="font-semibold text-ink">On this page</p>
          <ol className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
            {[
              ["who", "Who we are"],
              ["collect", "What we collect"],
              ["notes", "Your notes are private"],
              ["why", "Why we use it"],
              ["cookies", "Cookies, analytics and device storage"],
              ["share", "Who we share it with"],
              ["keep", "How long we keep it"],
              ["security", "How we protect it"],
              ["rights", "Your rights"],
              ["children", "Children"],
              ["changes", "Changes and contact"],
            ].map(([id, label], i) => (
              <li key={id}>
                <a href={`#${id}`} className="text-bronze hover:underline">
                  {i + 1}. {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <Section id="who" title="1. Who we are">
          <p>
            The {site.name} (&ldquo;CMF&rdquo;, &ldquo;we&rdquo;) is an independent nonprofit foundation with its head office at {site.contact.location},
            Nigeria. We are responsible for the personal information described in this policy. You can reach us about privacy at{" "}
            <a href={`mailto:${email}`} className="text-bronze underline">
              {email}
            </a>{" "}
            or on {site.contact.phone}.
          </p>
        </Section>

        <Section id="collect" title="2. What we collect">
          <ul>
            <li>
              <strong>Reading as a guest.</strong> Nothing that identifies you. Your reading position, text settings, bookmarks and notes are kept in your own
              browser, on your device.
            </li>
            <li>
              <strong>A free reader account (optional).</strong> Your name, country, city or state if you give it, and email address; the date you confirmed
              your email and acknowledged this policy; and, only if you tick the separate box, your agreement to receive our emails. We do not ask for your
              home address, phone number or precise location, and there is no password.
            </li>
            <li>
              <strong>Your reading workspace (account holders).</strong> Your reading positions, books started and completed, bookmarks, notes and text
              settings, so they are available on any device you sign in on.
            </li>
            <li>
              <strong>Feedback you send to CMF.</strong> Your message, the book and section you were reading, and your name and email if you give them.
            </li>
            <li>
              <strong>Enquiries and book orders.</strong> What you enter in our contact, partnership, volunteering and institutional order forms: for
              example your name, organisation, email, country, delivery town, the books and quantities you need and your message.
            </li>
            <li>
              <strong>Newsletter.</strong> Your email address and the date you subscribed.
            </li>
            <li>
              <strong>Donations.</strong> Payments are made on our payment partner&rsquo;s secure checkout; your card or bank details never reach our website.
              We keep a record of confirmed gifts (amount, currency, date, purpose, payment reference and, where provided, your name and email) for
              acknowledgement, receipts and our accounts.
            </li>
            <li>
              <strong>Website measurement.</strong> See section 5.
            </li>
          </ul>
        </Section>

        <Section id="notes" title="3. Your notes are private">
          <p>
            Personal notes are for you alone. We do not read them, analyse them or send them to anyone, and they are never sent to Google Analytics. The
            Foundation receives your words only when you deliberately use <strong>Send feedback to CMF</strong>, which is separate from your notes. When you
            use <strong>Email my notes</strong>, we send them only to your own confirmed email address.
          </p>
        </Section>

        <Section id="why" title="4. Why we use your information">
          <ul>
            <li>To create and run your reader account and provide the reading features you choose (necessary to provide the service you ask for).</li>
            <li>To reply to your feedback, enquiries and orders, and to arrange printed copies (necessary to respond to your request).</li>
            <li>
              To send occasional emails about new books, publications and Foundation activities, <strong>only if you have separately agreed</strong>. Registering
              is not permission to send promotional emails. You can unsubscribe at any time.
            </li>
            <li>To acknowledge gifts, issue receipts and keep proper financial records (legal obligations and our legitimate interests).</li>
            <li>
              To understand, in aggregate, how the library and website are used so we can improve them, and to keep the site secure (legitimate interests,
              and your consent for analytics cookies).
            </li>
          </ul>
          <p>We do not sell personal information, and we do not use it for advertising.</p>
        </Section>

        <Section id="cookies" title="5. Cookies, analytics and device storage">
          <ul>
            <li>
              <strong>Sign-in cookie.</strong> When you sign in, we set one secure, signed cookie (<code>cmf_reader</code>) that keeps you signed in for up to
              180 days. It is essential for the account to work and is removed when you sign out.
            </li>
            <li>
              <strong>Google Analytics (only with your consent).</strong> If you accept analytics cookies, Google Analytics 4 (through Google Tag Manager)
              measures visits, pages viewed, the device and approximate location, how visitors arrive, and reading events such as a chapter reached or a book
              completed. We never send your name, email, notes or anything that identifies you as a reader. If you decline, no Google Analytics code is
              loaded. Change your choice at any time with <strong>Cookie settings</strong> at the foot of every page.
            </li>
            <li>
              <strong>Aggregate counts without cookies.</strong> Our website also keeps simple daily totals (for example, how many times each book was opened
              or completed). These are counts only: no cookie, IP address or identifier is stored with them, and they cannot be linked to you.
            </li>
            <li>
              <strong>Device storage.</strong> Your browser stores your text settings, reading position, bookmarks, notes (when reading as a guest) and your
              cookie choice. You can clear this in your browser settings.
            </li>
            <li>
              <strong>Map.</strong> The map on our contact page is provided by Google Maps, which may set its own cookies when it loads.
            </li>
          </ul>
        </Section>

        <Section id="share" title="6. Who we share it with">
          <p>We use trusted service providers who process information on our behalf, under contract and only on our instructions:</p>
          <ul>
            <li>Vercel (website hosting) and Supabase (our secure database).</li>
            <li>Resend and Cloudflare (sending and receiving email).</li>
            <li>Google (Analytics, Tag Manager, Search Console and Looker Studio reports), only for measurement as described above.</li>
            <li>Our payment partner, which processes online gifts on its own secure checkout.</li>
          </ul>
          <p>
            Some of these providers store data outside Nigeria. Where they do, we rely on their contractual commitments and recognised safeguards to protect
            it. We disclose information to authorities only where the law requires it.
          </p>
        </Section>

        <Section id="keep" title="7. How long we keep it">
          <ul>
            <li>Reader accounts, notes and reading history: until you delete your account. Accounts not used for three years are deleted.</li>
            <li>Feedback, enquiries and order enquiries: up to two years after the matter is closed.</li>
            <li>Newsletter subscriptions: until you unsubscribe.</li>
            <li>Donation records: as long as accounting and legal requirements demand (normally six years).</li>
            <li>Google Analytics data: 14 months. Aggregate counts contain no personal information.</li>
            <li>Records of used sign-in links: one day.</li>
          </ul>
        </Section>

        <Section id="security" title="8. How we protect it">
          <ul>
            <li>All connections to the website are encrypted (HTTPS). Sign-in links expire after 30 minutes and work only once.</li>
            <li>Our database is not reachable from the public internet: only our website&rsquo;s server can read or write it, and each reader can reach only their own workspace.</li>
            <li>Only authorised Foundation staff can open the management dashboard, which never shows personal notes.</li>
            <li>Data is backed up by our database provider, and our software is kept up to date.</li>
            <li>
              If a breach affecting personal information occurs, we will contain it, notify the Nigeria Data Protection Commission within 72 hours where
              required, and inform the people affected without undue delay.
            </li>
          </ul>
        </Section>

        <Section id="rights" title="9. Your rights">
          <p>
            You may ask for access to, correction of, or deletion of your personal information, withdraw consent (for example to emails or analytics) at
            any time, object to certain uses, and ask for a copy of your information in a portable format, subject to applicable legal requirements.
          </p>
          <ul>
            <li>
              Signed-in readers can download their information or delete their account themselves on{" "}
              <Link href="/reader" className="text-bronze underline">
                your reader account page
              </Link>
              .
            </li>
            <li>
              Anyone can write to{" "}
              <a href={`mailto:${email}`} className="text-bronze underline">
                {email}
              </a>
              . We will reply within 30 days.
            </li>
            <li>You may also complain to the Nigeria Data Protection Commission (ndpc.gov.ng).</li>
          </ul>
        </Section>

        <Section id="children" title="10. Children">
          <p>
            Anyone may read our books without an account. Reader accounts are intended for people aged 18 and over; a younger reader may use one with the
            agreement of a parent or guardian. If you believe a child has given us information without that agreement, please contact us and we will delete
            it.
          </p>
        </Section>

        <Section id="changes" title="11. Changes and contact">
          <p>
            We will update this policy when our practices change and show the date above. Significant changes affecting account holders will be explained by
            email. Questions are welcome at{" "}
            <a href={`mailto:${email}`} className="text-bronze underline">
              {email}
            </a>
            .
          </p>
        </Section>
      </div>
    </>
  );
}
