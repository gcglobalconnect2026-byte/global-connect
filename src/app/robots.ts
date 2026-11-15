import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Auth surfaces and API routes carry no indexable content; Clerk's
      // own route prefix should never be crawled either.
      disallow: ["/api/", "/sign-in", "/sign-up", "/__clerk/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
