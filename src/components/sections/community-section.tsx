import Image from "next/image";

import { getT } from "@/i18n/t";

import { tv, type VariantProps } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Tile } from "@/components/ui/tile";
import type { CityData, HomepageSectionData } from "@/types/models";

type FeatureKey = "meet" | "discuss" | "speak" | "mentor" | "learn";

const FEATURES: { icon: string; key: FeatureKey }[] = [
  { icon: "🌍", key: "meet" },
  { icon: "💬", key: "discuss" },
  { icon: "🎤", key: "speak" },
  { icon: "🤝", key: "mentor" },
  { icon: "📚", key: "learn" },
];

/** Which city chips sit one step higher. */
const CITY_LIFT = [false, true, false, false, true, false, true, false];

const community = tv({
  slots: {
    root: "px-6 py-24 sm:py-32",
    inner: "mx-auto max-w-7xl",
    grid: "grid items-start gap-16 lg:grid-cols-2",
    features: "mt-10 space-y-3",
    feature: "flex items-center gap-3 text-base text-foreground",
    cta: "mt-10",
    media:
      "relative overflow-hidden rounded-[2rem] border border-border shadow-hero",
    image:
      "h-72 w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.04] sm:h-96",
    cities: "mt-5 grid grid-cols-4 gap-3 sm:gap-4",
    city: "flex flex-col items-center justify-center rounded-2xl border border-border bg-card/70 p-2.5 text-center transition-transform duration-300 hover:-translate-y-1",
    cityName: "mt-2 text-[0.7rem] text-muted-foreground",
  },
  variants: {
    lift: {
      true: { city: "translate-y-3" },
    },
  },
});

type Lift = VariantProps<typeof community>["lift"];

function liftAt(index: number): Lift {
  return CITY_LIFT[index % CITY_LIFT.length] ? true : undefined;
}

export async function CommunitySection({
  config,
  cities,
  communityUrl,
}: {
  config?: HomepageSectionData;
  cities?: CityData[];
  communityUrl: string;
}) {
  const t = await getT("Home.community");
  const slots = community();
  return (
    <section id="community" className={slots.root()}>
      <div className={slots.inner()}>
        <div className={slots.grid()}>
          <div>
            <SectionHeading
              eyebrow={config?.eyebrow}
              eyebrowDot="blush"
              title={config?.title ?? t("defaultTitle")}
              description={config?.description}
              align="left"
            />
            <ul className={slots.features()}>
              {FEATURES.map((f) => (
                <li key={f.key} className={slots.feature()}>
                  <span aria-hidden="true">{f.icon}</span>
                  {t(`features.${f.key}`)}
                </li>
              ))}
            </ul>
            <ArrowLink href={communityUrl} external className={slots.cta()}>
              {t("cta")}
            </ArrowLink>
          </div>

          <div>
            <div className={slots.media()}>
              {config?.imageUrl && (
                <Image
                  src={config.imageUrl}
                  alt={config.imageAlt ?? t("imageAlt")}
                  width={1200}
                  height={912}
                  loading="lazy"
                  className={slots.image()}
                />
              )}
            </div>
            <div className={slots.cities()}>
              {(cities ?? []).map((c, i) => (
                <div
                  key={c.initials}
                  className={slots.city({ lift: liftAt(i) })}
                >
                  <Tile
                    palette="community"
                    toneIndex={i}
                    size="md"
                    shape="circle"
                    content="initials"
                  >
                    {c.initials}
                  </Tile>
                  <span className={slots.cityName()}>{c.city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
