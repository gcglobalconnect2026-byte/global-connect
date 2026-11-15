import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Deny-by-default: anything not listed here requires a session.
 *
 * Everything a crawler, feed reader or PWA install needs must be listed —
 * `clerkMiddleware` runs before the route handler, so an unlisted public
 * page or metadata file returns a 307 to the Clerk sign-in host instead of
 * its real content. That silently hides `/privacy`, `/terms`,
 * `robots.txt`, `sitemap.xml`, `llms.txt` and `manifest.json` from search.
 */
const isPublicRoute = createRouteMatcher([
  // Content routes
  "/",
  "/opportunities(.*)",
  "/sessions(.*)",
  "/guides(.*)",
  "/about(.*)",
  "/privacy",
  "/terms",
  // Clerk's own hosted flows
  "/sign-in(.*)",
  "/sign-up(.*)",
  // Framework metadata routes
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/manifest.json",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // `.txt` / `.xml` are excluded so robots.txt and sitemap.xml can never be
    // intercepted by auth, whatever the route list above says.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|xml)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
