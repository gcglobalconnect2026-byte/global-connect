import Link from "next/link";

import { tv } from "@/lib/utils";

import { SectionBand, SectionHeading } from "@/components/sections/section";
import { Tile } from "@/components/ui/tile";
import type { GuideData, HomepageSectionData } from "@/types/models";

const guidesSection = tv({
  slots: {
    grid: "mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3",
    card: "group flex flex-col bg-background p-8 transition-colors hover:bg-card",
    title: "mt-6 font-display text-xl leading-snug text-foreground",
    readTime: "mt-3 text-sm text-muted-foreground",
    cta:
      "mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground",
    ctaArrow: "transition-transform duration-300 group-hover:translate-x-1",
  },
});

export function GuidesSection({
  guides,
  config,
}: {
  guides: GuideData[];
  config?: HomepageSectionData;
}) {
  const slots = guidesSection();
  return (
    <SectionBand id="guides" className="scroll-mt-20">
      <SectionHeading
        eyebrow={config?.eyebrow}
        eyebrowDot="peach"
        title={config?.title ?? "Guides"}
        align="left"
      />
      <div className={slots.grid()}>
        {guides.map((guide, index) => (
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
            <p className={slots.readTime()}>{guide.readTime} min read</p>
            <span className={slots.cta()}>
              Read guide
              <span className={slots.ctaArrow()} aria-hidden="true">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </SectionBand>
  );
}
