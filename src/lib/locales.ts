/**
 * Locale registry — the single source of truth for which languages the site
 * serves and how each one is spelled for `<html lang>`, Open Graph, hreflang,
 * JSON-LD and the language switcher.
 *
 * `src/i18n/routing.ts` builds its route config from `LOCALE_CODES`, so adding
 * a language here plus a `messages/<code>.json` file is most of the work.
 * Contentful locales are a separate step — see LOCALIZATION.md.
 */

export const LOCALE_CODES = ["en", "de"] as const;

export type Locale = (typeof LOCALE_CODES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export interface LocaleMeta {
  /** Route segment value, e.g. "de" for `/de/...`. */
  code: Locale;
  /** Language name as displayed in the switcher, written in that language. */
  label: string;
  /** BCP-47 value for `<html lang>` and JSON-LD `inLanguage`. */
  htmlLang: string;
  /** `og:locale` value (underscore form). */
  ogLocale: string;
  /** `hreflang` value. */
  hreflang: string;
}

export const LOCALES: Record<Locale, LocaleMeta> = {
  en: {
    code: "en",
    label: "English",
    htmlLang: "en",
    ogLocale: "en_US",
    hreflang: "en",
  },
  de: {
    code: "de",
    label: "Deutsch",
    htmlLang: "de",
    ogLocale: "de_DE",
    hreflang: "de",
  },
};

/** Ordered list for the switcher and sitemap iteration. */
export const LOCALE_LIST: LocaleMeta[] = LOCALE_CODES.map(
  (code) => LOCALES[code],
);

export function isLocale(value: string): value is Locale {
  return (LOCALE_CODES as readonly string[]).includes(value);
}
