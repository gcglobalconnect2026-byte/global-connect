import { getT } from "@/i18n/t";

import { tv } from "@/lib/utils";

const statsBand = tv({
  slots: {
    root: "border-y border-border/70 bg-card/40 px-6 py-14",
    grid: "mx-auto grid max-w-7xl grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-5",
    stat: "text-center",
    value: "font-display text-4xl text-foreground sm:text-5xl",
    label: "mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground",
  },
});

type StatLabel =
  | "members"
  | "opportunities"
  | "sessions"
  | "mentored"
  | "partnerships";

const STATS: { value: string; label: StatLabel }[] = [
  { value: "1,000+", label: "members" },
  { value: "500+", label: "opportunities" },
  { value: "35", label: "sessions" },
  { value: "600", label: "mentored" },
  { value: "3", label: "partnerships" },
];

export async function StatsBand() {
  const t = await getT("Home.stats");
  const slots = statsBand();
  return (
    <section className={slots.root()}>
      <div className={slots.grid()}>
        {STATS.map((stat) => (
          <div key={stat.label} className={slots.stat()}>
            <p className={slots.value()}>{stat.value}</p>
            <p className={slots.label()}>{t(stat.label)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
