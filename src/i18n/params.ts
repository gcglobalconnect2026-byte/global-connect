import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { routing } from "./routing";
import type { Locale } from "@/lib/locales";

/**
 * Validates the `[locale]` route param.
 *
 * The root layout already rejects unknown locales, but the type system does
 * not know that — this narrows `params.locale` from `string` to `Locale` so
 * pages can hand it to typed helpers (queries, metadata, JSON-LD), and 404s
 * as defence in depth if a page is ever reached without the layout.
 *
 * ```ts
 * const { locale, slug } = withLocale(await params);
 * ```
 */
export function withLocale<P extends { locale: string }>(
  params: P,
): P & { locale: Locale } {
  if (!hasLocale(routing.locales, params.locale)) notFound();
  return params as P & { locale: Locale };
}
