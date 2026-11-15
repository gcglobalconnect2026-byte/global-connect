import type { Metadata } from "next";
import { withLocale } from "@/i18n/params";
import { getTranslations } from "next-intl/server";

import { pageMetadata } from "@/lib/seo";
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
    { title: t("usingTitle"), body: t("usingBody") },
    { title: t("contentTitle"), body: t("contentBody") },
    { title: t("conductTitle"), body: t("conductBody") },
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
