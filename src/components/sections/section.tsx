import { tv, type VariantProps } from "@/lib/utils";

export type EyebrowDot = NonNullable<VariantProps<typeof section>["dot"]>;

const section = tv({
  slots: {
    root: "px-6 py-24 sm:py-32",
    container: "mx-auto max-w-7xl",
    eyebrow:
      "inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground glow-soft",
    eyebrowDot: "h-1.5 w-1.5 rounded-full pulse-soft",
    heading: "max-w-2xl",
    title:
      "mt-6 font-display text-3xl leading-[1.1] text-foreground sm:text-4xl md:text-[2.75rem]",
    description:
      "mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg",
    card: "flex flex-col rounded-3xl border border-border bg-card/80 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
  },
  variants: {
    band: {
      true: { root: "border-y border-border/70 bg-card/40" },
    },
    align: {
      center: { heading: "mx-auto text-center" },
      left: { heading: "" },
    },
    dot: {
      sage: { eyebrowDot: "bg-sage" },
      lavender: { eyebrowDot: "bg-lavender" },
      "pastel-blue": { eyebrowDot: "bg-pastel-blue" },
      peach: { eyebrowDot: "bg-peach" },
      blush: { eyebrowDot: "bg-blush" },
    },
    variant: {
      default: { card: "" },
      story: {
        card: "group relative p-8 shadow-card backdrop-blur-sm hover:shadow-card-lift",
      },
    },
  },
  defaultVariants: {
    align: "center",
    dot: "sage",
    variant: "default",
  },
});

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const slots = section();
  return (
    <section id={id} className={slots.root({ class: className })}>
      <div className={slots.container()}>{children}</div>
    </section>
  );
}

export function SectionBand({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const slots = section({ band: true });
  return (
    <section id={id} className={slots.root({ class: className })}>
      <div className={slots.container()}>{children}</div>
    </section>
  );
}

export function SectionEyebrow({
  dot = "sage",
  children,
  className,
}: {
  dot?: EyebrowDot;
  children: React.ReactNode;
  className?: string;
}) {
  const slots = section({ dot });
  return (
    <span className={slots.eyebrow({ class: className })}>
      <span className={slots.eyebrowDot()} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  eyebrowDot,
  title,
  description,
  align = "center",
  as = "h2",
  className,
}: {
  eyebrow?: string;
  eyebrowDot?: EyebrowDot;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  /**
   * Heading level. Keep the default `h2` — `h1` is reserved for the page's
   * primary heading, which is usually a `PageHeader` band.
   */
  as?: "h1" | "h2";
  className?: string;
}) {
  const slots = section({ align, dot: eyebrowDot });
  const Heading = as;
  return (
    <div className={slots.heading({ class: className })}>
      {eyebrow && <SectionEyebrow dot={eyebrowDot}>{eyebrow}</SectionEyebrow>}
      <Heading className={slots.title()}>{title}</Heading>
      {description && <p className={slots.description()}>{description}</p>}
    </div>
  );
}

export function CardShell({
  className,
  variant = "default",
  children,
}: {
  className?: string;
  variant?: "default" | "story";
  children: React.ReactNode;
}) {
  const slots = section({ variant });
  return <div className={slots.card({ class: className })}>{children}</div>;
}
