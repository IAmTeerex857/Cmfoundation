import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Use"
      intro="Publications in the CMF Literature Series are made freely available for personal reading and sharing in keeping with the Foundation's mission."
    />
  );
}
