import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How the Chinwoke Mbadinuju Foundation uses the information you share through this website, including messages and donations.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="We respect your privacy. Information you share with us through this website, for example when you contact us or make a donation, is used only to respond to you and to process your gift."
    />
  );
}
