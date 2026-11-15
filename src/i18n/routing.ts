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
  // Detection runs on `Accept-Language` alone: the cookie is off, so the site
  // sets no cookies at all. The locale is always in the URL, which is what
  // search engines and users actually rely on — the cookie only ever mattered
  // for remembering a choice the URL already carries.
  localeDetection: true,
  localeCookie: false,
});
