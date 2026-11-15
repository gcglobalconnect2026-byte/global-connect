import type { Metadata } from "next";
import { withLocale } from "@/i18n/params";
import { getTranslations } from "next-intl/server";

import { pageMetadata } from "@/lib/seo";
import { CONTROLLER, POLICY_UPDATED } from "@/lib/legal";
import { LegalPage, LegalSection } from "@/components/legal-page";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const { locale } = withLocale(await params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    title: t("terms.title"),
    description: t("terms.description"),
    path: "/terms",
    locale,
  });
}

export default async function TermsPage({
  params,
}: PageProps<"/[locale]/terms">) {
  const { locale } = withLocale(await params);
  const t = await getTranslations({ locale, namespace: "Terms" });

  const sections = [
    { key: "scope", title: t("scopeTitle"), body: t("scopeBody") },
    { key: "use", title: t("useTitle"), body: t("useBody") },
    { key: "content", title: t("contentTitle"), body: t("contentBody") },
    { key: "external", title: t("externalTitle"), body: t("externalBody") },
    {
      key: "accounts",
      title: t("accountsTitle"),
      body: t("accountsBody"),
    },
    {
      key: "community",
      title: t("communityTitle"),
      body: t("communityBody"),
    },
    { key: "ip", title: t("ipTitle"), body: t("ipBody") },
    {
      key: "availability",
      title: t("availabilityTitle"),
      body: t("availabilityBody"),
    },
    { key: "liability", title: t("liabilityTitle"), body: t("liabilityBody") },
    { key: "law", title: t("lawTitle"), body: t("lawBody") },
  ];

  return (
    <LegalPage
      title={t("title")}
      eyebrow={t("eyebrow")}
      description={t("lastUpdated", { date: POLICY_UPDATED })}
    >
      {sections.map((section) => (
        <LegalSection key={section.key} title={section.title}>
          <p>{section.body}</p>
        </LegalSection>
      ))}

      <LegalSection title={t("contactTitle")}>
        <p>{t("contactBody")}</p>
        <p className="mt-2">
          <a
            href={`mailto:${CONTROLLER.email}`}
            className="text-brand hover:underline"
          >
            {CONTROLLER.email}
          </a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
