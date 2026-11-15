import type { Metadata } from "next";
import { withLocale } from "@/i18n/params";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { tv } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { breadcrumb, guideItemList } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";
import { PageBand, PageContainer, PageMain } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tile } from "@/components/ui/tile";
import { getGuides } from "@/lib/contentful/queries";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/guides">): Promise<Metadata> {
  const { locale } = withLocale(await params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    title: t("guides.title"),
    description: t("guides.description"),
    path: "/guides",
    locale,
  });
}

const guidesPage = tv({
  slots: {
    grid: "grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3",
    card: "group flex flex-col bg-background p-8 transition-colors hover:bg-card",
    title: "mt-5 font-display text-xl leading-snug text-foreground",
    readTime: "mt-2 text-sm text-muted-foreground",
    cta: "mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground",
    ctaIcon: "size-4 transition-transform group-hover:translate-x-0.5",
  },
});

export default async function GuidesPage({
  params,
}: PageProps<"/[locale]/guides">) {
  const { locale } = withLocale(await params);
  const [t, nav, meta, guides] = await Promise.all([
    getTranslations({ locale, namespace: "Guides" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Metadata" }),
    getGuides(locale),
  ]);
  const slots = guidesPage();

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={breadcrumb(
          [
            { name: nav("home"), path: "/" },
            { name: nav("guides"), path: "/guides" },
          ],
          locale,
        )}
      />
      <JsonLd data={guideItemList(guides, meta("itemListGuides"), locale)} />
      <PageMain>
        <PageBand>
          <PageHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </PageBand>
        <PageContainer size="medium">
          <div className={slots.grid()}>
            {guides.map((guide, index) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className={slots.card()}
              >
                <Tile
                  palette="guide"
                  toneIndex={index}
                  size="lg"
                  shape="soft"
                  content="numberSm"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </Tile>
                <h2 className={slots.title()}>{guide.title}</h2>
                <p className={slots.readTime()}>
                  {t("readTime", { count: guide.readTime })}
                </p>
                <span className={slots.cta()}>
                  {t("read")}
                  <ArrowRight className={slots.ctaIcon()} />
                </span>
              </Link>
            ))}
          </div>
        </PageContainer>
      </PageMain>
      <SiteFooter />
    </>
  );
}
