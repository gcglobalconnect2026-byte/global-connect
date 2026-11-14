export { cn, cx, tv, type VariantProps } from "tailwind-variants";

import { cn } from "tailwind-variants";

/**
 * Base UI accepts `className` as a function of component state, but recipes only
 * take static classes. Merge both forms: recipe classes first, caller classes
 * last, so caller styles still win.
 */
export function mergeClass(
  classes: string,
  className?: unknown,
): string | ((state: unknown) => string | undefined) {
  if (typeof className === "function") {
    const fn = className as (state: unknown) => string | undefined;
    return (state: unknown) => cn(classes, fn(state));
  }
  return cn(classes, className as string | undefined);
}
