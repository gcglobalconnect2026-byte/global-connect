import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { routing } from "@/i18n/routing";
import { LOCALE_CODES } from "@/lib/locales";

const handleI18nRouting = createMiddleware(routing);

/**
 * Paths that require a session. Everything else is public.
 *
 * This list is intentionally empty: the site has no authenticated-only pages
 * yet, and the previous deny-by-default allowlist had a side effect — an
 * unknown URL (`/de/typo`) bounced to Clerk's sign-in host instead of the
 * localized 404, which reads as a soft error to crawlers and sends typo
 * visitors to an unrelated page.
 *
 * Add a prefix here the moment a private area exists, and keep `auth()`
 * checks inside the page itself as defence in depth. Locale prefixes are
 * stripped before matching, so a rule applies to `/de/...` and `/en/...`
 * alike.
 */
const PROTECTED_PATH_PATTERNS: RegExp[] = [];

/** Clerk's own endpoints and APIs. They must never be locale-routed. */
const INTERNAL_PATHS = ["/api", "/trpc", "/__clerk"];

/** Removes a leading `/{locale}` so routes can be matched locale-agnostically. */
function stripLocale(pathname: string): string {
  for (const code of LOCALE_CODES) {
    if (pathname === `/${code}`) return "/";
    if (pathname.startsWith(`/${code}/`)) {
      return pathname.slice(code.length + 1);
    }
  }
  return pathname;
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

function isInternalPath(pathname: string): boolean {
  return INTERNAL_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const path = stripLocale(request.nextUrl.pathname);

  if (isProtectedPath(path)) {
    await auth.protect();
  }

  if (isInternalPath(path)) {
    return;
  }

  // Locale negotiation, `/x` → `/{locale}/x` redirects and the
  // `NEXT_LOCALE` cookie all live here; it must run for every page.
  return handleI18nRouting(request);
});

export const config = {
  matcher: [
    // Pages — skip static files (any path containing a dot), framework
    // internals and Clerk's own endpoint prefix, so `/robots.txt`,
    // `/sitemap.xml`, `/llms.txt` and `/manifest.json` can never be
    // rewritten to `/{locale}/...`.
    "/((?!api|trpc|_next|_vercel|__clerk|.*\\..*).*)",
    // Clerk still needs to run on APIs and its own endpoints.
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
