import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = { title: "Donation Policy" };

export default function DonationPolicyPage() {
  return (
    <PolicyPage
      title="Donation Policy"
      intro="Donations to the Chinwoke Mbadinuju Foundation are processed securely by our payment partner, Bachs, and are applied to the Foundation's literature, education and community work."
    />
  );
}
