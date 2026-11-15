import type { MetadataRoute } from "next";
import { getGuides, getOpportunities, getSessions } from "@/lib/contentful/queries";
import { SITE_URL } from "@/lib/site";

/**
 * `lastModified` must come from real content timestamps. Stamping
 * `new Date()` on every entry makes the value change on every sitemap
 * fetch, which trains search engines to ignore `lastmod` entirely.
 *
 * Static listing pages have no CMS record, so they carry no
 * `lastModified` at all rather than a fabricated one.
 */
type LastModified = string | undefined;

const asDate = (value: LastModified): Date | string | undefined =>
  value ? new Date(value) : undefined;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [guides, opportunities, sessions] = await Promise.all([
    getGuides(),
    getOpportunities(),
    getSessions(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/opportunities`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/sessions`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: asDate(guide.updatedAt ?? guide.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const opportunityPages: MetadataRoute.Sitemap = opportunities.map((opportunity) => ({
    url: `${SITE_URL}/opportunities/${opportunity.slug}`,
    lastModified: asDate(opportunity.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const sessionPages: MetadataRoute.Sitemap = sessions.map((session) => ({
    url: `${SITE_URL}/sessions/${session.slug}`,
    lastModified: asDate(session.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...guidePages, ...opportunityPages, ...sessionPages];
}
