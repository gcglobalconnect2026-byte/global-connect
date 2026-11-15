import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { tv } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { breadcrumb } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { PageArticle, PageMain } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RichText } from "@/lib/richtext";
import { getOpportunities } from "@/lib/contentful/queries";
import type { OpportunityData } from "@/types/models";

export async function generateStaticParams() {
  const opportunities = await getOpportunities();
  return opportunities.map((opportunity) => ({ slug: opportunity.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = (await getOpportunities()).find(
    (o) => o.slug === slug,
  );
  if (!opportunity) return {};
  return pageMetadata({
    title: opportunity.title,
    description: opportunity.description,
    path: `/opportunities/${slug}`,
  });
}

const opportunityPage = tv({
  slots: {
    backButton: "-ml-2 mb-8",
    backIcon: "size-4",
    head: "flex items-center gap-3 text-sm font-medium",
    flag: "text-3xl",
    badge: "rounded-full",
    title:
      "mt-4 font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl",
    description: "mt-3 text-lg text-muted-foreground",
    card: "mt-8",
    cardBody: "grid gap-4 sm:grid-cols-3",
    cardFoot: "flex flex-wrap gap-1.5 border-t border-border pt-4",
    tag: "rounded-full font-normal",
    prose: "prose prose-neutral max-w-none mt-8",
    fallback:
      "mt-8 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
    detail: "flex flex-col gap-0.5",
    detailLabel: "text-xs uppercase tracking-wide text-muted-foreground",
    detailValue: "font-medium",
  },
});

function OpportunityContent({ opportunity }: { opportunity: OpportunityData }) {
  const slots = opportunityPage();

  return (
    <PageArticle>
      <Button
        variant="ghost"
        size="sm"
        className={slots.backButton()}
        render={<Link href="/opportunities" />}
      >
        <ArrowLeft className={slots.backIcon()} />
        All opportunities
      </Button>

      <div className={slots.head()}>
        <span className={slots.flag()}>{opportunity.countryFlag}</span>
        <span>{opportunity.country}</span>
        <Badge variant="outline" className={slots.badge()}>
          {opportunity.type}
        </Badge>
      </div>

      <h1 className={slots.title()}>{opportunity.title}</h1>
      <p className={slots.description()}>{opportunity.description}</p>

      <Card className={slots.card()}>
        <CardContent className={slots.cardBody()}>
          <MetaRow label="Age" value={opportunity.ageRange} />
          <MetaRow label="Funding" value={opportunity.funding} />
          <MetaRow label="Deadline" value={opportunity.deadline} />
        </CardContent>
        <CardFooter className={slots.cardFoot()}>
          {opportunity.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className={slots.tag()}>
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>

      {opportunity.longDescription ? (
        <div className={slots.prose()}>
          <RichText document={opportunity.longDescription} />
        </div>
      ) : (
        <div className={slots.fallback()}>
          A full description will be added soon. Check the official programme
          page for details.
        </div>
      )}
    </PageArticle>
  );
}

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Resolve the record before rendering so unknown slugs return a real 404
  // status instead of streaming a 200 with a 404 body.
  const opportunity = (await getOpportunities()).find((o) => o.slug === slug);
  if (!opportunity) notFound();

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Opportunities", path: "/opportunities" },
          { name: opportunity.title, path: `/opportunities/${opportunity.slug}` },
        ])}
      />
      <PageMain>
        <OpportunityContent opportunity={opportunity} />
      </PageMain>
      <SiteFooter />
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  const slots = opportunityPage();
  return (
    <div className={slots.detail()}>
      <span className={slots.detailLabel()}>{label}</span>
      <span className={slots.detailValue()}>{value}</span>
    </div>
  );
}
