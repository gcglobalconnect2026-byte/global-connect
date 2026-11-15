import type { Metadata } from "next";
import Link from "next/link";

import { tv } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { breadcrumb, sessionItemList } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { PageBand, PageContainer, PageMain } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessions } from "@/lib/contentful/queries";

export const metadata: Metadata = pageMetadata({
  title: "Online Sessions",
  description:
    "Speaking clubs, workshops and sessions that build your skills and confidence.",
  path: "/sessions",
});

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

export default async function SessionsPage() {
  const sessions = await getSessions();
  const slots = sessionsPage();

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Online Sessions", path: "/sessions" },
        ])}
      />
      <JsonLd data={sessionItemList(sessions)} />
      <PageMain>
        <PageBand>
          <PageHeader
            eyebrow="Online sessions"
            title="Learn. Speak. Connect."
            description="Build the skills and confidence you need to take your next global step."
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
                      Online
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
                    Details
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
