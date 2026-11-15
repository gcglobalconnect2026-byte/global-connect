/**
 * Public site origin used for canonical URLs, Open Graph, sitemap.xml and
 * robots.txt. Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL (explicit, works locally and on any host)
 *   2. VERCEL_PROJECT_PRODUCTION_URL (injected by Vercel, no protocol)
 *   3. http://localhost:3000 (local dev)
 *
 * Empty or whitespace-only values are treated as unset — an env var can be
 * present but blank (e.g. `NEXT_PUBLIC_SITE_URL=` in .env.local, or an empty
 * value in Vercel), and `new URL("")` would throw at build time.
 * Trailing slash is stripped so `${SITE_URL}/about` never doubles up.
 */
function normalize(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed.replace(/\/$/, "") : undefined;
}

const explicit = normalize(process.env.NEXT_PUBLIC_SITE_URL);
const vercelDomain = normalize(process.env.VERCEL_PROJECT_PRODUCTION_URL);

export const SITE_URL =
  explicit ??
  (vercelDomain ? `https://${vercelDomain}` : "http://localhost:3000");
