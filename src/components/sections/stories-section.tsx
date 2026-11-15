import { getT } from "@/i18n/t";

import { tv, type VariantProps } from "@/lib/utils";

import { SectionHeading, CardShell } from "@/components/sections/section";
import { Carousel } from "@/components/carousel";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Backdrop } from "@/components/ui/blobs";
import { Tile } from "@/components/ui/tile";
import type { HomepageSectionData, StoryData } from "@/types/models";

const storiesSection = tv({
  slots: {
    root: "relative overflow-hidden bg-background px-6 py-24 sm:py-32",
    inner: "relative mx-auto max-w-6xl",
    quoteMark: "font-display text-6xl leading-none text-lavender/40 select-none",
    quote: "mt-2 flex-1 text-[0.975rem] leading-relaxed text-foreground/85",
    footer: "mt-8 flex items-center gap-4 border-t border-border/70 pt-6",
    identity: "min-w-0",
    name: "font-medium text-foreground",
    metaRow: "mt-0.5 flex items-center gap-1.5",
    dot: "h-1.5 w-1.5 rounded-full",
    role: "text-xs text-muted-foreground",
    cta: "mt-14 text-center",
  },
  variants: {
    dotTone: {
      lavender: { dot: "bg-lavender" },
      pastelBlue: { dot: "bg-pastel-blue" },
      sage: { dot: "bg-sage" },
    },
  },
  defaultVariants: {
    dotTone: "lavender",
  },
});

type DotTone = NonNullable<VariantProps<typeof storiesSection>["dotTone"]>;

const DOT_TONES: DotTone[] = ["lavender", "pastelBlue", "sage"];

export async function StoriesSection({
  stories,
  config,
  communityUrl,
}: {
  stories: StoryData[];
  config?: HomepageSectionData;
  communityUrl: string;
}) {
  const t = await getT("Home.stories");
  const slots = storiesSection();
  return (
    <section className={slots.root()}>
      <Backdrop variant="stories" />

      <div className={slots.inner()}>
        <SectionHeading
          eyebrow={config?.eyebrow}
          eyebrowDot="lavender"
          title={config?.title ?? t("defaultTitle")}
          description={config?.description}
          className="mx-auto max-w-2xl text-center"
        />

        <Carousel ariaLabel={t("carouselAria")} className="mt-16">
          {stories.map((story, index) => (
            <CardShell key={story.id} variant="story">
              <span className={slots.quoteMark()} aria-hidden="true">
                &ldquo;
              </span>
              <p className={slots.quote()}>{story.quote}</p>
              <div className={slots.footer()}>
                <Tile
                  palette="story"
                  toneIndex={index}
                  size="lg"
                  shape="circle"
                  content="avatar"
                >
                  {story.name.charAt(0).toUpperCase()}
                </Tile>
                <div className={slots.identity()}>
                  <p className={slots.name()}>{story.name}</p>
                  <div className={slots.metaRow()}>
                    <span
                      className={storiesSection({
                        dotTone: DOT_TONES[index % DOT_TONES.length],
                      }).dot()}
                    />
                    <span className={slots.role()}>
                      {story.role}
                      {story.location ? ` · ${story.location}` : ""}
                    </span>
                  </div>
                </div>
              </div>
            </CardShell>
          ))}
        </Carousel>

        <div className={slots.cta()}>
          <ArrowLink href={communityUrl} external variant="accent">
            {t("cta")}
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
