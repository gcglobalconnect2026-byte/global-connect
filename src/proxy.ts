import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

/**
 * The only cookie this site ever sets is the one we now delete: earlier
 * builds wrote `NEXT_LOCALE` for a year so locale detection could prefer it
 * over `Accept-Language`. The locale is in the URL instead, so the cookie is
 * dead weight — and "this site sets no cookies" is only true once the copies
 * still sitting on returning visitors' disks are expired. Deleting a cookie
 * is not storing one (§ 25 (2) TDDDG), so doing it here needs no consent.
 */
const LEGACY_LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Locale negotiation: `/{locale}` rewrites, redirects for unprefixed paths,
 * and `Accept-Language` detection for `/`.
 *
 * `localeCookie: false` in `src/i18n/routing.ts` is what keeps this
 * cookie-free; there is no auth layer here and never was one that did
 * anything. If a private area ever appears, add the check inside the page
 * itself (`auth()`) rather than reintroducing a middleware wrapper — a
 * protected route in middleware bounces unknown URLs to a third-party
 * sign-in host, which reads as a soft error to crawlers.
 */
export default function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  if (request.cookies.has(LEGACY_LOCALE_COOKIE)) {
    response.cookies.set(LEGACY_LOCALE_COOKIE, "", { path: "/", maxAge: 0 });
  }

  return response;
}

export const config = {
  matcher: [
    // Pages — skip static files (any path containing a dot), framework
    // internals and API routes, so `/robots.txt`, `/sitemap.xml`, `/llms.txt`
    // and `/manifest.json` can never be rewritten to `/{locale}/...`.
    // `/api` and `/trpc` are listed even though they are not routed today:
    // the negative lookahead is what stops future routes from breaking.
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
