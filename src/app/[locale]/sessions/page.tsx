import type { Metadata } from "next";
import { withLocale } from "@/i18n/params";
import { getTranslations } from "next-intl/server";

import { tv } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { breadcrumb, sessionItemList } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { PageBand, PageContainer, PageMain } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessions } from "@/lib/contentful/queries";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/sessions">): Promise<Metadata> {
  const { locale } = withLocale(await params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    title: t("sessions.title"),
    description: t("sessions.description"),
    path: "/sessions",
    locale,
  });
}

const sessionsPage = tv({
  slots: {
    grid: "grid gap-6 md:grid-cols-2 lg:grid-cols-4",
    card:
      "flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(36,36,64,0.4)]",
    cardHead: "flex-row items-center justify-between",
    icon: "text-3xl",
    badge: "rounded-full font-normal",
    cardBody: "flex flex-1 flex-col gap-3",
    title: "font-display text-xl text-foreground",
    description: "text-sm text-muted-foreground",
    meta: "mt-auto text-xs font-medium text-muted-foreground",
    button: "w-full",
  },
});

export default async function SessionsPage({
  params,
}: PageProps<"/[locale]/sessions">) {
  const { locale } = withLocale(await params);
  const [t, nav, meta, sessions] = await Promise.all([
    getTranslations({ locale, namespace: "Sessions" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Metadata" }),
    getSessions(locale),
  ]);
  const slots = sessionsPage();

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={breadcrumb(
          [
            { name: nav("home"), path: "" },
            { name: nav("sessions"), path: "/sessions" },
          ],
          locale,
        )}
      />
      <JsonLd data={sessionItemList(sessions, meta("itemListSessions"), locale)} />
      <PageMain>
        <PageBand>
          <PageHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </PageBand>
        <PageContainer size="wide">
          <div className={slots.grid()}>
            {sessions.map((session) => (
              <Card key={session.id} className={slots.card()}>
                <CardHeader className={slots.cardHead()}>
                  <span className={slots.icon()}>{session.icon}</span>
                  {session.online && (
                    <Badge variant="secondary" className={slots.badge()}>
                      {t("badgeOnline")}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className={slots.cardBody()}>
                  <h2 className={slots.title()}>{session.title}</h2>
                  <p className={slots.description()}>{session.description}</p>
                  <p className={slots.meta()}>
                    {session.duration} · {session.difficulty}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className={slots.button()}
                    size="sm"
                    render={<Link href={`/sessions/${session.slug}`} />}
                  >
                    {t("details")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </PageContainer>
      </PageMain>
      <SiteFooter />
    </>
  );
}
