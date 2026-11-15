import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    cms: {
      stale: 24 * 60 * 60, // serve stale while revalidating for up to 24h
      revalidate: 15 * 60, // check Contentful for new content every 15 min
      expire: 30 * 24 * 60 * 60, // drop old cached content after 30 days
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
  async redirects() {
    return [
      // Pre-localization URLs are English and stay English: send them to
      // `/en/...` permanently (308) so ranking signals survive the move.
      // `/` is deliberately absent — next-intl negotiates the locale there
      // from the cookie / Accept-Language header.
      { source: "/about", destination: "/en/about", permanent: true },
      {
        source: "/guides/:slug*",
        destination: "/en/guides/:slug*",
        permanent: true,
      },
      {
        source: "/opportunities/:slug*",
        destination: "/en/opportunities/:slug*",
        permanent: true,
      },
      {
        source: "/sessions/:slug*",
        destination: "/en/sessions/:slug*",
        permanent: true,
      },
      { source: "/privacy", destination: "/en/privacy", permanent: true },
      { source: "/impressum", destination: "/en/impressum", permanent: true },
      { source: "/terms", destination: "/en/terms", permanent: true },
    ];
  },
};

// Resolves `./src/i18n/request.ts` automatically.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
