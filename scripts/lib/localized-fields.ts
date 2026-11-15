/**
 * Text fields that carry a per-language value — the single source of truth
 * shared by the locale setup (`contentful-locales.ts`) and the seeder
 * (`contentful-seed.ts`).
 *
 * Everything not listed stays `localized: false`: `slug` (it is the URL),
 * links, booleans, numbers, dates and emoji are identical in every language,
 * and localizing them would break routing and filtering for no benefit.
 */
export const LOCALIZED_FIELDS: Record<string, string[]> = {
  opportunity: [
    "title",
    "description",
    "longDescription",
    "country",
    "type",
    "ageRange",
    "funding",
    "deadline",
    "tags",
  ],
  session: ["title", "description", "duration", "difficulty"],
  guide: ["title", "excerpt", "body"],
  story: ["quote", "location", "role"],
  pathStep: ["title", "description"],
  interest: ["label"],
  city: ["city"],
  homepageSection: ["eyebrow", "title", "description", "imageAlt"],
  video: ["title", "caption"],
};

/** Rich-text fields: their values must pass through `toContentfulBody()`. */
export const RICH_TEXT_FIELDS = new Set(["longDescription", "body"]);

/**
 * Fields whose validation rules only accept *English* shapes — `in` enums of
 * English words and regexes like `^Ages \d{2}–\d{2}$`. Contentful applies a
 * field's validation to **every** locale, so a German value ("16–20 Jahre",
 * "Austausch") would be rejected on save. The rule has to go once the field
 * is localized; locale-neutral validations (unique slugs, `https://` URLs,
 * numeric ranges) are untouched.
 */
export const RELAXED_VALIDATIONS: Record<string, string[]> = {
  opportunity: ["country", "type", "ageRange", "funding", "deadline"],
  session: ["duration", "difficulty"],
};
