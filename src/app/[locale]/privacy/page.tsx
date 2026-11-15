import type { Metadata } from "next";
import { withLocale } from "@/i18n/params";
import { getTranslations } from "next-intl/server";

import { pageMetadata } from "@/lib/seo";
import {
  COMPLAINT_AUTHORITY_URL,
  CONTROLLER,
  POLICY_UPDATED,
  PROCESSORS,
  controllerAddress,
} from "@/lib/legal";
import { LegalList, LegalPage, LegalSection } from "@/components/legal-page";

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
  const address = controllerAddress();

  return (
    <LegalPage
      title={t("title")}
      eyebrow={t("eyebrow")}
      description={t("lastUpdated", { date: POLICY_UPDATED })}
    >
      <LegalSection title={t("controllerTitle")}>
        <p>{t("controllerBody")}</p>
        <p className="mt-3 font-medium text-foreground">{CONTROLLER.name}</p>
        {address && <p>{address}</p>}
        <p>
          <a
            href={`mailto:${CONTROLLER.email}`}
            className="text-brand hover:underline"
          >
            {CONTROLLER.email}
          </a>
        </p>
      </LegalSection>

      <LegalSection title={t("scopeTitle")}>
        <p>{t("scopeBody")}</p>
      </LegalSection>

      <LegalSection title={t("dataTitle")}>
        <p>{t("dataBody")}</p>
        <LegalList items={[t("dataLog"), t("dataMessage")]} />
      </LegalSection>

      <LegalSection title={t("purposesTitle")}>
        <p>{t("purposesBody")}</p>
      </LegalSection>

      <LegalSection title={t("storageTitle")}>
        <p>{t("storageBody")}</p>
      </LegalSection>

      <LegalSection title={t("analyticsTitle")}>
        <p>{t("analyticsBody")}</p>
      </LegalSection>

      <LegalSection title={t("youtubeTitle")}>
        <p>{t("youtubeBody")}</p>
      </LegalSection>

      <LegalSection title={t("processorsTitle")}>
        <p>{t("processorsBody")}</p>
        <LegalList
          items={PROCESSORS.map(
            (processor) =>
              `${processor.name} — ${processor.role} (${processor.location})`,
          )}
        />
      </LegalSection>

      <LegalSection title={t("transfersTitle")}>
        <p>{t("transfersBody")}</p>
      </LegalSection>

      <LegalSection title={t("retentionTitle")}>
        <p>{t("retentionBody")}</p>
      </LegalSection>

      <LegalSection title={t("rightsTitle")}>
        <p>{t("rightsBody")}</p>
        <LegalList
          items={[
            t("rightAccess"),
            t("rightRectification"),
            t("rightErasure"),
            t("rightRestriction"),
            t("rightPortability"),
            t("rightObject"),
            t("rightWithdraw"),
            t("rightComplain"),
          ]}
        />
        <p className="mt-3">{t("complaintBody")}</p>
        <p>
          <a
            href={COMPLAINT_AUTHORITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            {t("complaintAuthority")}
          </a>
        </p>
      </LegalSection>

      <LegalSection title={t("childrenTitle")}>
        <p>{t("childrenBody")}</p>
      </LegalSection>

      <LegalSection title={t("changesTitle")}>
        <p>{t("changesBody")}</p>
      </LegalSection>
    </LegalPage>
  );
}
