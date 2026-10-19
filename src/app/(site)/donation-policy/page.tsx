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
      intro="Donations to the Chinwoke Mbadinuju Foundation are processed securely by our payment partner and are applied to the Foundation's literature, education and community work."
    />
  );
}
