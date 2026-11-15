import type { Metadata } from "next";
import { withLocale } from "@/i18n/params";
import { getTranslations } from "next-intl/server";

import { pageMetadata } from "@/lib/seo";
import { LegalPage, LegalSection } from "@/components/legal-page";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = withLocale(await params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    title: t("privacy.title"),
    description: t("privacy.description"),
    path: "/privacy",
    locale,
  });
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[locale]/privacy">) {
  const { locale } = withLocale(await params);
  const t = await getTranslations({ locale, namespace: "Privacy" });

  const sections = [
    { title: t("collectTitle"), body: t("collectBody") },
    { title: t("useTitle"), body: t("useBody") },
    { title: t("choicesTitle"), body: t("choicesBody") },
  ];

  return (
    <LegalPage title={t("title")} eyebrow={t("eyebrow")}>
      {sections.map((section) => (
        <LegalSection key={section.title} title={section.title}>
          <p>{section.body}</p>
        </LegalSection>
      ))}
    </LegalPage>
  );
}
