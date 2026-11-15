import type { Metadata } from "next";
import { withLocale } from "@/i18n/params";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { tv } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { breadcrumb } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tile } from "@/components/ui/tile";
import { JsonLd } from "@/components/json-ld";
import { PageArticle, PageMain } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessions, getSiteSettings } from "@/lib/contentful/queries";
import type { SessionData } from "@/types/models";

/**
 * This segment deliberately blocks: the session record is resolved before the
 * first flush so an unknown slug returns a real 404 instead of a streamed
 * 200. Moving the lookup behind `<Suspense>` would make navigations instant
 * but reintroduce that 200 — see the SEO notes in the commit history.
 */
export const instant = false;

export async function generateStaticParams() {
  // Slugs are not localized — see `guides/[slug]`.
  const sessions = await getSessions("en");
  return sessions.map((session) => ({ slug: session.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/sessions/[slug]">): Promise<Metadata> {
  const { locale, slug } = withLocale(await params);
  const session = (await getSessions(locale)).find((s) => s.slug === slug);
  if (!session) return {};
  return pageMetadata({
    title: session.title,
    description: session.description,
    path: `/sessions/${slug}`,
    locale,
    translatedLocales: session.translatedLocales,
  });
}

const sessionPage = tv({
  slots: {
    backButton: "-ml-2 mb-8",
    backIcon: "size-4",
    head: "flex items-center gap-3",
    badge: "rounded-full",
    title:
      "mt-6 font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl",
    description: "mt-4 text-lg text-muted-foreground",
    badges: "mt-8 flex flex-wrap gap-2",
    metaBadge: "rounded-full px-3 py-1",
    actions: "mt-8",
  },
});

async function SessionContent({
  session,
  communityUrl,
  locale,
}: {
  session: SessionData;
  communityUrl: string;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "Sessions" });
  const slots = sessionPage();

  return (
    <PageArticle>
      <Button
        variant="ghost"
        size="sm"
        className={slots.backButton()}
        render={<Link href="/sessions" />}
      >
        <ArrowLeft className={slots.backIcon()} />
        {t("all")}
      </Button>

      <div className={slots.head()}>
        <Tile
          palette="session"
          toneIndex={0}
          size="xl"
          shape="soft"
          content="icon"
        >
          {session.icon}
        </Tile>
        {session.online && (
          <Badge variant="secondary" className={slots.badge()}>
            {t("badgeOnline")}
          </Badge>
        )}
      </div>

      <h1 className={slots.title()}>{session.title}</h1>
      <p className={slots.description()}>{session.description}</p>

      <div className={slots.badges()}>
        <Badge variant="outline" className={slots.metaBadge()}>
          {session.duration}
        </Badge>
        <Badge variant="outline" className={slots.metaBadge()}>
          {session.difficulty}
        </Badge>
        {session.upcoming && (
          <Badge className={slots.metaBadge()}>{t("upcoming")}</Badge>
        )}
      </div>

      <div className={slots.actions()}>
        {session.registerUrl ? (
          <Button
            size="lg"
            render={
              <a
                href={session.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("registerAria")}
              />
            }
          >
            {t("register")}
          </Button>
        ) : (
          <Button
            size="lg"
            render={
              <a
                href={communityUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("joinToRegisterAria")}
              />
            }
          >
            {t("joinToRegister")}
          </Button>
        )}
      </div>
    </PageArticle>
  );
}

export default async function SessionPage({
  params,
}: PageProps<"/[locale]/sessions/[slug]">) {
  const { locale, slug } = withLocale(await params);
  const nav = await getTranslations({ locale, namespace: "Nav" });
  // Resolve the record before rendering so unknown slugs return a real 404
  // status instead of streaming a 200 with a 404 body.
  const [sessions, siteSettings] = await Promise.all([
    getSessions(locale),
    getSiteSettings(),
  ]);
  const session = sessions.find((s) => s.slug === slug);
  if (!session) notFound();

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={breadcrumb(
          [
            { name: nav("home"), path: "/" },
            { name: nav("sessions"), path: "/sessions" },
            { name: session.title, path: `/sessions/${session.slug}` },
          ],
          locale,
        )}
      />
      <PageMain>
        <SessionContent
          session={session}
          communityUrl={siteSettings.communityUrl}
          locale={locale}
        />
      </PageMain>
      <SiteFooter />
    </>
  );
}
