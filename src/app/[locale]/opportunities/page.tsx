import type { Metadata } from "next";
import { withLocale } from "@/i18n/params";
import { getTranslations } from "next-intl/server";

import { PageMain } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { OpportunityFinder } from "@/components/sections/opportunity-finder";
import { pageMetadata } from "@/lib/seo";
import { breadcrumb, opportunityItemList } from "@/lib/schema";
import {
  getHomepageSections,
  getOpportunities,
} from "@/lib/contentful/queries";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/opportunities">): Promise<Metadata> {
  const { locale } = withLocale(await params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    title: t("opportunities.title"),
    description: t("opportunities.description"),
    path: "/opportunities",
    locale,
  });
}

export default async function OpportunitiesPage({
  params,
}: PageProps<"/[locale]/opportunities">) {
  const { locale } = withLocale(await params);
  const [nav, meta, opportunities, homepageSections] = await Promise.all([
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Metadata" }),
    getOpportunities(locale),
    getHomepageSections(locale),
  ]);

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={breadcrumb(
          [
            { name: nav("home"), path: "/" },
            { name: nav("opportunities"), path: "/opportunities" },
          ],
          locale,
        )}
      />
      <JsonLd
        data={opportunityItemList(
          opportunities,
          meta("itemListOpportunities"),
          locale,
        )}
      />
      <PageMain>
        <OpportunityFinder
          opportunities={opportunities}
          config={homepageSections.opportunityFinder}
          headingAs="h1"
        />
      </PageMain>
      <SiteFooter />
    </>
  );
}
