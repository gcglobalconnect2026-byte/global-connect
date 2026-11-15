import type { MetadataRoute } from "next";

import { alternatesFor } from "@/lib/seo";
import {
  getGuides,
  getOpportunities,
  getSessions,
} from "@/lib/contentful/queries";
import { SITE_URL } from "@/lib/site";
import { LOCALE_CODES, type Locale } from "@/lib/locales";

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

type Freq = "weekly" | "monthly" | "yearly";

/** A page as it exists in every locale it is translated into. */
type LocalizedUrl = {
  /** Path relative to the locale prefix, e.g. "/guides/how-erasmus-works". */
  path: string;
  /** Locales that actually serve this page — see `translatedLocales`. */
  locales: readonly Locale[];
  lastModified?: string;
  changeFrequency: Freq;
  priority: number;
};

/**
 * Emits one sitemap row per locale, each carrying `alternates.languages` for
 * the full set — a row only ever advertises locales that really have the
 * content, so English fallback text is never indexed as German.
 */
function emit(url: LocalizedUrl): MetadataRoute.Sitemap {
  return url.locales.map((code) => ({
    url: `${SITE_URL}/${code}${url.path}`,
    lastModified: asDate(url.lastModified),
    changeFrequency: url.changeFrequency,
    priority: url.priority,
    alternates: { languages: alternatesFor(url.path, url.locales) },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Titles and dates are locale-independent for this file, so one pass with
  // the default locale is enough — `translatedLocales` is derived from the
  // raw multi-locale payload and is therefore the same in every pass.
  const [guides, opportunities, sessions] = await Promise.all([
    getGuides("en"),
    getOpportunities("en"),
    getSessions("en"),
  ]);

  const staticPages: LocalizedUrl[] = [
    { path: "", locales: LOCALE_CODES, changeFrequency: "weekly", priority: 1 },
    {
      path: "/about",
      locales: LOCALE_CODES,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/guides",
      locales: LOCALE_CODES,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/opportunities",
      locales: LOCALE_CODES,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/sessions",
      locales: LOCALE_CODES,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/privacy",
      locales: LOCALE_CODES,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      path: "/impressum",
      locales: LOCALE_CODES,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      path: "/terms",
      locales: LOCALE_CODES,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const guidePages: LocalizedUrl[] = guides.map((guide) => ({
    path: `/guides/${guide.slug}`,
    locales: guide.translatedLocales,
    lastModified: guide.updatedAt ?? guide.publishedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const opportunityPages: LocalizedUrl[] = opportunities.map((opportunity) => ({
    path: `/opportunities/${opportunity.slug}`,
    locales: opportunity.translatedLocales,
    lastModified: opportunity.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const sessionPages: LocalizedUrl[] = sessions.map((session) => ({
    path: `/sessions/${session.slug}`,
    locales: session.translatedLocales,
    lastModified: session.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages.flatMap(emit),
    ...guidePages.flatMap(emit),
    ...opportunityPages.flatMap(emit),
    ...sessionPages.flatMap(emit),
  ];
}
