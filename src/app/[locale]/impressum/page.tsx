import type { Metadata } from "next";
import { withLocale } from "@/i18n/params";
import { getTranslations } from "next-intl/server";

import { pageMetadata } from "@/lib/seo";
import { CONTROLLER, controllerAddress } from "@/lib/legal";
import { LegalPage, LegalSection } from "@/components/legal-page";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/impressum">): Promise<Metadata> {
  const { locale } = withLocale(await params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    title: t("impressum.title"),
    description: t("impressum.description"),
    path: "/impressum",
    locale,
  });
}

export default async function ImpressumPage({
  params,
}: PageProps<"/[locale]/impressum">) {
  const { locale } = withLocale(await params);
  const t = await getTranslations({ locale, namespace: "Impressum" });
  const address = controllerAddress();

  return (
    <LegalPage title={t("title")} eyebrow={t("eyebrow")}>
      <LegalSection title={t("providerTitle")}>
        <p>{t("providerBody")}</p>
        <p className="mt-3 font-medium text-foreground">{CONTROLLER.name}</p>
        {/* § 5 DDG requires a postal address; it is rendered only once
            `CONTROLLER.address` is filled in — see the open item documented
            in src/lib/legal.ts. Nothing is invented here. */}
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

      <LegalSection title={t("contentTitle")}>
        <p>{t("contentBody")}</p>
      </LegalSection>

      <LegalSection title={t("linksTitle")}>
        <p>{t("linksBody")}</p>
      </LegalSection>
    </LegalPage>
  );
}
