"use client";

import { useCallback, useEffect, useState, isValidElement } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { tv } from "@/lib/utils";

const carousel = tv({
  slots: {
    root: "relative",
    controls: "absolute -top-16 right-0 hidden md:flex",
    arrow:
      "flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40",
    arrowNext: "ml-2",
    arrowIcon: "size-5",
    viewport: "overflow-hidden",
    track: "flex gap-6",
    slide: "min-w-0 flex-[0_0_85%] sm:flex-[0_0_46%] lg:flex-[0_0_31.5%]",
    dots: "mt-6 flex justify-center gap-2",
    dot: "rounded-full transition-all",
  },
  variants: {
    active: {
      true: "h-2.5 w-6 bg-foreground",
      false: "h-2.5 w-2.5 bg-border hover:bg-muted-foreground",
    },
  },
});

export function Carousel({
  children,
  ariaLabel,
  className,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
}) {
  const t = useTranslations("A11y");
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const slots = carousel();
  const slides = Array.isArray(children) ? children : [children];

  return (
    <div className={slots.root({ class: className })}>
      <div className={slots.controls()}>
        <button
          type="button"
          aria-label={t("previous")}
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className={slots.arrow()}
        >
          <ChevronLeft className={slots.arrowIcon()} />
        </button>
        <button
          type="button"
          aria-label={t("next")}
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className={slots.arrow({ class: slots.arrowNext() })}
        >
          <ChevronRight className={slots.arrowIcon()} />
        </button>
      </div>

      <div ref={emblaRef} className={slots.viewport()} aria-label={ariaLabel}>
        <div className={slots.track()}>
          {slides.map((child) => (
            <div
              key={isValidElement(child) ? child.key : undefined}
              className={slots.slide()}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {snaps.length > 1 && (
        <div className={slots.dots()}>
          {snaps.map((snap, index) => (
            <button
              key={snap}
              type="button"
              aria-label={t("slideGroup", { index: index + 1 })}
              onClick={() => emblaApi?.scrollTo(index)}
              className={slots.dot({ active: index === selectedIndex })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
