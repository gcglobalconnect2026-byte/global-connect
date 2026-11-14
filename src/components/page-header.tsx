import { tv } from "@/lib/utils";

import { SectionEyebrow, type EyebrowDot } from "@/components/sections/section";

const pageHeader = tv({
  slots: {
    root: "mx-auto flex max-w-2xl flex-col items-center gap-3 py-16 text-center sm:py-24",
    title:
      "mt-3 font-display text-[2.6rem] leading-[1.08] tracking-tight text-foreground text-balance sm:text-5xl",
    description:
      "mt-4 text-base text-muted-foreground text-pretty sm:text-lg",
  },
});

export function PageHeader({
  eyebrow,
  eyebrowDot = "sage",
  title,
  description,
  className,
}: {
  eyebrow?: string;
  eyebrowDot?: EyebrowDot;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) {
  const slots = pageHeader();
  return (
    <div className={slots.root({ class: className })}>
      {eyebrow && <SectionEyebrow dot={eyebrowDot}>{eyebrow}</SectionEyebrow>}
      <h1 className={slots.title()}>{title}</h1>
      {description && (
        <p className={slots.description()}>{description}</p>
      )}
    </div>
  );
}
