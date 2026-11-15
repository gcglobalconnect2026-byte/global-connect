import type { Metadata } from "next";

import { PageBand, PageContainer, PageMain } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageHeader } from "@/components/page-header";
import { PartnersSection } from "@/components/sections/partners-section";
import {
  getHomepageSections,
  getPartners,
  getSiteSettings,
  getStories,
} from "@/lib/contentful/queries";
import { StoriesSection } from "@/components/sections/stories-section";
import { tv } from "@/lib/utils";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Global Connect helps young people discover international opportunities, build confidence and connect worldwide.",
  path: "/about",
});

const aboutPage = tv({
  slots: {
    stats: "grid gap-6 text-center sm:grid-cols-5",
    stat: "flex flex-col items-center gap-1",
    statValue: "font-display text-3xl text-foreground",
    statLabel: "text-sm text-muted-foreground",
    contactTitle: "font-display text-2xl tracking-tight text-foreground",
    contactText: "mt-2 text-muted-foreground",
    contactLink: "text-brand hover:underline",
  },
});

export default async function AboutPage() {
  const [partners, stories, homepageSections, siteSettings] = await Promise.all(
    [getPartners(), getStories(), getHomepageSections(), getSiteSettings()],
  );

  const slots = aboutPage();

  return (
    <>
      <SiteHeader />
      <PageMain>
        <PageBand>
          <PageHeader
            eyebrow="About"
            title="Helping young people discover what's possible."
            description="Global Connect is a global youth community sharing international opportunities, online sessions and practical guides."
          />
        </PageBand>

        <PageContainer id="impact" size="compact">
          <div className={slots.stats()}>
            <Stat value="1,000+" label="Members" />
            <Stat value="500+" label="Opportunities shared" />
            <Stat value="35" label="Online sessions" />
            <Stat value="600" label="Young people mentored" />
            <Stat value="3" label="Partnerships" />
          </div>
        </PageContainer>

        {homepageSections.stories &&
          homepageSections.stories.enabled !== false && (
            <StoriesSection
              stories={stories}
              config={homepageSections.stories}
              communityUrl={siteSettings.communityUrl}
            />
          )}

        {homepageSections.partners &&
          homepageSections.partners.enabled !== false && (
            <div id="partners">
              <PartnersSection
                partners={partners}
                config={homepageSections.partners}
              />
            </div>
          )}

        <PageContainer id="contact" size="tiny" center>
          <h2 className={slots.contactTitle()}>Want to work with us?</h2>
          <p className={slots.contactText()}>
            Share opportunities with our community, run a session, or become a
            partner. Reach out at{" "}
            <a
              href={`mailto:${siteSettings.contactEmail}`}
              className={slots.contactLink()}
            >
              {siteSettings.contactEmail}
            </a>
            .
          </p>
        </PageContainer>
      </PageMain>
      <SiteFooter />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  const slots = aboutPage();
  return (
    <div className={slots.stat()}>
      <span className={slots.statValue()}>{value}</span>
      <span className={slots.statLabel()}>{label}</span>
    </div>
  );
}
