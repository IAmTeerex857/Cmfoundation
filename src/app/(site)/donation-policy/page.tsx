import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Donation Policy",
  description: "How gifts to the Chinwoke Mbadinuju Foundation are processed and used for its literature, education and community work.",
  path: "/donation-policy",
});

export default function DonationPolicyPage() {
  return (
    <PolicyPage
      title="Donation Policy"
      intro="Gifts to the Chinwoke Mbadinuju Foundation are entirely voluntary: no gift is ever needed to read our books. Gifts are processed securely by our payment partner, and a donor may direct a gift to general support, school fees and scholarships, printing and distribution of free literature, or community development. The Chinwoke Mbadinuju Foundation is a nonprofit institution. Resources generated through its publications, voluntary contributions and partnerships are applied to advancing its literary, educational and humanitarian objectives. No income is distributed to trustees or private individuals as profit. Book orders and sponsorships are recorded separately from donations."
    />
  );
}
