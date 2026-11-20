export type Collection = "founder" | "current" | "forthcoming";

export type CoverMotif = "sunrise" | "silhouettes" | "cross" | "rings" | "sunset-cross" | "crosses" | "tree" | "scales" | "gavel" | "trumpet" | "path";

type CoverArtwork =
  | { type: "official"; image: string; width: number; height: number }
  | { type?: "generated"; motif: CoverMotif; from: string; to: string; ink: string; image?: string };

export type CoverImage = { image: string; width: number; height: number };

/** Bibliographic details shown on a book's page. Taken from the book's own title and copyright pages. */
export type Edition = {
  /** e.g. "First published 1986. CMF Literature Series edition, 2026." */
  history: string;
  publisher: string;
  pages?: number;
  format?: string;
  isbn?: string;
  language?: string;
};

export type Book = {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  /** Year of first publication (or the planned year for forthcoming titles). */
  year?: number;
  collection: Collection;
  topics: string[];
  cover: CoverArtwork;
  /** The official back cover. The spine is never shown. */
  back?: CoverImage;
  /** About 100 to 150 words on the book's subject and interest, shown on its page. */
  description?: string;
  edition?: Edition;
  /** Shown as "Coming Soon" (the Foundation's list); other unpublished titles show "Forthcoming". */
  comingSoon?: boolean;
  /**
   * Audiobook: "coming-soon" shows a non-clickable "Audiobook Coming Soon". Set `src` only once the
   * approved recording has been uploaded to a media service and tested.
   */
  audiobook?: { status: "coming-soon" } | { status: "available"; src: string; chapters?: { title: string; start: number }[] };
  /** The Amazon listing for the correct edition. Leave unset until a real listing exists. */
  amazonUrl?: string;
  /** Institutional and commemorative copies can be ordered from CMF. */
  orderable?: boolean;
  /** false keeps a title out of the library lists while it can still open in the reader (the memorial brochure). */
  listed?: boolean;
  /**
   * A biographical publication about the founder rather than a book he wrote (Life & Times). Labelled
   * as such everywhere it appears, and never sold or ordered: it is for reading only.
   */
  biography?: boolean;
  /** Contents of a PDF edition, with the page each section starts on (the reader opens at #page=N). */
  pageContents?: { title: string; page: number; items?: { title: string; page: number }[] }[];
};

// A title is readable online when books/<slug>/edition.json (the text edition, imported from the
// EPUB) or books/<slug>.pdf exists (see lib/manuscripts.ts). The slugs are also the file names and
// the permanent book page URLs (/books/<slug>). Keep them stable.

export const FOUNDER = "Dr Chinwoke C. Mbadinuju";
export const CHETA = "Cheta C. Mbadinuju";

const FOUNDER_SERIES = "CMF Literature Series";
const REMEMBRANCE_SERIES = "CMF Remembrance Series";
const TRADE = "Paperback, 127 × 203 mm";

/** The five titles launched for free online reading on 24 November 2026, in the Foundation's order. */
export const launchTitles = ["false-men-and-true-christians", "gods-kind-of-leader", "exploring-the-godhead", "the-wages-of-sin", "the-criminal-in-heaven"];

/**
 * The homepage book line (further instructions, 20 November 2026, §1): The Life & Times first, then
 * False Men and True Christians, then Cheta Mbadinuju's three books. God's Kind of Leader stays in
 * the library but is not on the homepage.
 */
export const homeTitles = ["destiny-fulfilled", "false-men-and-true-christians", "exploring-the-godhead", "the-wages-of-sin", "the-criminal-in-heaven"];

/** Where the memorial brochure's sections start (pages of books/destiny-fulfilled.pdf). */
export const LIFE_AND_TIMES = {
  slug: "destiny-fulfilled",
  pages: { lifeAndTimes: 6, books: 23, marble: 24, dateline1995: 25, dateline2016: 31, gallery: 37, tributes: 44 },
} as const;

export const books: Book[] = [
  {
    slug: "false-men-and-true-christians",
    title: "False Men and True Christians",
    subtitle: "The Last-Days Message for All",
    author: FOUNDER,
    year: 1986,
    collection: "founder",
    topics: ["Christianity", "Christian Living"],
    cover: { type: "official", image: "/images/covers/official/false-men-and-true-christians.png", width: 992, height: 1586 },
    description:
      "First published in 1986, False Men and True Christians is Dr Chinwoke C. Mbadinuju’s plain-spoken call to examine the foundations of Christian faith in the light of Scripture. It begins with the perfect and holy nature of God and the purpose for which humanity was created, and traces how sin separated people from that purpose. Across fourteen chapters the book considers sin, hell and heaven, the new birth and its evidence, the way of salvation, and the judgment of believers and unbelievers, before affirming that Jesus is Lord and God. Its central conviction is that church membership and good conduct cannot take the place of being born again. The book closes with My Life and My Salvation, the author’s own account of how he came to faith.",
    edition: { history: "First published 1986. Republished in the CMF Literature Series, 2026.", publisher: FOUNDER_SERIES, pages: 203, format: TRADE, language: "English" },
    orderable: true,
  },
  {
    slug: "gods-kind-of-leader",
    title: "God's Kind of Leader",
    subtitle: "The Righteous & Responsible Man",
    author: FOUNDER,
    year: 1988,
    collection: "founder",
    topics: ["Leadership", "Governance"],
    cover: { type: "official", image: "/images/covers/official/gods-kind-of-leader.png", width: 1086, height: 1448 },
    description:
      "God’s Kind of Leader began as a paper Dr Chinwoke C. Mbadinuju presented in September 1988 to the annual conference of the Christian Lawyers Fellowship of Nigeria at Onitsha, whose theme was the search for righteous and responsible leadership. Written as the nation debated its transition to civilian rule, it asks whether a righteous person can be found in public life and whether a political leader must be one. The book distinguishes a good person from a righteous one, examines responsibility and accountability to God, and proposes standards for national leadership. It then weighs the arguments of Christians who oppose taking part in politics against those who favour it, and closes with a call for leadership that is just, upright, accountable and guided by God.",
    edition: { history: "First published 1988. Reprinted 2023.", publisher: FOUNDER_SERIES, pages: 72, format: TRADE, language: "English" },
    orderable: true,
  },
  {
    slug: "the-present-truth",
    title: "The Present Truth",
    author: FOUNDER,
    year: 2008,
    collection: "founder",
    topics: ["Christianity"],
    cover: { motif: "cross", from: "#6f9fd0", to: "#163a66", ink: "#ffffff", image: "/images/covers/the-present-truth.jpg" },
  },
  // Years from the list of published books in Destiny Fulfilled (p. 23).
  {
    slug: "journey-into-the-past",
    title: "Journey Into the Past",
    subtitle: "Ordeal of a State Governor",
    author: FOUNDER,
    year: 2015,
    collection: "founder",
    topics: ["Memoir", "Governance"],
    cover: { type: "official", image: "/images/covers/official/journey-into-the-past.png", width: 1086, height: 1448 },
  },
  {
    slug: "law-and-religion-in-nigeria",
    title: "Law and Religion in Nigeria",
    author: FOUNDER,
    year: 1987,
    collection: "founder",
    topics: ["Law & Society", "Christianity"],
    cover: { type: "official", image: "/images/covers/official/law-and-religion-in-nigeria.png", width: 1086, height: 1448 },
  },
  {
    slug: "spiritual-worship",
    title: "Spiritual Worship",
    author: FOUNDER,
    year: 1996,
    collection: "founder",
    topics: ["Christianity", "Christian Living"],
    cover: { type: "official", image: "/images/covers/official/spiritual-worship.png", width: 1086, height: 1448 },
  },
  {
    slug: "who-then-is-this-jesus",
    title: "Who Then Is This Jesus?",
    author: FOUNDER,
    year: 2014,
    collection: "founder",
    topics: ["Christianity"],
    cover: { type: "official", image: "/images/covers/official/who-then-is-this-jesus.png", width: 1086, height: 1448 },
  },
  {
    slug: "exploring-the-godhead",
    title: "Exploring the Godhead",
    subtitle: "Know God. Understand Everything Else",
    author: CHETA,
    year: 2026,
    collection: "current",
    topics: ["Christianity"],
    cover: { type: "official", image: "/images/covers/official/exploring-the-godhead.png", width: 1023, height: 1537 },
    back: { image: "/images/covers/official/exploring-the-godhead-back.jpg", width: 746, height: 1041 },
    description:
      "Who is God, and what changes when we truly know Him? Exploring the Godhead is an enquiry into the mystery of the one God who reveals Himself in Trinity as Father, Son and Holy Spirit, and into what that revelation means for how we understand ourselves, our world and our place within it. Across twelve chapters in four parts, the book moves from the question of the Godhead, through Scripture, the historic creeds and the case made against the doctrine, to the work of the Father, the Son and the Holy Spirit in creation, redemption, the believer’s life and the Church, and finally to living today in the light of tomorrow. Throughout, it invites the reader beyond knowing about God into a relationship with Him.",
    edition: { history: "First edition, 2026.", publisher: REMEMBRANCE_SERIES, pages: 285, format: TRADE, isbn: "978-978-67-3073-8", language: "English" },
    audiobook: { status: "coming-soon" },
    orderable: true,
  },
  {
    slug: "the-wages-of-sin",
    title: "The Wages of Sin",
    subtitle: "Death, Redemption and the Gift of Eternal Life",
    author: CHETA,
    year: 2026,
    collection: "current",
    topics: ["Christianity", "Christian Living"],
    cover: { type: "official", image: "/images/covers/official/the-wages-of-sin.png", width: 1696, height: 2528 },
    back: { image: "/images/covers/official/the-wages-of-sin-back.jpg", width: 766, height: 1069 },
    description:
      "If death is the wages, who can bear the cost? The Wages of Sin traces the meaning of Romans 6:23 from Eden to the death and Resurrection of Jesus Christ. It begins with the one certainty every life shares, asks why death entered the world and what Scripture means by its verdict on sin, and then follows the promise of redemption through the Incarnation, the Cross and the empty tomb. The book examines why goodness cannot settle humanity’s debt, and why eternal life is a gift that cannot be earned but can be received and begun today. Its final part asks why Christians still die, what kind of life the gift produces, and how believers can face death with hope. The wages are ours. The gift is His.",
    edition: { history: "First edition, 2026.", publisher: REMEMBRANCE_SERIES, pages: 211, format: TRADE, isbn: "978-978-67-3075-2", language: "English" },
    audiobook: { status: "coming-soon" },
    orderable: true,
  },
  {
    slug: "the-criminal-in-heaven",
    title: "A Criminal in Heaven",
    subtitle: "The Scandals of Grace and Entitlement",
    author: CHETA,
    year: 2026,
    collection: "current",
    topics: ["Christianity"],
    cover: { type: "official", image: "/images/covers/official/a-criminal-in-heaven-final.png", width: 1027, height: 1531 },
    back: { image: "/images/covers/official/a-criminal-in-heaven-back.jpg", width: 764, height: 1097 },
    description:
      "A convicted, dying criminal entered Paradise with no lifetime of good works to present. Elsewhere, people who called Jesus “Lord, Lord”, prophesied and performed wonderful works in His name heard Him say, “I never knew you.” A Criminal in Heaven investigates these two startling verdicts and the question beneath them: on what basis does anyone enter the Kingdom of God? Across twelve chapters in four parts, the book weighs the case against grace and the defence of the deserving, considers the great reversal at the heart of God’s ways, examines religious pride and the true criterion of salvation, and ends at the foot of Calvary. In reconciling the two scandals, it asks how understanding God’s ways should reshape what we trust, how we judge and what we live for.",
    edition: { history: "First edition, 2026.", publisher: REMEMBRANCE_SERIES, pages: 192, format: TRADE, isbn: "978-978-67-3071-4", language: "English" },
    audiobook: { status: "coming-soon" },
    orderable: true,
  },
  {
    slug: "all-is-vanity",
    comingSoon: true,
    title: "All Is Vanity",
    subtitle: "From Futility to Fulfilment Through the Source",
    author: CHETA,
    year: 2027,
    collection: "forthcoming",
    topics: ["Christian Living", "Contemporary Issues"],
    cover: { type: "official", image: "/images/covers/official/all-is-vanity.png", width: 1686, height: 2528 },
  },
  {
    slug: "a-lawyers-woes",
    title: "A Lawyer's Woes",
    subtitle: "Burdens, Complicity and the Key of Knowledge",
    author: CHETA,
    year: 2027,
    collection: "forthcoming",
    topics: ["Law & Society"],
    cover: { type: "official", image: "/images/covers/official/a-lawyers-woes.png", width: 1027, height: 1531 },
  },
  {
    slug: "judge-not",
    title: "Judge Not!",
    author: CHETA,
    year: 2027,
    collection: "forthcoming",
    topics: ["Law & Society", "Christianity"],
    cover: { motif: "gavel", from: "#f3e6cf", to: "#a87a45", ink: "#1f1408", image: "/images/covers/judge-not.jpg" },
  },
  {
    slug: "much-ado-about-rapture",
    comingSoon: true,
    title: "Much Ado About Rapture",
    subtitle: "Beyond the Certainty of the Consummation",
    author: CHETA,
    year: 2027,
    collection: "forthcoming",
    topics: ["Christianity"],
    cover: { type: "official", image: "/images/covers/official/much-ado-about-rapture.jpg", width: 965, height: 1431 },
  },
  {
    slug: "assured-not-entitled",
    title: "Assured, Not Entitled",
    author: CHETA,
    year: 2027,
    collection: "forthcoming",
    topics: ["Christian Living"],
    cover: { motif: "path", from: "#b9d0a3", to: "#3e5b33", ink: "#ffffff", image: "/images/covers/assured-not-entitled.jpg" },
  },
  // The Life & Times: the biographical brochure published for the founder's state burial in November
  // 2023. It is read online only (never sold or ordered) and is labelled as a biographical publication.
  {
    slug: "destiny-fulfilled",
    title: "The Life & Times",
    subtitle: "Destiny Fulfilled: The Life & Times of His Excellency Dr Chinwoke Clement Mbadinuju (Odera)",
    author: "About Dr Chinwoke C. Mbadinuju",
    year: 2023,
    collection: "founder",
    topics: ["Memoir"],
    biography: true,
    cover: { type: "official", image: "/images/covers/official/destiny-fulfilled.png", width: 1086, height: 1448 },
    description:
      "Destiny Fulfilled is the biographical publication prepared for the state burial of Dr Chinwoke Clement Mbadinuju, Governor of Anambra State from 1999 to 2003, in November 2023. It opens with the Anambra State Government's announcement of the funeral arrangements and an account of his life: his birth in Uli in 1945, his education in Nigeria and the United States, and his years in teaching, journalism, law, Christian ministry and government. It lists his published works and includes Words on Marble, two interviews in his own words from 1995 and 2016. A photo gallery follows his early years, his career and politics and his later years, and the publication closes with tributes and condolence letters from family, friends, colleagues and institutions.",
    edition: { history: "Published for the state burial, November 2023.", publisher: "", pages: 150, format: "Illustrated memorial publication", language: "English" },
    pageContents: [
      { title: "State Burial Announcement, by the Anambra State Government", page: 5 },
      { title: "Life and Times", page: 6 },
      { title: "List of Published Books", page: 23 },
      { title: "Words on Marble", page: 24, items: [{ title: "Dateline 1995", page: 25 }, { title: "Dateline 2016", page: 31 }] },
      { title: "Photo Gallery", page: 37, items: [{ title: "Early Years", page: 38 }, { title: "Career and Politics", page: 40 }, { title: "Later Years", page: 42 }] },
      { title: "Tributes & Condolence Letters", page: 44 },
    ],
  },
];

export const topics = ["Christianity", "Christian Living", "Leadership", "Law & Society", "Governance", "Memoir", "Contemporary Issues"];

/** Titles shown in the library: the books themselves (the biographical publication has its own page). */
export const libraryBooks = books.filter((b) => b.listed !== false && !b.biography);
/** Every title with its own book page. */
export const bookPages = books.filter((b) => b.listed !== false);
export const availableBooks = libraryBooks.filter((b) => b.collection !== "forthcoming");
export const forthcomingBooks = libraryBooks.filter((b) => b.collection === "forthcoming");

export function getBook(slug: string) {
  return books.find((b) => b.slug === slug);
}

/** The launch titles, in the Foundation's order. */
export const launchBooks = launchTitles.map((s) => getBook(s)!);
/** The homepage book line, in the Foundation's order. */
export const homeBooks = homeTitles.map((s) => getBook(s)!);

/**
 * The accurate reading status of a title (instructions §5.1). A title is never shown as readable
 * unless its edition is actually on the site.
 */
export type BookStatus = "read-free" | "coming-soon" | "forthcoming" | "in-preparation";

export function bookStatus(book: Book, readable: boolean): BookStatus {
  if (readable) return "read-free";
  if (book.comingSoon) return "coming-soon";
  if (book.collection === "forthcoming") return "forthcoming";
  return "in-preparation";
}

export const statusLabels: Record<BookStatus, string> = {
  "read-free": "Read Free",
  "coming-soon": "Coming Soon",
  forthcoming: "Forthcoming",
  "in-preparation": "Not Yet Online",
};

/** The permanent, shareable page for a book. */
export const bookHref = (slug: string) => `/books/${slug}`;
