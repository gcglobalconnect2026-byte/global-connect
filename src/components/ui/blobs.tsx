import { tv, type VariantProps } from "@/lib/utils";

/**
 * Decorative blurred blobs behind a section. Each `variant` is one complete
 * arrangement (positions + colours) so no blob classes leak into JSX.
 */
const backdrop = tv({
  slots: {
    root: "pointer-events-none absolute inset-0",
    blob: "blob absolute blur-3xl",
    blob1: "",
    blob2: "",
    blob3: "",
    blob4: "",
  },
  variants: {
    variant: {
      hero: {
        blob1: "-left-32 top-0 h-96 w-96 bg-lavender/20",
        blob2: "-right-24 top-24 h-[26rem] w-[26rem] bg-pastel-blue/20",
        blob3: "bottom-[-6rem] left-1/3 h-80 w-80 bg-sage/15",
      },
      stories: {
        root: "overflow-hidden",
        blob1: "-left-24 top-10 h-72 w-72 bg-lavender/20",
        blob2: "right-[-6rem] top-1/3 h-80 w-80 bg-pastel-blue/20",
        blob3: "bottom-0 left-1/3 h-72 w-72 bg-sage/20",
        blob4: "right-1/4 top-10 h-40 w-40 bg-peach/25 blur-2xl",
      },
      join: {
        root: "overflow-hidden",
        blob1: "left-[-8rem] top-0 h-96 w-96 bg-lavender/25",
        blob2: "right-[-6rem] top-1/4 h-80 w-80 bg-pastel-blue/25",
        blob3: "bottom-[-4rem] left-1/2 h-80 w-80 -translate-x-1/2 bg-sage/20",
      },
    },
  },
  defaultVariants: {
    variant: "hero",
  },
});

export type BackdropProps = {
  variant: VariantProps<typeof backdrop>["variant"];
  className?: string;
};

export function Backdrop({ variant, className }: BackdropProps) {
  const slots = backdrop({ variant });
  const fourth = slots.blob4();

  return (
    <div className={slots.root({ class: className })} aria-hidden="true">
      <div className={slots.blob({ class: slots.blob1() })} />
      <div className={slots.blob({ class: slots.blob2() })} />
      <div className={slots.blob({ class: slots.blob3() })} />
      {fourth && <div className={slots.blob({ class: fourth })} />}
    </div>
  );
}
