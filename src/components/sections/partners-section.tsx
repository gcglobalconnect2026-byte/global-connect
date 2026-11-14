import { tv } from "@/lib/utils";

import type { HomepageSectionData, PartnerData } from "@/types/models";

const partners = tv({
  slots: {
    root: "px-6 py-20 sm:py-24",
    inner: "mx-auto max-w-7xl",
    title: "text-center font-display text-2xl text-foreground sm:text-3xl",
    grid: "mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6",
    partner:
      "flex h-16 items-center justify-center rounded-xl border border-border/70 px-4 text-center text-xs uppercase tracking-[0.14em] text-muted-foreground",
    logo: "h-6 w-auto object-contain grayscale",
  },
});

export function PartnersSection({
  partners: items,
  config,
}: {
  partners: PartnerData[];
  config?: HomepageSectionData;
}) {
  const slots = partners();
  return (
    <section id="about" className={slots.root()}>
      <div className={slots.inner()}>
        {config?.title && <p className={slots.title()}>{config.title}</p>}
        <div className={slots.grid()}>
          {items.map((partner) => (
            <div key={partner.id} className={slots.partner()}>
              {partner.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partner.logoUrl}
                  alt={partner.logoAlt ?? partner.name}
                  className={slots.logo()}
                />
              ) : (
                <span>{partner.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
