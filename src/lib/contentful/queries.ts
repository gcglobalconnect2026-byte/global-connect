import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Document as RichTextDocument } from "@contentful/rich-text-types";
import { getContentfulClient } from "./client";
import {
  CF_DEFAULT_LOCALE,
  CF_LOCALES,
  toContentfulLocale,
  type CfLocale,
} from "./locales";
import type {
  City,
  CitySkeleton,
  Guide,
  GuideSkeleton,
  HomepageSection,
  HomepageSectionSkeleton,
  Interest,
  InterestSkeleton,
  Opportunity,
  OpportunitySkeleton,
  Partner,
  PartnerSkeleton,
  PathStep,
  PathStepSkeleton,
  Session,
  SessionSkeleton,
  SiteSettingsSkeleton,
  Story,
  StorySkeleton,
} from "@/types/contentful";
import type {
  CityData,
  GuideData,
  HomepageSectionData,
  HomepageSectionKey,
  InterestData,
  OpportunityData,
  PartnerData,
  PathStepData,
  SessionData,
  SiteSettingsData,
  StoryData,
} from "@/types/models";
import { LOCALE_CODES, type Locale } from "@/lib/locales";
import { FALLBACK_COMMUNITY_URL, FALLBACK_CONTACT_EMAIL } from "@/lib/community";

/**
 * Contentful is fetched once per content type with `locale=*`
 * (`client.withAllLocales`), so every locale is served from a single request
 * and translation coverage is visible in the same payload. The cached layer
 * is the raw fetch; resolving a locale is pure in-memory work done by the
 * uncached wrapper below.
 *
 * Locale resolution rules:
 *  - a field missing in the requested locale falls back to `en-US`, so a
 *    partially translated entry renders complete instead of with holes;
 *  - `translatedLocales` reports where the *primary* fields really exist
 *    (no fallback), and that is what `hreflang`/the sitemap advertise.
 */

/**
 * A field as `locale=*` returns it: locale-keyed, or plain when the field is
 * not localized. Readers therefore take `unknown` and narrow here.
 */
function isLocaleKeyed(
  value: unknown,
): value is Partial<Record<CfLocale, unknown>> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  return CF_LOCALES.some((code) => code in (value as object));
}

/** Resolves a field for `locale`, falling back to the default locale. */
function pick<T>(value: unknown, locale: Locale): T | undefined {
  if (value === undefined || value === null) return undefined;
  if (isLocaleKeyed(value)) {
    const keyed = value as Partial<Record<CfLocale, T>>;
    return keyed[toContentfulLocale(locale)] ?? keyed[CF_DEFAULT_LOCALE];
  }
  return value as T;
}

/** Same as `pick`, but for fields the content model marks as required. */
function pickRequired<T>(value: unknown, locale: Locale): T {
  return pick<T>(value, locale) as T;
}

/**
 * Locales where every `primary` field has its own value (no fallback) —
 * the fields that decide whether a page reads as translated: the metadata
 * title/description and the lead text above the fold.
 */
function translatedLocales(
  fields: Record<string, unknown>,
  primary: readonly string[],
): Locale[] {
  return LOCALE_CODES.filter((siteLocale) => {
    const cf = toContentfulLocale(siteLocale);
    return primary.every((key) => {
      const value = fields[key];
      if (!isLocaleKeyed(value)) return true; // not localized → same everywhere
      const keyed = value as Partial<Record<CfLocale, unknown>>;
      const fallback = keyed[CF_DEFAULT_LOCALE];
      // The field is not used in the default locale either — nothing to
      // compare against, so it cannot signal a missing translation.
      if (fallback === undefined || fallback === null || fallback === "") {
        return true;
      }
      const own = keyed[cf];
      return own !== undefined && own !== null && own !== "";
    });
  });
}

type AssetFile = {
  url?: string;
  details?: { image?: { width?: number; height?: number } };
};

type AssetLike = { fields?: Record<string, unknown> };

/**
 * Unwraps an asset link down to the asset object.
 *
 * With `locale=*` Contentful wraps **every** entry field — including
 * non-localized asset links — in a locale key (`{"en-US": {asset}}`), so the
 * link itself must go through `pick()` before `.fields` is reachable.
 * Single-locale responses and inline seed data resolve the asset directly;
 * `pick()` returns those unchanged.
 */
function resolveAsset(target: unknown): AssetLike | undefined {
  const asset = pick<AssetLike>(target, "en");
  if (!asset || typeof asset !== "object" || !("fields" in asset)) {
    return undefined; // unresolved link or missing field
  }
  return asset;
}

function assetUrl(target: unknown, locale: Locale): string | undefined {
  const asset = resolveAsset(target);
  if (!asset) return undefined;
  const file = pick<AssetFile>(asset.fields?.file, locale);
  const url = file?.url;
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

function assetAlt(target: unknown, locale: Locale): string | undefined {
  const asset = resolveAsset(target);
  if (!asset) return undefined;
  return (
    pick<string>(asset.fields?.description, locale) ??
    pick<string>(asset.fields?.title, locale) ??
    undefined
  );
}

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return items
    .filter((item) => Number.isFinite(item.order))
    .sort((a, b) => a.order - b.order);
}

// ---------------------------------------------------------------------------
// Raw fetches — cached, locale-independent (one request serves every locale)
// ---------------------------------------------------------------------------

async function fetchOpportunities(): Promise<Opportunity[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  const client = getContentfulClient();
  const r = await client.withAllLocales.getEntries<OpportunitySkeleton, CfLocale>({
    content_type: "opportunity",
    limit: 100,
    include: 10,
  });
  return r.items;
}

async function fetchSessions(): Promise<Session[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  const client = getContentfulClient();
  const r = await client.withAllLocales.getEntries<SessionSkeleton, CfLocale>({
    content_type: "session",
    limit: 100,
  });
  return r.items;
}

async function fetchGuides(): Promise<Guide[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  const client = getContentfulClient();
  const r = await client.withAllLocales.getEntries<GuideSkeleton, CfLocale>({
    content_type: "guide",
    limit: 100,
    include: 10,
    order: ["-sys.createdAt"],
  });
  return r.items;
}

async function fetchStories(): Promise<Story[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  const client = getContentfulClient();
  const r = await client.withAllLocales.getEntries<StorySkeleton, CfLocale>({
    content_type: "story",
    limit: 100,
  });
  return r.items.filter((s) => pick<boolean>(s.fields.approved, "en") !== false);
}

async function fetchPathSteps(): Promise<PathStep[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  const client = getContentfulClient();
  const r = await client.withAllLocales.getEntries<PathStepSkeleton, CfLocale>({
    content_type: "pathStep",
    limit: 100,
  });
  return r.items;
}

async function fetchInterests(): Promise<Interest[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  const client = getContentfulClient();
  const r = await client.withAllLocales.getEntries<InterestSkeleton, CfLocale>({
    content_type: "interest",
    limit: 100,
  });
  return r.items;
}

async function fetchCities(): Promise<City[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  const client = getContentfulClient();
  const r = await client.withAllLocales.getEntries<CitySkeleton, CfLocale>({
    content_type: "city",
    limit: 100,
  });
  return r.items;
}

async function fetchHomepageSections(): Promise<HomepageSection[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  const client = getContentfulClient();
  const r = await client.withAllLocales.getEntries<HomepageSectionSkeleton, CfLocale>({
    content_type: "homepageSection",
    limit: 100,
    include: 10,
  });
  return r.items;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapOpportunity(entry: Opportunity, locale: Locale): OpportunityData {
  const fields = entry.fields as unknown as Record<string, unknown>;
  return {
    id: entry.sys.id,
    title: pickRequired<string>(fields.title, locale),
    slug: pickRequired<string>(fields.slug, locale),
    country: pick<string>(fields.country, locale) ?? "",
    countryFlag: pick<string>(fields.countryFlag, locale) ?? "🌍",
    type: pick<string>(fields.type, locale) ?? "Opportunity",
    description: pickRequired<string>(fields.description, locale),
    ageRange: pick<string>(fields.ageRange, locale) ?? "Ages 15–21",
    funding: pick<string>(fields.funding, locale) ?? "Free",
    deadline: pick<string>(fields.deadline, locale) ?? "Rolling",
    tags: pick<string[]>(fields.tags, locale) ?? [],
    imageUrl: assetUrl(fields.image, locale),
    imageAlt: pick<string>(fields.title, locale),
    featured: pick<boolean>(fields.featured, locale) ?? false,
    order: pick<number>(fields.order, locale) ?? Number.MAX_SAFE_INTEGER,
    longDescription: pick<RichTextDocument>(fields.longDescription, locale),
    updatedAt: entry.sys.updatedAt,
    translatedLocales: translatedLocales(fields, ["title", "description"]),
  };
}

function mapSession(entry: Session, locale: Locale): SessionData {
  const fields = entry.fields as unknown as Record<string, unknown>;
  return {
    id: entry.sys.id,
    title: pickRequired<string>(fields.title, locale),
    slug: pickRequired<string>(fields.slug, locale),
    icon: pick<string>(fields.icon, locale) ?? "🌍",
    description: pickRequired<string>(fields.description, locale),
    duration: pick<string>(fields.duration, locale) ?? "60 min",
    difficulty: pick<string>(fields.difficulty, locale) ?? "All levels",
    online: pick<boolean>(fields.online, locale) ?? true,
    registerUrl: pick<string>(fields.registerUrl, locale),
    upcoming: pick<boolean>(fields.upcoming, locale) ?? true,
    order: pick<number>(fields.order, locale) ?? Number.MAX_SAFE_INTEGER,
    updatedAt: entry.sys.updatedAt,
    translatedLocales: translatedLocales(fields, ["title", "description", "longDescription"]),
  };
}

function mapGuide(entry: Guide, locale: Locale): GuideData {
  const fields = entry.fields as unknown as Record<string, unknown>;
  return {
    id: entry.sys.id,
    title: pickRequired<string>(fields.title, locale),
    slug: pickRequired<string>(fields.slug, locale),
    readTime: pick<number>(fields.readTime, locale) ?? 5,
    excerpt: pick<string>(fields.excerpt, locale) ?? "",
    body: pick<RichTextDocument>(fields.body, locale),
    publishedAt: pick<string>(fields.publishedAt, locale),
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
    translatedLocales: translatedLocales(fields, ["title", "excerpt", "body"]),
  };
}

function mapStory(entry: Story, locale: Locale): StoryData {
  const fields = entry.fields as unknown as Record<string, unknown>;
  return {
    id: entry.sys.id,
    quote: pickRequired<string>(fields.quote, locale),
    name: pickRequired<string>(fields.name, locale),
    location: pick<string>(fields.location, locale) ?? "",
    role: pick<string>(fields.role, locale) ?? "Global Connect Member",
  };
}

function mapPartner(entry: Partner): PartnerData {
  const fields = entry.fields as unknown as Record<string, unknown>;
  const name = pickRequired<string>(fields.name, "en");
  return {
    id: entry.sys.id,
    name,
    logoUrl: assetUrl(fields.logo, "en"),
    logoAlt: assetAlt(fields.logo, "en") ?? name,
    website: pick<string>(fields.website, "en"),
  };
}

function mapPathStep(entry: PathStep, locale: Locale): PathStepData {
  const fields = entry.fields as unknown as Record<string, unknown>;
  return {
    id: entry.sys.id,
    stepNumber: pickRequired<number>(fields.stepNumber, locale),
    title: pickRequired<string>(fields.title, locale),
    description: pick<string>(fields.description, locale) ?? "",
  };
}

function mapInterest(entry: Interest, locale: Locale): InterestData {
  const fields = entry.fields as unknown as Record<string, unknown>;
  return {
    id: entry.sys.id,
    label: pickRequired<string>(fields.label, locale),
    emoji: pick<string>(fields.emoji, locale) ?? "✨",
  };
}

function mapCity(entry: City, locale: Locale): CityData {
  const fields = entry.fields as unknown as Record<string, unknown>;
  return {
    id: entry.sys.id,
    initials: pickRequired<string>(fields.initials, locale),
    city: pickRequired<string>(fields.city, locale),
    order: pick<number>(fields.order, locale) ?? Number.MAX_SAFE_INTEGER,
  };
}

function mapHomepageSection(
  entry: HomepageSection,
  locale: Locale,
): HomepageSectionData {
  const fields = entry.fields as unknown as Record<string, unknown>;
  return {
    id: entry.sys.id,
    section: pickRequired<string>(fields.section, locale) as HomepageSectionKey,
    eyebrow: pick<string>(fields.eyebrow, locale) ?? undefined,
    title: pick<string>(fields.title, locale) ?? undefined,
    description: pick<string>(fields.description, locale) ?? undefined,
    imageUrl: assetUrl(fields.image, locale),
    imageAlt:
      pick<string>(fields.imageAlt, locale) ??
      assetAlt(fields.image, locale) ??
      undefined,
    enabled: pick<boolean>(fields.enabled, locale) ?? true,
  };
}

// ---------------------------------------------------------------------------
// Public API — resolve a locale on top of the cached fetch
// ---------------------------------------------------------------------------

export async function getOpportunities(
  locale: Locale,
): Promise<OpportunityData[]> {
  const entries = await fetchOpportunities();
  return sortByOrder(entries.map((entry) => mapOpportunity(entry, locale)));
}

export async function getSessions(locale: Locale): Promise<SessionData[]> {
  const entries = await fetchSessions();
  return sortByOrder(entries.map((entry) => mapSession(entry, locale)));
}

export async function getGuides(locale: Locale): Promise<GuideData[]> {
  const entries = await fetchGuides();
  return entries.map((entry) => mapGuide(entry, locale));
}

export async function getStories(locale: Locale): Promise<StoryData[]> {
  const entries = await fetchStories();
  return entries.map((entry) => mapStory(entry, locale));
}

export async function getPartners(): Promise<PartnerData[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  const client = getContentfulClient();
  const r = await client.withAllLocales.getEntries<PartnerSkeleton, CfLocale>({
    content_type: "partner",
    limit: 100,
  });
  return r.items.map(mapPartner);
}

export async function getPathSteps(locale: Locale): Promise<PathStepData[]> {
  const entries = await fetchPathSteps();
  return entries
    .map((entry) => mapPathStep(entry, locale))
    .sort((a, b) => a.stepNumber - b.stepNumber);
}

export async function getInterests(locale: Locale): Promise<InterestData[]> {
  const entries = await fetchInterests();
  return entries.map((entry) => mapInterest(entry, locale));
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  const client = getContentfulClient();
  const r = await client.getEntries<SiteSettingsSkeleton>({
    content_type: "siteSettings",
    limit: 1,
    order: ["sys.createdAt"],
  });
  const entry = r.items[0];
  const url = entry?.fields.communityUrl;
  const email = entry?.fields.contactEmail;
  const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return {
    communityUrl:
      url && url.startsWith("https://") ? url : FALLBACK_COMMUNITY_URL,
    contactEmail:
      email && EMAIL_PATTERN.test(email) ? email : FALLBACK_CONTACT_EMAIL,
  };
}

export async function getCities(locale: Locale): Promise<CityData[]> {
  const entries = await fetchCities();
  return sortByOrder(entries.map((entry) => mapCity(entry, locale)));
}

export async function getHomepageSections(
  locale: Locale,
): Promise<Record<HomepageSectionKey, HomepageSectionData | undefined>> {
  const entries = await fetchHomepageSections();
  const map = {} as Record<HomepageSectionKey, HomepageSectionData | undefined>;
  for (const item of entries) {
    const data = mapHomepageSection(item, locale);
    map[data.section] = data;
  }
  return map;
}
