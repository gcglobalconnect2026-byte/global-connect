import type { Metadata } from "next";
import { withLocale } from "@/i18n/params";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { tv } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { article, breadcrumb } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { PageArticle, PageMain } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RichText } from "@/lib/richtext";
import { getGuides } from "@/lib/contentful/queries";
import type { GuideData } from "@/types/models";

/**
 * This segment deliberately blocks: the guide record is resolved before the
 * first flush so an unknown slug returns a real 404 instead of a streamed
 * 200. Moving the lookup behind `<Suspense>` would make navigations instant
 * but reintroduce that 200 — see the SEO notes in the commit history.
 */
export const instant = false;

export async function generateStaticParams() {
  // Slugs are not localized, so any locale yields the same set — the parent
  // `[locale]` segment multiplies these out per language.
  const guides = await getGuides("en");
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/guides/[slug]">): Promise<Metadata> {
  const { locale, slug } = withLocale(await params);
  const guide = (await getGuides(locale)).find((g) => g.slug === slug);
  if (!guide) return {};
  return pageMetadata({
    title: guide.title,
    description: guide.excerpt,
    path: `/guides/${slug}`,
    locale,
    translatedLocales: guide.translatedLocales,
    type: "article",
  });
}

const guidePage = tv({
  slots: {
    backButton: "-ml-2 mb-8",
    backIcon: "size-4",
    meta: "flex items-center gap-2 text-sm text-muted-foreground",
    metaIcon: "size-4",
    title:
      "mt-4 font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl",
    excerpt: "mt-4 text-lg text-muted-foreground",
    body: "mt-10 border-t border-border pt-10",
    placeholder:
      "rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground",
    brandLink: "text-brand",
  },
});

async function GuideContent({
  guide,
  locale,
}: {
  guide: GuideData;
  locale: string;
}) {
  const [t, formatter] = await Promise.all([
    getTranslations({ locale, namespace: "Guides" }),
    getFormatter({ locale }),
  ]);
  const slots = guidePage();

  return (
    <PageArticle>
      <Button
        variant="ghost"
        size="sm"
        className={slots.backButton()}
        render={<Link href="/guides" />}
      >
        <ArrowLeft className={slots.backIcon()} />
        {t("all")}
      </Button>

      <div className={slots.meta()}>
        <Clock className={slots.metaIcon()} />
        {t("readTime", { count: guide.readTime })}
        {guide.publishedAt && <span aria-hidden>·</span>}
        {guide.publishedAt && (
          <time dateTime={guide.publishedAt}>
            {formatter.dateTime(new Date(guide.publishedAt), {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
      </div>

      <h1 className={slots.title()}>{guide.title}</h1>
      <p className={slots.excerpt()}>{guide.excerpt}</p>

      <div className={slots.body()}>
        {guide.body ? (
          <RichText document={guide.body} />
        ) : (
          <div className={slots.placeholder()}>
            {t.rich("placeholder", {
              opportunities: (chunks) => (
                <Link href="/opportunities" className={slots.brandLink()}>
                  {chunks}
                </Link>
              ),
              sessions: (chunks) => (
                <Link href="/sessions" className={slots.brandLink()}>
                  {chunks}
                </Link>
              ),
            })}
          </div>
        )}
      </div>
    </PageArticle>
  );
}

export default async function GuidePage({
  params,
}: PageProps<"/[locale]/guides/[slug]">) {
  const { locale, slug } = withLocale(await params);
  const nav = await getTranslations({ locale, namespace: "Nav" });

  // Resolve the record before rendering so unknown slugs return a real 404
  // status instead of streaming a 200 with a 404 body.
  const guide = (await getGuides(locale)).find((g) => g.slug === slug);
  if (!guide) notFound();

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={breadcrumb(
          [
            { name: nav("home"), path: "/" },
            { name: nav("guides"), path: "/guides" },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ],
          locale,
        )}
      />
      <JsonLd data={article(guide, locale)} />
      <PageMain>
        <GuideContent guide={guide} locale={locale} />
      </PageMain>
      <SiteFooter />
    </>
  );
}
