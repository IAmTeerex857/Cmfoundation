export type Collection = "founder" | "current" | "forthcoming";

export type CoverMotif = "sunrise" | "silhouettes" | "cross" | "rings" | "sunset-cross" | "crosses" | "tree" | "scales" | "gavel" | "trumpet" | "path";

type CoverArtwork =
  | { type: "official"; image: string; width: number; height: number }
  | { type?: "generated"; motif: CoverMotif; from: string; to: string; ink: string; image?: string };

export type Book = {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  year?: number;
  collection: Collection;
  topics: string[];
  cover: CoverArtwork;
  /** false keeps a title out of the library lists while it can still open in the reader (the memorial brochure). */
  listed?: boolean;
};

// A title becomes readable online when books/<slug>.pdf exists (see lib/manuscripts.ts), so the
// slugs below are also the PDF file names. Keep them stable: links, events and enquiries use them.

export const FOUNDER = "Dr C. C. Mbadinuju";
export const CHETA = "Cheta C. Mbadinuju";

export const books: Book[] = [
  {
    slug: "false-men-and-true-christians",
    title: "False Men and True Christians",
    author: FOUNDER,
    collection: "founder",
    topics: ["Christianity", "Christian Living"],
    cover: { type: "official", image: "/images/covers/official/false-men-and-true-christians.png", width: 992, height: 1586 },
  },
  {
    slug: "gods-kind-of-leader",
    title: "God's Kind of Leader",
    subtitle: "The Righteous & Responsible Man",
    author: FOUNDER,
    year: 1991,
    collection: "founder",
    topics: ["Leadership", "Governance"],
    cover: { type: "official", image: "/images/covers/official/gods-kind-of-leader.png", width: 1086, height: 1448 },
  },
  {
    slug: "the-present-truth",
    title: "The Present Truth",
    author: FOUNDER,
    year: 1998,
    collection: "founder",
    topics: ["Christianity"],
    cover: { motif: "cross", from: "#6f9fd0", to: "#163a66", ink: "#ffffff", image: "/images/covers/the-present-truth.jpg" },
  },
  // Years for the four titles below are not yet confirmed.
  {
    slug: "journey-into-the-past",
    title: "Journey Into the Past",
    subtitle: "Ordeal of a State Governor",
    author: FOUNDER,
    collection: "founder",
    topics: ["Memoir", "Governance"],
    cover: { type: "official", image: "/images/covers/official/journey-into-the-past.png", width: 1086, height: 1448 },
  },
  {
    slug: "law-and-religion-in-nigeria",
    title: "Law and Religion in Nigeria",
    author: FOUNDER,
    collection: "founder",
    topics: ["Law & Society", "Christianity"],
    cover: { type: "official", image: "/images/covers/official/law-and-religion-in-nigeria.png", width: 1086, height: 1448 },
  },
  {
    slug: "spiritual-worship",
    title: "Spiritual Worship",
    author: FOUNDER,
    collection: "founder",
    topics: ["Christianity", "Christian Living"],
    cover: { type: "official", image: "/images/covers/official/spiritual-worship.png", width: 1086, height: 1448 },
  },
  {
    slug: "who-then-is-this-jesus",
    title: "Who Then Is This Jesus?",
    author: FOUNDER,
    collection: "founder",
    topics: ["Christianity"],
    cover: { type: "official", image: "/images/covers/official/who-then-is-this-jesus.png", width: 1086, height: 1448 },
  },
  {
    slug: "exploring-the-godhead",
    title: "Exploring the Godhead",
    subtitle: "Know God. Understand Everything Else",
    author: CHETA,
    year: 2018,
    collection: "current",
    topics: ["Christianity"],
    cover: { type: "official", image: "/images/covers/official/exploring-the-godhead.png", width: 1023, height: 1537 },
  },
  {
    slug: "the-wages-of-sin",
    title: "The Wages of Sin",
    subtitle: "Death, Redemption and the Gift of Eternal Life",
    author: CHETA,
    year: 2020,
    collection: "current",
    topics: ["Christianity", "Christian Living"],
    cover: { type: "official", image: "/images/covers/official/the-wages-of-sin.png", width: 1696, height: 2528 },
  },
  {
    slug: "the-criminal-in-heaven",
    title: "A Criminal in Heaven",
    subtitle: "The Scandals of Grace and Entitlement",
    author: CHETA,
    year: 2022,
    collection: "current",
    topics: ["Christianity"],
    cover: { type: "official", image: "/images/covers/official/a-criminal-in-heaven-final.png", width: 1027, height: 1531 },
  },
  {
    slug: "all-is-vanity",
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
  // The memorial brochure. It opens in the reader from the founder page but isn't a Series title.
  {
    slug: "destiny-fulfilled",
    title: "Destiny Fulfilled: The Life & Times",
    subtitle: "Of His Excellency Dr Chinwoke Clement Mbadinuju (Odera)",
    author: "In memory of Dr C. C. Mbadinuju",
    collection: "founder",
    topics: [],
    cover: { type: "official", image: "/images/covers/official/destiny-fulfilled.png", width: 1086, height: 1448 },
    listed: false,
  },
];

export const topics = ["Christianity", "Christian Living", "Leadership", "Law & Society", "Governance", "Memoir", "Contemporary Issues"];

/** Titles shown in the library (everything except unlisted items such as the memorial brochure). */
export const libraryBooks = books.filter((b) => b.listed !== false);
export const availableBooks = libraryBooks.filter((b) => b.collection !== "forthcoming");
export const forthcomingBooks = libraryBooks.filter((b) => b.collection === "forthcoming");

export function getBook(slug: string) {
  return books.find((b) => b.slug === slug);
}
