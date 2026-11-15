import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_CODES,
  type Locale,
} from "@/lib/locales";

/**
 * Shared page metadata.
 *
 * Next shallow-merges metadata across route segments: a page that defines
 * `openGraph` replaces the root layout's `openGraph` entirely. Every route
 * therefore goes through `pageMetadata()` so site-wide OG/Twitter fields are
 * never silently dropped when a page adds its own image or type.
 *
 * `canonical`, `og:url` and image URLs are relative on purpose — they are
 * resolved against `metadataBase` in the root layout. Keep them relative
 * (never `new URL(...)`) so they stay serializable under `use cache`.
 *
 * Site-wide strings (titles, descriptions, image alt) come from the message
 * catalogs via `getTranslations`, so they are never hardcoded here.
 */

export const SITE_NAME = "Global Connect";

export const DEFAULT_OG_IMAGE = {
  url: "/og-default.jpg",
  width: 1200,
  height: 630,
} as const;

/**
 * `alternates.languages` for a path that is relative to the locale prefix
 * (`/about` → `{ en: "/en/about", de: "/de/about", "x-default": "/en/about" }`).
 *
 * Only pass `locales` that actually have a translation — advertising a
 * `de` URL that renders English fallback content is a soft duplicate.
 */
export function alternatesFor(
  path: string,
  locales: readonly Locale[] = LOCALE_CODES,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const code of locales) {
    languages[LOCALES[code].hreflang] = `/${code}${path}`;
  }
  languages["x-default"] = `/${DEFAULT_LOCALE}${path}`;
  return languages;
}

type PageMeta = {
  /**
   * Title without the site suffix. The layout template appends
   * " · Global Connect" to titles from child segments only — pass
   * `{ absolute: <full title> }` when the suffix is not wanted.
   */
  title: string | { absolute: string };
  description: string;
  /**
   * Path relative to the locale prefix, e.g. "/about" or
   * "/guides/how-erasmus-works". Pass `""` for the locale root so the
   * canonical comes out as `/{locale}` without a trailing slash.
   */
  path: string;
  /** Locale this page is rendered in — drives canonical, hreflang and og:locale. */
  locale: Locale;
  /**
   * Locales that have a real translation of this page. Defaults to all
   * locales; CMS pages pass the entry's translation coverage.
   */
  translatedLocales?: readonly Locale[];
  type?: "website" | "article";
  image?: typeof DEFAULT_OG_IMAGE;
};

export async function pageMetadata({
  title,
  description,
  path,
  locale,
  translatedLocales = LOCALE_CODES,
  type = "website",
  image = DEFAULT_OG_IMAGE,
}: PageMeta): Promise<Metadata> {
  // `openGraph.title` must be a plain string; unwrap `{ absolute }` forms.
  const ogTitle = typeof title === "string" ? title : (title?.absolute ?? "");

  const t = await getTranslations({ locale, namespace: "Metadata" });
  const alternateLocales = translatedLocales.filter((code) => code !== locale);

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: alternatesFor(path, translatedLocales),
    },
    openGraph: {
      title: ogTitle,
      description,
      url: `/${locale}${path}`,
      siteName: SITE_NAME,
      locale: LOCALES[locale].ogLocale,
      alternateLocale: alternateLocales.map((code) => LOCALES[code].ogLocale),
      type,
      images: [{ ...image, alt: t("ogImageAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image.url],
    },
  };
}
