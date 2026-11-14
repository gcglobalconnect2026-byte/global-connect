import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { tv } from "@/lib/utils";
import { PageBand, PageContainer, PageMain } from "@/components/page-shell";
import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tile } from "@/components/ui/tile";
import { getGuides } from "@/lib/contentful/queries";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "How-to guides on motivation letters, scholarships, Erasmus+, interviews, CVs and more.",
};

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

export default async function GuidesPage() {
  const guides = await getGuides();
  const slots = guidesPage();

  return (
    <>
      <SiteHeader />
      <PageMain>
        <PageBand>
          <PageHeader
            eyebrow="Guides"
            title="Don't just find opportunities. Learn how to get them."
            description="Practical, no-fluff guides written for young people applying to international programmes."
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
                  {guide.readTime} min read
                </p>
                <span className={slots.cta()}>
                  Read guide
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
