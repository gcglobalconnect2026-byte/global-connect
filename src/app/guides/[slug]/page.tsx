import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import { tv } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageArticle, PageMain } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RichText } from "@/lib/richtext";
import { getGuides } from "@/lib/contentful/queries";

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = (await getGuides()).find((g) => g.slug === slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.excerpt,
  };
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

async function GuideContent({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const guides = await getGuides();
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) notFound();

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
        All guides
      </Button>

      <div className={slots.meta()}>
        <Clock className={slots.metaIcon()} />
        {guide.readTime} min read
        {guide.publishedAt && <span aria-hidden>·</span>}
        {guide.publishedAt && (
          <time dateTime={guide.publishedAt}>
            {new Date(guide.publishedAt).toLocaleDateString("en-US", {
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
            This guide&apos;s full text is coming soon. In the meantime,
            explore{" "}
            <Link href="/opportunities" className={slots.brandLink()}>
              opportunities
            </Link>{" "}
            or{" "}
            <Link href="/sessions" className={slots.brandLink()}>
              online sessions
            </Link>
            .
          </div>
        )}
      </div>
    </PageArticle>
  );
}

export default async function GuidePage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <>
      <SiteHeader />
      <PageMain>
        <Suspense>
          <GuideContent params={params} />
        </Suspense>
      </PageMain>
      <SiteFooter />
    </>
  );
}
