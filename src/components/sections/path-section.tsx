import { tv, type VariantProps } from "@/lib/utils";

import { SectionBand, SectionHeading } from "@/components/sections/section";
import type { HomepageSectionData, PathStepData } from "@/types/models";

const pathSection = tv({
  slots: {
    list: "mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8",
    rule: "h-px w-full",
    stepLabel: "mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground",
    stepText: "mt-3 text-base leading-relaxed text-foreground",
  },
  variants: {
    tone: {
      lavender: { rule: "bg-lavender" },
      pastelBlue: { rule: "bg-pastel-blue" },
      sage: { rule: "bg-sage" },
      peach: { rule: "bg-peach" },
      blush: { rule: "bg-blush" },
    },
  },
  defaultVariants: {
    tone: "lavender",
  },
});

type Tone = NonNullable<VariantProps<typeof pathSection>["tone"]>;

const STEP_TONES: Tone[] = ["lavender", "pastelBlue", "sage", "peach", "blush"];

export function PathSection({
  steps,
  config,
}: {
  steps: PathStepData[];
  config?: HomepageSectionData;
}) {
  const slots = pathSection();
  return (
    <SectionBand>
      <SectionHeading
        eyebrow={config?.eyebrow}
        eyebrowDot="pastel-blue"
        title={config?.title ?? "How it works"}
        align="left"
      />
      <ol className={slots.list()}>
        {steps.map((step, index) => {
          const rule = pathSection({
            tone: STEP_TONES[index % STEP_TONES.length],
          });
          return (
            <li key={step.id}>
              <div className={rule.rule()} />
              <p className={slots.stepLabel()}>
                {String(index + 1).padStart(2, "0")} — {step.title}
              </p>
              <p className={slots.stepText()}>{step.description}</p>
            </li>
          );
        })}
      </ol>
    </SectionBand>
  );
}
