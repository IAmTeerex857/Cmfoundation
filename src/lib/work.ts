import type { IconName } from "@/components/icons";

// The Foundation's four interconnected areas of activity (instructions §2.3). Literature and
// education come first and carry the most weight: they are where the Foundation began.
export const pillars: { title: string; label: string; short: string; body: string; icon: IconName; cta: string; href: string; primary?: boolean }[] = [
  {
    title: "Literature & Knowledge",
    label: "Literature",
    short: "Writing, preserving and freely sharing Christian and public-interest literature.",
    body: "Writing, publishing, preserving, digitising and freely sharing Christian and public-interest literature, beginning with the works of our founder.",
    icon: "book",
    cta: "Explore the free library",
    href: "/literature#library",
    primary: true,
  },
  {
    title: "Education & Scholarships",
    label: "Education",
    short: "School fees, scholarships and learning materials for children and students.",
    body: "Assisting children, students and families with school fees, scholarships, educational materials and related needs.",
    icon: "cap",
    cta: "Our educational assistance",
    href: "/our-work#initiatives",
    primary: true,
  },
  {
    title: "Humanitarian Assistance",
    label: "Humanitarian",
    short: "Practical support for individuals and families in difficulty.",
    body: "Practical support for individuals and families facing financial or personal difficulty, including bereavement, family occasions and other circumstances where goodwill makes a difference.",
    icon: "heart",
    cta: "How we help",
    href: "/our-work#initiatives",
  },
  {
    title: "Community Initiatives",
    label: "Community",
    short: "Carefully selected projects that meet identifiable community needs.",
    body: "Undertaking or supporting carefully selected projects that meet identifiable community needs, including infrastructure, water access and other practical interventions.",
    icon: "drop",
    cta: "Community initiatives",
    href: "/our-work#initiatives",
  },
];

export const initiatives = [
  { title: "School Fees & Scholarships", body: "Helping children and students stay in school through school fees, scholarships and learning materials.", icon: "cap" as IconName },
  { title: "Help for Families", body: "Quiet, practical assistance for individuals and families in difficulty, including at times of bereavement.", icon: "heart" as IconName },
  { title: "Free Literature Distribution", body: "Printing and freely distributing books to churches, schools and communities.", icon: "books" as IconName },
  {
    title: "Sustainable Community Infrastructure",
    body: "Initiatives such as clean water projects and other community infrastructure.",
    icon: "drop" as IconName,
    image: "/images/clean-water-handwashing.jpg",
  },
];

export const approach = [
  { title: "Partnership", body: "Working with trusted individuals and organisations to achieve greater impact.", icon: "handshake" as IconName },
  { title: "Sustainability", body: "Focusing on initiatives that can endure and benefit future generations.", icon: "gear" as IconName },
  { title: "Accountability", body: "Stewarding resources with integrity and a clear sense of responsibility.", icon: "people" as IconName },
];

export type CmfEvent = {
  date: string; // "YYYY-MM-DD", or "YYYY-MM" when the day is not yet fixed
  title: string;
  location: string;
  online: boolean;
  /** Book slug to feature on the event card. */
  book?: string;
  /** The event's own page, when it has one. */
  href?: string;
};

// TODO(client): confirm dates, times and registration links.
export const events: CmfEvent[] = [
  { date: "2026-11-24", title: "CMF Literature Series & Books Presentation", location: "Abuja, Nigeria", online: false, book: "the-criminal-in-heaven", href: "/events/book-presentation-2026" },
  { date: "2027-01-01", title: "Online Book Presentation (Judge Not!)", location: "Online", online: true, book: "judge-not" },
  { date: "2027-02-11", title: "Online Book Presentation (All Is Vanity)", location: "Online", online: true, book: "all-is-vanity" },
];

// Selected milestones (instructions §4.5). Shown with icons rather than illustrative pictures, so
// nothing suggests a photograph of an event that it is not. Add `image` only for verified photos.
export const milestones: { title: string; category: string; icon: IconName; href?: string; image?: string }[] = [
  { title: "Children's Ministry Support", category: "Education & Faith", icon: "cap" },
  { title: "Uli Community Solar Waterworks", category: "Community Initiatives", icon: "drop" },
  { title: "Peace and Security Posthumous Award", category: "Legacy", icon: "star" },
  { title: "CMF Literature Series Presentation, Abuja (24 November 2026)", category: "Literature", icon: "books", href: "/events/book-presentation-2026" },
];

export const values = ["Faith", "Knowledge", "Service", "Stewardship", "Human Dignity", "Continuity"];

export function eventDateParts(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const month = new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-GB", { month: "short", timeZone: "UTC" }).toUpperCase();
  return { month, day: d ? String(d).padStart(2, "0") : undefined, year: String(y) };
}

/** Events that haven't happened yet. Month-only dates stay listed until the month ends. */
export function upcomingEvents(now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return events.filter((e) => (e.date.length === 7 ? `${e.date}-31` : e.date) >= today);
}
