import type { IconName } from "@/components/icons";

export const pillars: { title: string; label: string; short: string; body: string; icon: IconName; cta: string; href: string }[] = [
  {
    title: "Literature & Publishing",
    label: "Literature",
    short: "Christian thought for a better understanding of life.",
    body: "Preserving and publishing works that inform faith, leadership and purposeful living. All CMF publications are freely available.",
    icon: "book",
    cta: "Explore the Literature Series",
    href: "/literature",
  },
  {
    title: "Education",
    label: "Education",
    short: "Supporting learning, opportunity and human potential.",
    body: "Supporting educational opportunity, literacy and intellectual development to help individuals realise their human potential.",
    icon: "cap",
    cta: "Our education work",
    href: "/our-work#initiatives",
  },
  {
    title: "Community Development",
    label: "Community",
    short: "Practical initiatives that strengthen lives and communities.",
    body: "Undertaking practical projects and interventions designed to improve lives and strengthen communities.",
    icon: "people",
    cta: "Our community projects",
    href: "/our-work#initiatives",
  },
  {
    title: "Legacy & Scholarship",
    label: "Legacy",
    short: "Preserving a remarkable life and inspiring future generations.",
    body: "Preserving the writings, photographs, historical records and intellectual contributions of Dr Mbadinuju for future generations.",
    icon: "pillar",
    cta: "The Odera archive",
    href: "/founder",
  },
];

export const initiatives = [
  { title: "Education Support", body: "Assisting schools, students and learning initiatives.", icon: "cap" as IconName },
  { title: "Community Projects", body: "Supporting practical solutions that improve lives and livelihoods.", icon: "sprout" as IconName },
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
};

// TODO(client): confirm dates, times and registration links.
export const events: CmfEvent[] = [
  { date: "2026-11-24", title: "CMF Literature Series & Books Presentation", location: "Abuja, Nigeria", online: false, book: "the-criminal-in-heaven" },
  { date: "2027-01-01", title: "Online Book Presentation (Judge Not!)", location: "Online", online: true, book: "judge-not" },
  { date: "2027-02-11", title: "Online Book Presentation (All Is Vanity)", location: "Online", online: true, book: "all-is-vanity" },
];

export const milestones = [
  { title: "Children's Ministry Support", category: "Education & Faith", image: "/images/generated/childrens-ministry.jpg" },
  { title: "Uli Community Solar Waterworks", category: "Community Development", image: "/images/clean-water-handwashing.jpg" },
  { title: "Peace and Security Posthumous Award", category: "Legacy", image: "/images/generated/award-ceremony.jpg" },
  { title: "CMF Literature Series Launch (Abuja)", category: "Literature", image: "/images/generated/literature-launch.jpg" },
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
