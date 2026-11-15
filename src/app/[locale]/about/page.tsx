import type { Metadata } from "next";
import { withLocale } from "@/i18n/params";
import { getTranslations } from "next-intl/server";

import { PageBand, PageContainer, PageMain } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageHeader } from "@/components/page-header";
import { PartnersSection } from "@/components/sections/partners-section";
import {
  getHomepageSections,
  getPartners,
  getSiteSettings,
  getStories,
} from "@/lib/contentful/queries";
import { StoriesSection } from "@/components/sections/stories-section";
import { tv } from "@/lib/utils";

import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = withLocale(await params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    title: t("about.title"),
    description: t("about.description"),
    path: "/about",
    locale,
  });
}

const aboutPage = tv({
  slots: {
    stats: "grid gap-6 text-center sm:grid-cols-5",
    stat: "flex flex-col items-center gap-1",
    statValue: "font-display text-3xl text-foreground",
    statLabel: "text-sm text-muted-foreground",
    contactTitle: "font-display text-2xl tracking-tight text-foreground",
    contactText: "mt-2 text-muted-foreground",
    contactLink: "text-brand hover:underline",
  },
});

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = withLocale(await params);
  const [t, stats, partners, stories, homepageSections, siteSettings] =
    await Promise.all([
      getTranslations({ locale, namespace: "About" }),
      getTranslations({ locale, namespace: "Home.stats" }),
      getPartners(),
      getStories(locale),
      getHomepageSections(locale),
      getSiteSettings(),
    ]);

  const slots = aboutPage();

  return (
    <>
      <SiteHeader />
      <PageMain>
        <PageBand>
          <PageHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </PageBand>

        <PageContainer id="impact" size="compact">
          <div className={slots.stats()}>
            <Stat value="1,000+" label={stats("members")} />
            <Stat value="500+" label={stats("opportunities")} />
            <Stat value="35" label={stats("sessions")} />
            <Stat value="600" label={stats("mentored")} />
            <Stat value="3" label={stats("partnerships")} />
          </div>
        </PageContainer>

        {homepageSections.stories &&
          homepageSections.stories.enabled !== false && (
            <StoriesSection
              stories={stories}
              config={homepageSections.stories}
              communityUrl={siteSettings.communityUrl}
            />
          )}

        {homepageSections.partners &&
          homepageSections.partners.enabled !== false && (
            <div id="partners">
              <PartnersSection
                partners={partners}
                config={homepageSections.partners}
              />
            </div>
          )}

        <PageContainer id="contact" size="tiny" center>
          <h2 className={slots.contactTitle()}>{t("contactTitle")}</h2>
          <p className={slots.contactText()}>
            {t.rich("contactText", {
              address: siteSettings.contactEmail,
              email: (chunks) => (
                <a
                  href={`mailto:${siteSettings.contactEmail}`}
                  className={slots.contactLink()}
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </PageContainer>
      </PageMain>
      <SiteFooter />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  const slots = aboutPage();
  return (
    <div className={slots.stat()}>
      <span className={slots.statValue()}>{value}</span>
      <span className={slots.statLabel()}>{label}</span>
    </div>
  );
}
