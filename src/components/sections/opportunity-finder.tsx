"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { tv } from "@/lib/utils";
import { OpportunityCard } from "@/components/opportunity-card";
import { Section, SectionHeading } from "@/components/sections/section";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HomepageSectionData, OpportunityData } from "@/types/models";

const opportunityFinder = tv({
  slots: {
    searchPanel: "mx-auto mb-10 mt-12 max-w-3xl",
    searchBar:
      "flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 shadow-pill",
    searchIcon: "text-lg leading-none",
    searchInput:
      "h-auto w-full border-0 bg-transparent p-0 rounded-none text-base md:text-[16px] text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0",
    filters: "-mx-6 mt-4 overflow-x-auto px-6 pb-1",
    filterRow: "flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-center",
    filterTrigger:
      "h-auto w-fit shrink-0 gap-1 rounded-full border border-border bg-card/60 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground",
    filterContent: "min-w-48",
    clearFilters: "shrink-0 rounded-full px-4 py-2 text-sm",
    clearIcon: "size-3.5",
    grid: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
    cta: "mt-10 text-center",
    empty:
      "mx-auto max-w-md rounded-3xl border border-border bg-card/80 p-10 text-center",
    emptyTitle: "font-display text-xl",
    emptyText: "mt-1 text-sm text-muted-foreground",
    emptyAction: "mt-4",
  },
});

export function OpportunityFinder({
  opportunities,
  limit,
  config,
  headingAs = "h2",
}: {
  opportunities: OpportunityData[];
  limit?: number;
  config?: HomepageSectionData;
  /** Set to `"h1"` when this component is the page's primary heading. */
  headingAs?: "h1" | "h2";
}) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [type, setType] = useState("all");
  const [funding, setFunding] = useState("all");
  const [age, setAge] = useState("all");
  const [deadline, setDeadline] = useState("all");

  const t = useTranslations("Home.finder");

  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const countries = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.country))).sort(),
    [opportunities],
  );
  const types = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.type))).sort(),
    [opportunities],
  );
  const fundings = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.funding))).sort(),
    [opportunities],
  );
  const ages = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.ageRange))).sort(),
    [opportunities],
  );
  const deadlines = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.deadline))).sort(),
    [opportunities],
  );

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      if (deferredSearch) {
        const haystack =
          `${o.title} ${o.description} ${o.country} ${o.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(deferredSearch)) return false;
      }
      if (country !== "all" && o.country !== country) return false;
      if (type !== "all" && o.type !== type) return false;
      if (funding !== "all" && o.funding !== funding) return false;
      if (age !== "all" && o.ageRange !== age) return false;
      if (deadline !== "all" && o.deadline !== deadline) return false;
      return true;
    });
  }, [opportunities, deferredSearch, country, type, funding, age, deadline]);

  const hasActiveFilters =
    deferredSearch ||
    country !== "all" ||
    type !== "all" ||
    funding !== "all" ||
    age !== "all" ||
    deadline !== "all";

  function resetFilters() {
    setSearch("");
    setCountry("all");
    setType("all");
    setFunding("all");
    setAge("all");
    setDeadline("all");
  }

  const slots = opportunityFinder();

  return (
    <Section id="opportunities" className="scroll-mt-20">
      <SectionHeading
        eyebrow={config?.eyebrow}
        eyebrowDot="lavender"
        title={config?.title ?? t("defaultTitle")}
        description={config?.description}
        as={headingAs}
      />

      <div className={slots.searchPanel()}>
        <div className={slots.searchBar()}>
          <span aria-hidden="true" className={slots.searchIcon()}>
            🔎
          </span>
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t("searchAria")}
            className={slots.searchInput()}
          />
        </div>
        <div className={slots.filters()}>
          <div className={slots.filterRow()}>
            <FilterSelect
              label={t("filterCountry")}
              value={country}
              onChange={setCountry}
              options={countries}
            />
            <FilterSelect
              label={t("filterType")}
              value={type}
              onChange={setType}
              options={types}
            />
            <FilterSelect
              label={t("filterAge")}
              value={age}
              onChange={setAge}
              options={ages}
            />
            <FilterSelect
              label={t("filterFunding")}
              value={funding}
              onChange={setFunding}
              options={fundings}
            />
            <FilterSelect
              label={t("filterDeadline")}
              value={deadline}
              onChange={setDeadline}
              options={deadlines}
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                className={slots.clearFilters()}
                onClick={resetFilters}
              >
                <RotateCcw className={slots.clearIcon()} />
                {t("clear")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <div className={slots.grid()}>
            {(limit ? filtered.slice(0, limit) : filtered).map(
              (opportunity, index) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  index={index}
                />
              ),
            )}
          </div>
          {limit && filtered.length > limit && (
            <div className={slots.cta()}>
              <ArrowLink href="/opportunities" variant="accent">
                {t("viewAll")}
              </ArrowLink>
            </div>
          )}
        </>
      ) : (
        <div className={slots.empty()}>
          <p className={slots.emptyTitle()}>{t("emptyTitle")}</p>
          <p className={slots.emptyText()}>{t("emptyText")}</p>
          <Button
            className={slots.emptyAction()}
            variant="outline"
            onClick={resetFilters}
          >
            {t("emptyAction")}
          </Button>
        </div>
      )}
    </Section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const slots = opportunityFinder();
  const isActive = value !== "all";

  return (
    <Select
      key={value}
      value={isActive ? value : undefined}
      onValueChange={(next) => onChange(next ?? "all")}
    >
      <SelectTrigger aria-label={label} className={slots.filterTrigger()}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className={slots.filterContent()}>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
