import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = pageMetadata({
  title: "Terms",
  description:
    "Global Connect terms of service: how we list opportunities, the limits of our listings, account conduct, and how third-party programme terms still apply to you.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" eyebrow="Legal">
      <LegalSection title="Using Global Connect">
        <p>
          Global Connect connects young people with international opportunities.
          We aim to keep listings accurate, but always confirm details on
          official programme pages before applying.
        </p>
      </LegalSection>
      <LegalSection title="Content">
        <p>
          Opportunity listings and guides are provided for informational
          purposes. We are not responsible for the application outcomes of
          third-party programmes we share.
        </p>
      </LegalSection>
      <LegalSection title="Account conduct">
        <p>
          Be kind. Harassment, spam or misleading content leads to account
          removal. Community members are expected to treat each other with
          respect.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
