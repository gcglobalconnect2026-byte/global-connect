import type { Metadata } from "next";

import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" eyebrow="Legal">
      <LegalSection title="What we collect">
        <p>
          Global Connect uses Contentful to store content and Clerk to manage
          accounts. We only collect the information you provide when you sign
          in, and basic usage data needed to keep the site running.
        </p>
      </LegalSection>
      <LegalSection title="How we use it">
        <p>
          Your details are used to personalise community features — like
          registering for sessions — and to keep the service secure. We never
          sell your data.
        </p>
      </LegalSection>
      <LegalSection title="Your choices">
        <p>
          You can ask to see or delete your data at any time by contacting us
          at the address on the About page.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
