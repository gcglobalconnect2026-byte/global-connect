# Localization handoff notes

Read this before adding a locale. It lists everything in the repo that is
currently English-only or `en-US`-pinned, so the re-seed can be done once,
after localization, instead of twice.

## Do not re-seed yet

`pnpm contentful:seed` is **deferred** until after the locale work. The seed
must write every new locale in the same pass.

The one content fix already made in the seed — `heading1("Before you go")` →
`heading2(...)` in `src/lib/contentful/seed.ts` — is already neutralised at
render time: `src/lib/richtext.tsx` demotes `BLOCKS.HEADING_1` → `<h2>`, so
the duplicate-H1 bug is gone even though the CMS still has the old value.
Reseeding later picks the change up for free.

## Contentful: locale wiring

| Where | What's pinned |
|---|---|
| `src/lib/contentful/client.ts` | `createClient()` passes **no `locale`** → always the space's default locale. Add `locale` / `acceptLanguage` once a second locale exists. |
| `src/lib/richtext.tsx` | Unwraps a literal `"en-US"` key in `assetUrl()` (line ~46) and in the video `title`/`caption`/`videoUrl` reads (~106, ~116, ~124). Must handle the new locale key, or accept "whichever locale is present". |
| `src/types/contentful.ts` | Every entry type is `Entry<Skeleton, undefined, "en-US">` (lines 92–145). |
| `src/types/generated/contentful.d.ts` | Regenerate with `pnpm contentful:codegen` after the model/locale change. |
| `src/lib/contentful/seed.ts` | Asset + video entries wrap fields in `{ "en-US": ... }` (lines ~116–147). |
| `scripts/contentful-seed.ts` | All CMA upserts wrap fields in `{ "en-US": ... }`; the helper types are `Record<string, Record<"en-US", unknown>>` (line 199) and `Record<string, { "en-US": unknown }>` (line 426). |

`src/lib/contentful/queries.ts` reads `fields.title` etc. directly — correct
today because the Delivery API flattens to the requested locale, but it will
silently return the default locale for anything not translated. Consider
`localeFallbacks` / `acceptLanguage` so missing translations degrade instead
of mixing languages.

## SEO layer — all English-hardcoded

The SEO work below is deliberately single-locale and must grow `hreflang`:

- `src/lib/seo.ts` — `DEFAULT_DESCRIPTION`, `SITE_NAME`, the `%s · Global Connect`
  title template, and `openGraph.locale: "en_US"`. `pageMetadata()` has no
  `languages` parameter yet; it needs one to emit `alternates.languages`.
- `src/lib/schema.ts` — `inLanguage: "en"` in `organization()`, `website()`
  and `article()`. Breadcrumb and `ItemList` paths are hardcoded to
  `/guides`, `/opportunities`, `/sessions`.
- `src/app/layout.tsx` — `<html lang="en">` (line ~81) and
  `openGraph.locale: "en_US"` (line ~56).
- `src/app/sitemap.ts` — flat URL list, no `alternates.languages`. Each entry
  will need per-locale `<xhtml:link>` alternates.
- `src/app/guides/[slug]/page.tsx:76` — `toLocaleDateString("en-US", ...)`.
- `public/llms.txt` — English-only and lives in `public/`, so no route-level
  i18n will localize it.

Canonical/OG/sitemap URLs all resolve from `SITE_URL`
(`src/lib/site.ts` ← `NEXT_PUBLIC_SITE_URL`). If localized paths get their own
host or prefix, that value and every `pageMetadata({ path })` call need to
agree on it.

## Display strings that are content, not just copy

These come from the CMS and are rendered verbatim, so they need translating
as data (or per-locale fields), not just a UI string table:

`deadline` (free text, no year — also blocks any Event/date schema),
`duration`, `difficulty`, `ageRange`, `funding`, `type`, `tags`, `country`.

## Order of operations

1. Add the locale in Contentful and make it non-default-safe in the client.
2. Update `richtext.tsx` unwrapping + regenerate types.
3. Make both seed scripts write all locales.
4. Re-run `pnpm contentful:seed` (the deferred re-seed).
5. Then add `hreflang` / `alternates.languages` to the SEO layer.
