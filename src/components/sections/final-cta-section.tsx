import Link from "next/link";

import { tv } from "@/lib/utils";

import { Backdrop } from "@/components/ui/blobs";
import { Button } from "@/components/ui/button";
import type { HomepageSectionData } from "@/types/models";

const finalCta = tv({
  slots: {
    root: "relative overflow-hidden px-6 py-20 sm:py-28",
    inner: "relative mx-auto max-w-3xl text-center",
    title: "font-display text-4xl leading-[1.08] text-foreground sm:text-6xl",
    description:
      "mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg",
    actions: "mt-10 flex flex-col justify-center gap-3 sm:flex-row",
  },
});

export function FinalCtaSection({
  config,
  communityUrl,
}: {
  config?: HomepageSectionData;
  communityUrl: string;
}) {
  const slots = finalCta();
  return (
    <section id="join" className={slots.root()}>
      <Backdrop variant="join" />

      <div className={slots.inner()}>
        {config?.title && <h2 className={slots.title()}>{config.title}</h2>}
        {config?.description && (
          <p className={slots.description()}>{config.description}</p>
        )}
        <div className={slots.actions()}>
          <Button
            className="w-full sm:w-auto"
            size="lg"
            variant="default"
            render={<Link href="/opportunities" />}
          >
            Explore opportunities
          </Button>
          <Button
            className="w-full sm:w-auto"
            size="lg"
            variant="outline"
            render={
              <a
                href={communityUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join Global Connect"
              />
            }
          >
            Join Global Connect
          </Button>
        </div>
      </div>
    </section>
  );
}
