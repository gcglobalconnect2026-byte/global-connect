import type { OpportunityData } from "@/types/models";

import { useTranslations } from "next-intl";

import { tv } from "@/lib/utils";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Tile } from "@/components/ui/tile";

const opportunityCard = tv({
  slots: {
    root: "flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/80 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(36,36,64,0.4)]",
    head: "flex items-center gap-3",
    country: "text-xs uppercase tracking-[0.16em] text-muted-foreground",
    title: "mt-5 font-display text-xl leading-snug text-foreground",
    description: "mt-4 flex-1 text-sm leading-relaxed text-muted-foreground",
    details: "mt-6 space-y-1.5 border-t border-border/70 pt-5",
    detail: "flex items-baseline justify-between gap-3",
    detailLabel: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
    detailValue: "text-sm font-medium text-foreground",
    tags: "mt-5 flex flex-wrap gap-2",
    tag: "rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground",
  },
});

export function OpportunityCard({
  opportunity,
  index = 0,
}: {
  opportunity: OpportunityData;
  index?: number;
}) {
  const t = useTranslations("Opportunities");
  const slots = opportunityCard();
  return (
    <article className={slots.root()}>
      <div className={slots.head()}>
        <Tile
          palette="opportunity"
          toneIndex={index}
          size="sm"
          shape="rounded"
          content="emoji"
          aria-hidden="true"
        >
          {opportunity.countryFlag}
        </Tile>
        <p className={slots.country()}>{opportunity.country}</p>
      </div>
      <h3 className={slots.title()}>{opportunity.title}</h3>

      <p className={slots.description()}>{opportunity.description}</p>

      <dl className={slots.details()}>
        <Detail label={t("detailAge")} value={opportunity.ageRange} />
        <Detail label={t("detailFunding")} value={opportunity.funding} />
        <Detail label={t("detailDeadline")} value={opportunity.deadline} />
      </dl>

      <div className={slots.tags()}>
        {opportunity.tags.map((tag) => (
          <span key={tag} className={slots.tag()}>
            {tag}
          </span>
        ))}
      </div>
      <ArrowLink
        href={`/opportunities/${opportunity.slug}`}
        size="sm"
        className="mt-6"
      >
        {t("view")}
      </ArrowLink>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  const slots = opportunityCard();
  return (
    <div className={slots.detail()}>
      <dt className={slots.detailLabel()}>{label}</dt>
      <dd className={slots.detailValue()}>{value}</dd>
    </div>
  );
}
