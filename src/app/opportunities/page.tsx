import type { Metadata } from "next";

import { PageMain } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { OpportunityFinder } from "@/components/sections/opportunity-finder";
import { pageMetadata } from "@/lib/seo";
import { breadcrumb, opportunityItemList } from "@/lib/schema";
import {
  getHomepageSections,
  getOpportunities,
} from "@/lib/contentful/queries";

export const metadata: Metadata = pageMetadata({
  title: "Opportunities",
  description:
    "Browse exchanges, scholarships, conferences and volunteering opportunities for young people worldwide.",
  path: "/opportunities",
});

export default async function OpportunitiesPage() {
  const [opportunities, homepageSections] = await Promise.all([
    getOpportunities(),
    getHomepageSections(),
  ]);

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Opportunities", path: "/opportunities" },
        ])}
      />
      <JsonLd data={opportunityItemList(opportunities)} />
      <PageMain>
        <OpportunityFinder
          opportunities={opportunities}
          config={homepageSections.opportunityFinder}
          headingAs="h1"
        />
      </PageMain>
      <SiteFooter />
    </>
  );
}
