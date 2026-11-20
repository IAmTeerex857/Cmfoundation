import type { IconName } from "@/components/icons";

// What a gift can support (instructions §8.2). Each category has its own checkout link when the
// Foundation creates one in Bachs (see lib/payment-links.ts), so the payment record itself shows
// what the gift is for, and the donor never has to email afterwards.

export type GivingCategory = "general" | "scholarships" | "literature" | "community";

export type GivingFocus = { id: GivingCategory; tab: string; title: string; body: string; icon: IconName };

export const givingFocuses: GivingFocus[] = [
  {
    id: "general",
    tab: "General",
    title: "General support for the Foundation",
    body: "Applied where it is most needed across the Foundation's literary, educational and humanitarian work.",
    icon: "heart",
  },
  {
    id: "scholarships",
    tab: "Scholarships",
    title: "School fees and scholarships",
    body: "Helps children and students with school fees, scholarships and learning materials.",
    icon: "cap",
  },
  {
    id: "literature",
    tab: "Literature",
    title: "Printing and distributing free literature",
    body: "Keeps the digital library free and puts printed books into schools, churches and communities.",
    icon: "books",
  },
  {
    id: "community",
    tab: "Community",
    title: "Community development initiatives",
    body: "Supports carefully selected projects that meet identifiable needs, such as water access and infrastructure.",
    icon: "drop",
  },
];

export const isGivingCategory = (v: unknown): v is GivingCategory => givingFocuses.some((f) => f.id === v);

/** The Foundation's public statement on how resources are applied (instructions §2.5). */
export const nonprofitStatement =
  "The Chinwoke Mbadinuju Foundation is a nonprofit institution. Gifts, publication income and partnerships support its literary, educational and humanitarian purposes, including the legitimate operating costs that make that work possible, such as printing, staff and administration. No income is distributed to trustees or private individuals as profit.";
