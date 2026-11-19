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
] as const;

export type EnquiryType = (typeof enquiryTypes)[number]["id"];

export function isEnquiryType(v: unknown): v is EnquiryType {
  return enquiryTypes.some((e) => e.id === v);
}
