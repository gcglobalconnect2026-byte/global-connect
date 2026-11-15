import Image from "next/image";
import { getT } from "@/i18n/t";

import { tv } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/sections/section";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Tile } from "@/components/ui/tile";
import type { HomepageSectionData, SessionData } from "@/types/models";

const SESSION_COUNT = "35";

const sessionsSection = tv({
  slots: {
    header:
      "flex flex-col gap-8 md:flex-row md:items-end md:justify-between",
    count: "shrink-0 font-display text-5xl text-foreground",
    countLabel:
      "block text-sm font-sans uppercase tracking-[0.18em] text-muted-foreground",
    media:
      "mt-12 overflow-hidden rounded-[2rem] border border-border shadow-[0_30px_70px_-45px_rgba(36,36,64,0.5)]",
    image:
      "h-64 w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.04] sm:h-80",
    grid: "mt-8 grid gap-6 sm:grid-cols-2",
    cta: "mt-10 text-center",
    card: "flex flex-col rounded-3xl border border-border bg-card/80 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(36,36,64,0.4)]",
    cardHead: "flex items-start justify-between gap-4",
    badge: "rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground",
    title: "mt-5 font-display text-xl text-foreground",
    description: "mt-3 flex-1 text-sm leading-relaxed text-muted-foreground",
    cardFoot:
      "mt-6 flex items-center justify-between gap-4 border-t border-border/70 pt-5",
    meta: "min-w-0 truncate text-xs uppercase tracking-[0.16em] text-muted-foreground",
    register:
      "rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted",
  },
});

export async function SessionsSection({
  sessions,
  config,
}: {
  sessions: SessionData[];
  config?: HomepageSectionData;
}) {
  const t = await getT("Home.sessions");
  const slots = sessionsSection();
  return (
    <Section id="sessions" className="scroll-mt-20">
      <div className={slots.header()}>
        <SectionHeading
          eyebrow={config?.eyebrow}
          eyebrowDot="sage"
          title={config?.title ?? t("defaultTitle")}
          description={config?.description}
          align="left"
        />
        <p className={slots.count()}>
          {SESSION_COUNT}{" "}
          <span className={slots.countLabel()}>{t("countLabel")}</span>
        </p>
      </div>

      <div className={slots.media()}>
        {config?.imageUrl && (
          <Image
            src={config.imageUrl}
            alt={config.imageAlt ?? t("imageAlt")}
            width={1024}
            height={768}
            loading="lazy"
            className={slots.image()}
          />
        )}
      </div>

      <div className={slots.grid()}>
        {sessions.slice(0, 2).map((session, index) => (
          <SessionCard key={session.id} session={session} index={index} />
        ))}
      </div>

      <div className={slots.cta()}>
        <ArrowLink href="/sessions" variant="accent">
          {t("viewAll")}
        </ArrowLink>
      </div>
    </Section>
  );
}

async function SessionCard({
  session,
  index,
}: {
  session: SessionData;
  index: number;
}) {
  const t = await getT("Home.sessions");
  const slots = sessionsSection();
  return (
    <article className={slots.card()}>
      <div className={slots.cardHead()}>
        <Tile
          palette="session"
          toneIndex={index}
          size="md"
          shape="rounded"
          content="emoji"
          aria-hidden="true"
        >
          {session.icon}
        </Tile>
        <span className={slots.badge()}>{t("badgeOnline")}</span>
      </div>
      <h3 className={slots.title()}>{session.title}</h3>
      <p className={slots.description()}>{session.description}</p>
      <div className={slots.cardFoot()}>
        <p className={slots.meta()}>
          {session.duration} · {session.difficulty}
        </p>
        {session.registerUrl ? (
          <a
            href={session.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("registerAria")}
            className={slots.register()}
          >
            {t("register")}
          </a>
        ) : (
          <Link
            href={`/sessions/${session.slug}`}
            className={slots.register()}
          >
            {t("register")}
          </Link>
        )}
      </div>
    </article>
  );
}
