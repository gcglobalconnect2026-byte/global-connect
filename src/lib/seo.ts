import type { Metadata } from "next";

/**
 * Shared page metadata.
 *
 * Next shallow-merges metadata across route segments: a page that defines
 * `openGraph` replaces the root layout's `openGraph` entirely. Every route
 * therefore goes through `pageMetadata()` so site-wide OG/Twitter fields are
 * never silently dropped when a page adds its own image or type.
 *
 * `canonical`, `og:url` and image URLs are relative on purpose — they are
 * resolved against `metadataBase` in `src/app/layout.tsx`. Keep them relative
 * (never `new URL(...)`) so they stay serializable under `use cache`.
 */

export const SITE_NAME = "Global Connect";

export const DEFAULT_OG_IMAGE = {
  url: "/og-default.jpg",
  width: 1200,
  height: 630,
  alt: "Young people from different countries working together",
} as const;

export const DEFAULT_DESCRIPTION =
  "Discover international opportunities, online sessions, guides, and a global youth community. Exchanges, scholarships, conferences and volunteering for young people.";

export const HOMEPAGE_TITLE = `${SITE_NAME} — Your next global opportunity`;

type PageMeta = {
  /**
   * Title without the site suffix. The layout template appends
   * " · Global Connect" to titles from child segments only — pass
   * `{ absolute: HOMEPAGE_TITLE }` when the suffix is not wanted.
   */
  title: string | { absolute: string };
  description: string;
  /** Absolute path of this page, e.g. "/about" or "/guides/how-erasmus-works". */
  path: string;
  type?: "website" | "article";
  image?: typeof DEFAULT_OG_IMAGE;
};

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  image = DEFAULT_OG_IMAGE,
}: PageMeta): Metadata {
  // `openGraph.title` must be a plain string; unwrap `{ absolute }` forms.
  const ogTitle = typeof title === "string" ? title : (title?.absolute ?? "");

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image.url],
    },
  };
}
