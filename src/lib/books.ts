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
    cover: { motif: "sunrise", from: "#f2b45a", to: "#3f6b3a", ink: "#ffffff", image: "/images/covers/false-men-and-true-christians.jpg" },
  },
  {
    slug: "gods-kind-of-leader",
    title: "God's Kind of Leader",
    author: FOUNDER,
    year: 1991,
    collection: "founder",
    topics: ["Leadership", "Governance"],
    cover: { motif: "silhouettes", from: "#f0a347", to: "#7a3510", ink: "#2b1406", image: "/images/covers/gods-kind-of-leader.jpg" },
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
    cover: { type: "official", image: "/images/covers/official/a-criminal-in-heaven.png", width: 1029, height: 1529 },
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
    author: CHETA,
    year: 2027,
    collection: "forthcoming",
    topics: ["Law & Society"],
    cover: { motif: "scales", from: "#1d2f4d", to: "#0a1424", ink: "#e5b94e", image: "/images/covers/a-lawyers-woes.jpg" },
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
];

export const topics = ["Christianity", "Christian Living", "Leadership", "Law & Society", "Governance", "Memoir", "Contemporary Issues"];

export const availableBooks = books.filter((b) => b.collection !== "forthcoming");
export const forthcomingBooks = books.filter((b) => b.collection === "forthcoming");

export function getBook(slug: string) {
  return books.find((b) => b.slug === slug);
}
