import Image from "next/image";
import Link from "next/link";

import { tv, type VariantProps } from "@/lib/utils";
import { SectionEyebrow } from "@/components/sections/section";
import { Backdrop } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
import { Tile } from "@/components/ui/tile";
import type { HomepageSectionData, OpportunityData } from "@/types/models";

const hero = tv({
  slots: {
    root: "relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24",
    grid: "relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_1fr]",
    title:
      "mt-7 font-display text-[2.6rem] leading-[1.05] tracking-tight text-foreground sm:text-6xl text-balance",
    highlight: "relative inline-block break-words",
    highlightMark: "absolute inset-x-0 bottom-1 -z-10 h-3 rounded-full bg-peach/40",
    description:
      "mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg",
    actions: "mt-9 flex flex-col gap-3 sm:flex-row",
    meta: "mt-8 text-sm text-muted-foreground",
    media: "relative",
    mediaDrift: "blob drift pointer-events-none absolute inset-8 bg-lavender/15",
    frame:
      "relative overflow-hidden rounded-[2rem] border border-border shadow-[0_30px_70px_-40px_rgba(36,36,64,0.55)]",
    image: "h-[26rem] w-full object-cover sm:h-[34rem]",
    imageOverlay:
      "pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent",
    chips: "relative z-10 -mt-16 space-y-3 px-2 sm:-mt-20 sm:px-6",
    chip: "float-soft flex items-center gap-4 rounded-2xl border border-border bg-card/90 p-4 shadow-[0_14px_36px_-20px_rgba(36,36,64,0.45)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1",
    chipTitle: "truncate text-sm font-medium text-foreground",
    chipMeta: "truncate text-xs text-muted-foreground",
    chipBody: "min-w-0",
  },
  variants: {
    offset: {
      none: { chip: "" },
      right: { chip: "sm:translate-x-10" },
      left: { chip: "sm:-translate-x-4" },
    },
  },
  defaultVariants: {
    offset: "none",
  },
});

type Offset = NonNullable<VariantProps<typeof hero>["offset"]>;

const CHIP_OFFSETS: Offset[] = ["none", "right", "left"];

export function HeroSection({
  featured,
  config,
  communityUrl,
}: {
  featured: OpportunityData[];
  config?: HomepageSectionData;
  communityUrl: string;
}) {
  const chips = featured.slice(0, 3);
  const titleWords = config?.title?.trim().split(/\s+/);
  const titleHighlight = titleWords?.slice(-2).join(" ");
  const titleRest = titleWords?.slice(0, -2).join(" ");

  const slots = hero();

  return (
    <section id="top" className={slots.root()}>
      <Backdrop variant="hero" />

      <div className={slots.grid()}>
        <div>
          {config?.eyebrow && (
            <SectionEyebrow dot="sage">{config.eyebrow}</SectionEyebrow>
          )}

          {titleRest && titleHighlight && (
            <h1 className={slots.title()}>
              {titleRest}{" "}
              <span className={slots.highlight()}>
                {titleHighlight}
                <span
                  className={slots.highlightMark()}
                  aria-hidden="true"
                />
              </span>
            </h1>
          )}

          {config?.description && (
            <p className={slots.description()}>{config.description}</p>
          )}

          <div className={slots.actions()}>
            <Button
              className="w-full sm:w-auto"
              render={<Link href="/opportunities" />}
            >
              Explore opportunities <span aria-hidden="true">&rarr;</span>
            </Button>
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              render={
                <a
                  href={communityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join Global Connect"
                />
              }
            >
              Join Global Connect
            </Button>
          </div>

          <p className={slots.meta()}>
            1,000+ members &middot; 500+ opportunities shared &middot; 35 online
            sessions
          </p>
        </div>

        <div className={slots.media()}>
          <div className={slots.mediaDrift()} aria-hidden="true" />
          <div className={slots.frame()}>
            {config?.imageUrl && (
              <Image
                src={config.imageUrl}
                alt={
                  config.imageAlt ??
                  "Young people from different countries laughing together on a campus"
                }
                width={1024}
                height={1280}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={slots.image()}
              />
            )}
            <div className={slots.imageOverlay()} aria-hidden="true" />
          </div>

          <div className={slots.chips()}>
            {chips.map((o, index) => {
              const chip = hero({
                offset: CHIP_OFFSETS[index % CHIP_OFFSETS.length],
              });
              return (
                <div
                  key={o.id}
                  className={chip.chip()}
                  style={{ animationDelay: `${index * 900}ms` }}
                >
                  <Tile
                    palette="hero"
                    toneIndex={index}
                    size="md"
                    shape="rounded"
                    content="emoji"
                    aria-hidden="true"
                  >
                    {o.countryFlag}
                  </Tile>
                  <div className={slots.chipBody()}>
                    <p className={slots.chipTitle()}>{o.title}</p>
                    <p className={slots.chipMeta()}>
                      {o.country} &middot; {o.funding}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
