import { tv } from "@/lib/utils";

import { SectionBand, SectionHeading } from "@/components/sections/section";
import { ArrowLink } from "@/components/ui/arrow-link";
import type { HomepageSectionData, InterestData } from "@/types/models";

const discovery = tv({
  slots: {
    chips: "mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5",
    chip: "inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition-colors hover:border-foreground/30 hover:bg-muted",
    cta: "mt-10 text-center",
  },
});

export function DiscoverySection({
  interests,
  config,
}: {
  interests: InterestData[];
  config?: HomepageSectionData;
}) {
  const slots = discovery();
  return (
    <SectionBand id="discovery">
      <SectionHeading
        eyebrow={config?.eyebrow}
        eyebrowDot="peach"
        title={config?.title ?? "Discover"}
        description={config?.description}
      />
      <div className={slots.chips()}>
        {interests.map((interest) => (
          <span key={interest.id} className={slots.chip()}>
            <span>{interest.emoji}</span>
            {interest.label}
          </span>
        ))}
      </div>
      <div className={slots.cta()}>
        <ArrowLink href="/opportunities" variant="underline">
          Find opportunities for me
        </ArrowLink>
      </div>
    </SectionBand>
  );
}
