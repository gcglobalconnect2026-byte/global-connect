import type { Locale } from "@/lib/locales";

/**
 * Contentful locale codes. The space's default locale is `en-US` (all
 * existing content), German was added as `de`.
 *
 * Site locale codes and Contentful codes are deliberately separate: the URL
 * prefix is `en`, the CMS key is `en-US`. Map them here only.
 */
export type CfLocale = "en-US" | "de";

export const CF_DEFAULT_LOCALE: CfLocale = "en-US";

export const CF_LOCALES: readonly CfLocale[] = ["en-US", "de"];

export const CONTENTFUL_LOCALE: Record<Locale, CfLocale> = {
  en: "en-US",
  de: "de",
};

export function toContentfulLocale(locale: Locale): CfLocale {
  return CONTENTFUL_LOCALE[locale];
}
