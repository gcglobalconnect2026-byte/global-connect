/**
 * Public site origin used for canonical URLs, Open Graph, sitemap.xml and
 * robots.txt. Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL (explicit, works locally and on any host)
 *   2. VERCEL_PROJECT_PRODUCTION_URL (injected by Vercel, no protocol)
 *   3. http://localhost:3000 (local dev)
 * Trailing slash is stripped so `${SITE_URL}/about` never doubles up.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
