import { locale as rootLocale } from "next/root-params";
import { getTranslations } from "next-intl/server";

/**
 * `getTranslations` bound to the current `[locale]` route param.
 *
 * next-intl otherwise resolves the locale from the request headers, and
 * `headers()` is runtime data — under `cacheComponents` that would block
 * prerendering of every static page. The root parameter is known at build
 * time (it comes from `generateStaticParams`) and is safe to read here, in
 * cached functions too.
 *
 * ```ts
 * const t = await getT("Home.hero");
 * ```
 */
export async function getT(namespace: string) {
  const locale = await rootLocale();
  return getTranslations({ locale, namespace });
}
