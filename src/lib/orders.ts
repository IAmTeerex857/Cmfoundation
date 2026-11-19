// Institutional and commemorative orders (instructions §7.3). Kept apart from donations: an order
// is a purchase enquiry, answered by the Foundation with pricing, delivery and availability.
export const orderPurposes = [
  "School or college",
  "Church or ministry",
  "Organisation or company",
  "Library",
  "Commemorative presentation",
  "Bulk purchase",
  "Other",
] as const;

export const isOrderPurpose = (v: unknown): v is string => typeof v === "string" && (orderPurposes as readonly string[]).includes(v);
