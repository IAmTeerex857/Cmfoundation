import type { IconName } from "@/components/icons";

// What a gift can support. Used by the giving card on /support and the suggested gifts.
// Amounts are suggestions: donors choose the exact amount at checkout (minimum ₦100).

export type GivingFocus = {
  id: "general" | "books" | "learners" | "communities";
  tab: string;
  title: string;
  body: string;
  points: string[];
  icon: IconName;
  /** Suggested gift in naira, shown in the suggested gifts. */
  amount?: number;
};

export const MIN_GIFT = 100;

export const givingFocuses: GivingFocus[] = [
  {
    id: "general",
    tab: "Most needed",
    title: "Where it's needed most",
    body: "Your gift goes to the work that needs it most right now, across books, learning and community projects.",
    points: ["Free online library", "School and learning support", "Community projects"],
    icon: "heart",
  },
  {
    id: "books",
    tab: "Books",
    title: "Share a Book",
    body: "Keep the CMF Literature Series free to read online and help print copies for schools, churches and communities.",
    points: ["Digitising earlier works", "Free online library", "New releases"],
    icon: "books",
    amount: 10_000,
  },
  {
    id: "learners",
    tab: "Learners",
    title: "Support a Learner",
    body: "Back schools, students and learning initiatives in the communities we serve.",
    points: ["Learning materials", "School support", "Literacy initiatives"],
    icon: "cap",
    amount: 25_000,
  },
  {
    id: "communities",
    tab: "Communities",
    title: "Strengthen a Community",
    body: "Fund practical projects such as clean water and community infrastructure.",
    points: ["Clean water projects", "Community infrastructure", "Local partnerships"],
    icon: "drop",
    amount: 50_000,
  },
];

export const suggestedGifts = givingFocuses.filter((f) => f.amount !== undefined) as (GivingFocus & { amount: number })[];

export function naira(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}
