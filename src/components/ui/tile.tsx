import * as React from "react";

import { cn, tv, type VariantProps } from "@/lib/utils";

/**
 * Colored tile used for flags, step numbers, avatars and initials.
 * Structure lives in `tile`; color comes from the palette tables below so
 * every colour string is defined once, in one place.
 */
const tile = tv({
  base: "flex items-center justify-center",
  variants: {
    size: {
      sm: "h-10 w-10 shrink-0",
      md: "h-11 w-11 shrink-0",
      lg: "h-12 w-12 shrink-0",
      xl: "h-14 w-14 shrink-0",
    },
    shape: {
      rounded: "rounded-xl",
      soft: "rounded-2xl",
      circle: "rounded-full",
    },
    content: {
      none: "",
      emoji: "text-lg",
      numberSm: "font-display text-base text-foreground",
      numberLg: "font-display text-lg text-foreground",
      initials: "font-display text-sm text-foreground",
      avatar: "font-display text-lg font-semibold",
      icon: "text-3xl",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "rounded",
    content: "emoji",
  },
});

type Tone =
  | "lavender"
  | "pastelBlue"
  | "sage"
  | "peach"
  | "blush"
  | "muted";

type Palette = "opportunity" | "session" | "guide" | "hero" | "community" | "story";

/** Colour order per palette — picked by list position (`toneIndex`). */
const PALETTE_ORDER: Record<Palette, Tone[]> = {
  opportunity: ["lavender", "pastelBlue", "sage", "peach", "blush"],
  session: ["lavender", "pastelBlue", "sage", "peach"],
  guide: ["lavender", "pastelBlue", "sage", "peach", "blush", "lavender"],
  hero: ["lavender", "pastelBlue", "sage"],
  community: [
    "lavender",
    "pastelBlue",
    "sage",
    "peach",
    "blush",
    "lavender",
    "pastelBlue",
    "sage",
  ],
  story: ["lavender", "pastelBlue", "sage"],
};

/** Exact colour classes per palette (opacity differs per section). */
const PALETTE_TONES: Record<Palette, Record<Tone, string>> = {
  opportunity: {
    lavender: "bg-lavender/20",
    pastelBlue: "bg-pastel-blue/20",
    sage: "bg-sage/20",
    peach: "bg-peach/25",
    blush: "bg-blush/25",
    muted: "bg-muted/30",
  },
  session: {
    lavender: "bg-lavender/20",
    pastelBlue: "bg-pastel-blue/20",
    sage: "bg-sage/25",
    peach: "bg-peach/25",
    blush: "bg-blush/25",
    muted: "bg-muted/30",
  },
  guide: {
    lavender: "bg-lavender/25",
    pastelBlue: "bg-pastel-blue/25",
    sage: "bg-sage/25",
    peach: "bg-peach/30",
    blush: "bg-blush/30",
    muted: "bg-muted/30",
  },
  hero: {
    lavender: "bg-lavender/20",
    pastelBlue: "bg-pastel-blue/20",
    sage: "bg-sage/20",
    peach: "bg-peach/25",
    blush: "bg-blush/25",
    muted: "bg-muted/30",
  },
  community: {
    lavender: "bg-lavender/30",
    pastelBlue: "bg-pastel-blue/30",
    sage: "bg-sage/30",
    peach: "bg-peach/35",
    blush: "bg-blush/35",
    muted: "bg-muted/30",
  },
  story: {
    lavender: "bg-lavender/25 text-accent-foreground",
    pastelBlue: "bg-pastel-blue/25 text-secondary-foreground",
    sage: "bg-sage/30 text-secondary-foreground",
    peach: "bg-peach/35 text-foreground",
    blush: "bg-blush/35 text-foreground",
    muted: "bg-muted/30",
  },
};

function toneAt(palette: Palette, index = 0): string {
  const order = PALETTE_ORDER[palette];
  const tone = order[index % order.length] ?? order[0];
  return PALETTE_TONES[palette][tone];
}

export type TileProps = React.ComponentProps<"span"> &
  VariantProps<typeof tile> & {
    palette: Palette;
    /** Position in the palette colour order. */
    toneIndex?: number;
  };

export function Tile({
  palette,
  toneIndex = 0,
  size,
  shape,
  content,
  className,
  ...props
}: TileProps) {
  return (
    <span
      className={cn(
        tile({ size, shape, content }),
        toneAt(palette, toneIndex),
        className,
      )}
      {...props}
    />
  );
}
