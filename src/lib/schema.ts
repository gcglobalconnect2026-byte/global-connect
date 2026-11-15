import { SITE_URL } from "@/lib/site";
import { CONTROLLER } from "@/lib/legal";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";
import { LOCALES, type Locale } from "@/lib/locales";
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
 *
 * Paths passed in are relative to the locale prefix (`/guides/x`); each
 * builder prefixes the current locale, so callers never build URLs.
 */

type BreadcrumbItem = { name: string; path: string };

const absolute = (path: string, locale: Locale) =>
  `${SITE_URL}/${locale}${path}`;

const inLanguage = (locale: Locale) => LOCALES[locale].htmlLang;

/**
 * Site-wide: Organization + WebSite.
 *
 * `Organization` is the same entity on every page, so it points at the site
 * root — a locale-specific `url` under one `@id` would contradict itself
 * between `/en` and `/de`.
 *
 * `WebSite` is per-locale (each language version is its own site), hence a
 * distinct `@id` so the two never collide.
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
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTROLLER.email,
      availableLanguage: ["en", "de"],
    },
    sameAs: ["https://t.me/globalconnectforyou"],
  };
}

export function website(locale: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/${locale}#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    inLanguage: inLanguage(locale),
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * Root node for `BreadcrumbList`; items are appended in display order.
 *
 * `path` is relative to the locale prefix — pass `""` for the locale root
 * (`/en`), not `"/"`: the latter produces `/en/`, which 308-redirects.
 */
export function breadcrumb(
  items: BreadcrumbItem[],
  locale: Locale,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      // `BreadcrumbList` reads `item`; `url` is not a ListItem property.
      item: absolute(item.path, locale),
    })),
  };
}

/**
 * `Article` for guide pages.
 *
 * `datePublished` falls back to the CMS entry creation time: Google requires
 * it for Article eligibility, and `sys.createdAt` is a real timestamp rather
 * than a fabricated date. A `publishedAt` set by an editor takes precedence.
 */
export function article(
  guide: GuideData,
  locale: Locale,
): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absolute(`/guides/${guide.slug}`, locale)}#article`,
    headline: guide.title,
    description: guide.excerpt,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE.url}`,
    url: absolute(`/guides/${guide.slug}`, locale),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absolute(`/guides/${guide.slug}`, locale),
    },
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: inLanguage(locale),
  };

  const published = guide.publishedAt ?? guide.createdAt;
  const modified = guide.updatedAt ?? published;
  if (published) node.datePublished = published;
  if (modified) node.dateModified = modified;

  return node;
}

/**
 * `ItemList` for listing pages. Only entries that are actually rendered
 * belong here — advertising a page that does not exist is worse than
 * omitting it.
 *
 * `name` is localized by the caller (it is not user-visible, but it is
 * indexed).
 */
export function itemList(
  name: string,
  items: Array<{ name: string; path: string }>,
  locale: Locale,
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
      // `ItemList` reads `url`, unlike `BreadcrumbList` which reads `item`.
      url: absolute(item.path, locale),
    })),
  };
}

export const opportunityItemList = (
  opportunities: OpportunityData[],
  name: string,
  locale: Locale,
) =>
  itemList(
    name,
    opportunities.map((o) => ({
      name: o.title,
      path: `/opportunities/${o.slug}`,
    })),
    locale,
  );

export const sessionItemList = (
  sessions: SessionData[],
  name: string,
  locale: Locale,
) =>
  itemList(
    name,
    sessions.map((s) => ({
      name: s.title,
      path: `/sessions/${s.slug}`,
    })),
    locale,
  );

export const guideItemList = (
  guides: GuideData[],
  name: string,
  locale: Locale,
) =>
  itemList(
    name,
    guides.map((g) => ({
      name: g.title,
      path: `/guides/${g.slug}`,
    })),
    locale,
  );
