import { defineRouting } from "next-intl/routing";

import { DEFAULT_LOCALE, LOCALE_CODES } from "@/lib/locales";

/**
 * Route config for locale-prefixed paths (`/en`, `/de`).
 *
 * The default locale is prefixed too (`/en/about`), so every page has exactly
 * one URL per language and `hreflang` needs no special-casing.
 */
export const routing = defineRouting({
  locales: [...LOCALE_CODES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  localeDetection: true,
  localeCookie: { name: "NEXT_LOCALE", maxAge: 60 * 60 * 24 * 365 },
});
