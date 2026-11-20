export const enquiryTypes = [
  { id: "general", label: "General enquiry" },
  { id: "books", label: "Books & the Literature Series" },
  { id: "partnership", label: "Institutional sponsorship & project collaboration" },
  { id: "sponsor", label: "Sponsor a print run" },
  { id: "inkind", label: "In-kind professional or material assistance" },
  { id: "volunteer", label: "Volunteering" },
  { id: "legacy", label: "Leaving a legacy" },
  { id: "events", label: "Events & invitations" },
  { id: "media", label: "Media & press" },
  // Sent through the separate "Propose a Collaboration" form, not chosen from the general list.
  { id: "collaboration", label: "Collaboration proposal" },
] as const;

/** The choices in the general contact form (the collaboration proposal has its own form). */
export const contactFormTypes = enquiryTypes.filter((t) => t.id !== "collaboration");

/** Kinds of collaboration offered in the "Propose a Collaboration" form (further instructions §5). */
export const collaborationTypes = [
  "Project sponsorship",
  "Jointly funded project",
  "Scholarship sponsorship",
  "Book printing or distribution",
  "Technical or professional collaboration",
  "Equipment, materials or services (in kind)",
  "Events and programmes",
  "Something else",
] as const;

export type EnquiryType = (typeof enquiryTypes)[number]["id"];

export function isEnquiryType(v: unknown): v is EnquiryType {
  return enquiryTypes.some((e) => e.id === v);
}
