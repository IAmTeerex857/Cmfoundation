import type { IconName } from "@/components/icons";

// What a gift can support, shown as choices on the giving card on /support.
// Donors enter any amount they like on the checkout page.

export type GivingFocus = {
  id: "general" | "books" | "learners" | "communities";
  tab: string;
  title: string;
  body: string;
  icon: IconName;
};

export const givingFocuses: GivingFocus[] = [
  {
    id: "general",
    tab: "Most needed",
    title: "Where it's needed most",
    body: "Your gift goes to the work that needs it most right now, across books, learning and community projects.",
    icon: "heart",
  },
  {
    id: "books",
    tab: "Books",
    title: "Share a book",
    body: "Keep the CMF Literature Series free to read online and help print copies for schools, churches and communities.",
    icon: "books",
  },
  {
    id: "learners",
    tab: "Learners",
    title: "Support a learner",
    body: "Back schools, students and learning initiatives in the communities we serve.",
    icon: "cap",
  },
  {
    id: "communities",
    tab: "Communities",
    title: "Strengthen a community",
    body: "Fund practical projects such as clean water and community infrastructure.",
    icon: "drop",
  },
];
