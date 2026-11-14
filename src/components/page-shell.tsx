import * as React from "react";

import { tv, type VariantProps } from "@/lib/utils";

/**
 * Shared route chrome: `<main>`, the banded page header and the page
 * container, so every route frames its content the same way.
 */
const pageShell = tv({
  slots: {
    main: "flex-1",
    band: "border-b border-border/70 bg-card/40",
    container: "mx-auto px-4 sm:px-6",
    article: "mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16",
  },
  variants: {
    size: {
      narrow: { container: "max-w-2xl" },
      tiny: { container: "max-w-xl" },
      compact: { container: "max-w-3xl" },
      medium: { container: "max-w-5xl" },
      wide: { container: "max-w-7xl lg:px-8" },
    },
    spacing: {
      none: { container: "" },
      page: { container: "py-12" },
      bottom: { container: "pb-16" },
    },
    center: {
      true: { container: "text-center" },
    },
  },
  defaultVariants: {
    size: "wide",
    spacing: "page",
  },
});

type Slot = React.ComponentProps<"div"> &
  VariantProps<typeof pageShell> & { className?: string };

export function PageMain({
  className,
  children,
  ...props
}: React.ComponentProps<"main">) {
  const slots = pageShell();
  return (
    <main className={slots.main({ class: className })} {...props}>
      {children}
    </main>
  );
}

export function PageBand({ className, children, ...props }: Slot) {
  const slots = pageShell();
  return (
    <div className={slots.band({ class: className })} {...props}>
      {children}
    </div>
  );
}

export function PageContainer({
  size,
  spacing,
  center,
  className,
  children,
  ...props
}: Slot) {
  const slots = pageShell({ size, spacing, center });
  return (
    <div className={slots.container({ class: className })} {...props}>
      {children}
    </div>
  );
}

export function PageArticle({
  className,
  children,
  ...props
}: React.ComponentProps<"article">) {
  const slots = pageShell();
  return (
    <article className={slots.article({ class: className })} {...props}>
      {children}
    </article>
  );
}
