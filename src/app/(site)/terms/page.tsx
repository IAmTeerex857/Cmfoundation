import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: "The terms for using the Chinwoke Mbadinuju Foundation website and reading the CMF Literature Series online.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Use"
      intro="Publications in the CMF Literature Series are made freely available for personal reading and sharing in keeping with the Foundation's mission."
    />
  );
}
