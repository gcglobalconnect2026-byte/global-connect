import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { tv } from "@/lib/utils";
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

export async function generateStaticParams() {
  const sessions = await getSessions();
  return sessions.map((session) => ({ slug: session.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const session = (await getSessions()).find((s) => s.slug === slug);
  if (!session) return {};
  return pageMetadata({
    title: session.title,
    description: session.description,
    path: `/sessions/${slug}`,
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

function SessionContent({
  session,
  communityUrl,
}: {
  session: SessionData;
  communityUrl: string;
}) {
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
        All sessions
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
            Online
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
          <Badge className={slots.metaBadge()}>Upcoming</Badge>
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
                aria-label="Register for this session"
              />
            }
          >
            Register for this session
          </Button>
        ) : (
          <Button
            size="lg"
            render={
              <a
                href={communityUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join to register"
              />
            }
          >
            Join to register
          </Button>
        )}
      </div>
    </PageArticle>
  );
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Resolve the record before rendering so unknown slugs return a real 404
  // status instead of streaming a 200 with a 404 body.
  const [sessions, siteSettings] = await Promise.all([
    getSessions(),
    getSiteSettings(),
  ]);
  const session = sessions.find((s) => s.slug === slug);
  if (!session) notFound();

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Online Sessions", path: "/sessions" },
          { name: session.title, path: `/sessions/${session.slug}` },
        ])}
      />
      <PageMain>
        <SessionContent session={session} communityUrl={siteSettings.communityUrl} />
      </PageMain>
      <SiteFooter />
    </>
  );
}
