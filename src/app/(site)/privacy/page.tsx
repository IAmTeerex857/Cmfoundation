import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="We respect your privacy. Information you share with us through this website, for example when you contact us or make a donation, is used only to respond to you and to process your gift."
    />
  );
}
