import { getT } from "@/i18n/t";

import { tv } from "@/lib/utils";

import { Link } from "@/i18n/navigation";
import { SectionBand, SectionHeading } from "@/components/sections/section";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Tile } from "@/components/ui/tile";
import type { GuideData, HomepageSectionData } from "@/types/models";

/** Two rows on desktop (lg: 3 columns). */
const GUIDE_COUNT = 6;

const guidesSection = tv({
  slots: {
    grid: "mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3",
    footer: "mt-10 text-center",
    card: "group flex flex-col bg-background p-8 transition-colors hover:bg-card",
    title: "mt-6 font-display text-xl leading-snug text-foreground",
    readTime: "mt-3 text-sm text-muted-foreground",
    cta:
      "mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground",
    ctaArrow: "transition-transform duration-300 group-hover:translate-x-1",
  },
});

export async function GuidesSection({
  guides,
  config,
}: {
  guides: GuideData[];
  config?: HomepageSectionData;
}) {
  const t = await getT("Home.guides");
  const slots = guidesSection();
  return (
    <SectionBand id="guides" className="scroll-mt-20">
      <SectionHeading
        eyebrow={config?.eyebrow}
        eyebrowDot="peach"
        title={config?.title ?? t("defaultTitle")}
        align="left"
      />
      <div className={slots.grid()}>
        {guides.slice(0, GUIDE_COUNT).map((guide, index) => (
          <Link
            key={guide.id}
            href={`/guides/${guide.slug}`}
            className={slots.card()}
          >
            <Tile
              palette="guide"
              toneIndex={index}
              size="xl"
              shape="soft"
              content="numberLg"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </Tile>
            <h3 className={slots.title()}>{guide.title}</h3>
            <p className={slots.readTime()}>
              {t("readTime", { count: guide.readTime })}
            </p>
            <span className={slots.cta()}>
              {t("read")}
              <span className={slots.ctaArrow()} aria-hidden="true">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
      {guides.length > GUIDE_COUNT && (
        <div className={slots.footer()}>
          <ArrowLink href="/guides" variant="accent">
            {t("viewAll")}
          </ArrowLink>
        </div>
      )}
    </SectionBand>
  );
}
