import { SITE_URL } from "@/lib/site";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";
import type {
  GuideData,
  OpportunityData,
  SessionData,
} from "@/types/models";

/**
 * JSON-LD builders. Every URL must be absolute — search engines resolve
 * JSON-LD relative URLs against the document base, and an empty or wrong
 * `SITE_URL` silently degrades all of this, so `SITE_URL` is the single
 * source of truth (see `src/lib/site.ts`).
 */

type BreadcrumbItem = { name: string; path: string };

const absolute = (path: string) => `${SITE_URL}${path}`;

/**
 * Site-wide: Organization + WebSite.
 *
 * No `SearchAction` — the opportunity finder filters client-side and has no
 * query-parameter URL, so declaring a search endpoint would be false.
 */
export function organization(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/og-default.jpg`,
    inLanguage: "en",
    sameAs: ["https://t.me/globalconnect"],
  };
}

export function website(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Root node for `BreadcrumbList`; items are appended in display order. */
export function breadcrumb(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

/**
 * `Article` for guide pages. Dates are emitted only when the CMS has them —
 * a made-up `datePublished` is a trust violation, and Google requires
 * `dateModified` to be accurate if published.
 */
export function article(guide: GuideData): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absolute(`/guides/${guide.slug}`)}#article`,
    headline: guide.title,
    description: guide.excerpt,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE.url}`,
    url: absolute(`/guides/${guide.slug}`),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absolute(`/guides/${guide.slug}`),
    },
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };

  if (guide.publishedAt) node.datePublished = guide.publishedAt;
  if (guide.updatedAt) node.dateModified = guide.updatedAt;
  else if (guide.publishedAt) node.dateModified = guide.publishedAt;

  return node;
}

/**
 * `ItemList` for listing pages. Only entries that are actually rendered
 * belong here — advertising a page that does not exist is worse than
 * omitting it.
 */
export function itemList(
  name: string,
  items: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absolute(item.path),
    })),
  };
}

export const opportunityItemList = (opportunities: OpportunityData[]) =>
  itemList(
    "International opportunities for young people",
    opportunities.map((o) => ({
      name: o.title,
      path: `/opportunities/${o.slug}`,
    })),
  );

export const sessionItemList = (sessions: SessionData[]) =>
  itemList(
    "Online sessions",
    sessions.map((s) => ({
      name: s.title,
      path: `/sessions/${s.slug}`,
    })),
  );

export const guideItemList = (guides: GuideData[]) =>
  itemList(
    "Guides for applying to international programmes",
    guides.map((g) => ({
      name: g.title,
      path: `/guides/${g.slug}`,
    })),
  );
