import { ArrowRight } from "lucide-react";

import { tv, type VariantProps } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

const arrowLink = tv({
  slots: {
    root: "group inline-flex items-center gap-2 text-base font-medium text-foreground transition-colors",
    glyph: "inline-block transition-transform duration-300 group-hover:translate-x-1",
    icon: "size-4 transition-transform duration-300 group-hover:translate-x-0.5",
  },
  variants: {
    variant: {
      default: { root: "" },
      accent: { root: "hover:text-accent-foreground" },
      underline: {
        root: "font-semibold underline decoration-border underline-offset-8 hover:text-accent-foreground",
      },
    },
    size: {
      md: { root: "" },
      sm: { root: "text-sm" },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export type ArrowLinkProps = {
  href: string;
  external?: boolean;
  /** `glyph` = → text arrow, `icon` = lucide ArrowRight. */
  arrow?: "glyph" | "icon";
  className?: string;
  children: React.ReactNode;
} & VariantProps<typeof arrowLink> &
  Omit<React.ComponentProps<"a">, "children" | "className">;

export function ArrowLink({
  href,
  external = false,
  arrow = "glyph",
  variant,
  size,
  className,
  children,
  ...props
}: ArrowLinkProps) {
  const slots = arrowLink({ variant, size });

  const content = (
    <>
      {children}
      {arrow === "icon" ? (
        <ArrowRight className={slots.icon()} aria-hidden="true" />
      ) : (
        <span className={slots.glyph()} aria-hidden="true">
          →
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={slots.root({ class: className })}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={slots.root({ class: className })} {...props}>
      {content}
    </Link>
  );
}
