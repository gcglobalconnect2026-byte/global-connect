# Localization

The site ships in **English (`en`, default) and German (`de`)**. Ukrainian is
deferred — see [Adding a language](#adding-a-language).

This file describes the system as it exists now. Read it before adding copy,
a language or a localized content type.

## Where a string gets translated

Two paths, chosen by where the copy lives:

| Copy | Lives in | To translate |
|---|---|---|
| UI — nav, buttons, labels, page metadata, legal pages, accessible names | `src/messages/{en,de}.json` | add the key to **both** files |
| Content — opportunities, sessions, guides, stories, homepage headings | Contentful, field-level locale | edit the entry in the CMS, or `src/lib/contentful/seed-translations.ts` for seed data |

Rules that keep it working:

- Never hardcode user-visible English in a component. Server components call
  `getT(namespace)` (`src/i18n/t.ts`); client components call
  `useTranslations(namespace)`.
- `getT` reads the locale from `next/root-params`, **not** from request
  headers — `headers()` is runtime data and blocks prerendering under
  `cacheComponents`.
- `slug`, links, booleans, numbers, dates and emoji are not localized: they
  are identical in every language. The authoritative list is
  `scripts/lib/localized-fields.ts`.

## Routing

- Every page has one URL per language: `/en/…`, `/de/…`. The default locale is
  prefixed too, so `hreflang` needs no special-casing.
- `/` negotiates from the `NEXT_LOCALE` cookie, then `Accept-Language`.
  The switcher in the header keeps the current path and swaps only the locale.
- Pre-localization URLs (`/about`, `/guides/x`) 308 to `/en/…` — they were
  English and stay English. See `redirects()` in `next.config.ts`.
- `src/proxy.ts` runs Clerk first (locale stripped before matching), then
  next-intl. `PROTECTED_PATH_PATTERNS` is empty — the site has no private
  pages, and an unknown URL must reach the localized 404 instead of bouncing
  to Clerk's sign-in host. Metadata files are excluded by the matcher, so
  `robots.txt`, `sitemap.xml`, `llms.txt` and `manifest.json` are never
  rewritten to `/{locale}/…`.

## Translation coverage — what `hreflang` advertises

An entry is only advertised in a language when its **primary fields** exist
in that locale: `title`, `description`/`excerpt`, and the rich-text body.
The check is `translatedLocales()` in `src/lib/contentful/queries.ts`; it
feeds two places:

- `alternates.languages` / `hreflang` — `src/lib/seo.ts` (`pageMetadata()`);
- which URLs `src/app/sitemap.ts` emits.

A `/de` page that still renders English stays reachable, but is not
advertised: linking it would make Google index English text as German.

## Contentful specifics

- Locales: `en-US` (default) with `de` falling back to it, so a missing
  translation serves English instead of a hole.
- `pnpm contentful:locales` is idempotent: it creates the locale, flips text
  fields to `localized: true`, and **relaxes English-only validations**.
  Contentful validates every locale against one rule, so patterns like
  `^Ages \d{2}–\d{2}$` or `in: ["Exchange", …]` would reject German values
  ("16–20 Jahre", "Austausch"). Locale-neutral rules — unique slugs,
  `https://` URLs, numeric ranges — are kept.
- `pnpm contentful:seed` writes English and every language in
  `seed-translations.ts` in one pass, per entry. Re-running it is safe.
- `pnpm contentful:codegen` refreshes the generated types after a model
  change. Nothing imports that file; it is a reference artifact.

## Adding a language

1. `src/lib/locales.ts` — add the code, switcher label, `htmlLang`,
   `ogLocale`, `hreflang`.
2. `src/messages/<code>.json` — copy `en.json`, translate every key.
3. `scripts/contentful-locales.ts` — add the locale to `NEW_LOCALE`, run
   `pnpm contentful:locales`.
4. `src/lib/contentful/seed-translations.ts` — add the language key with the
   translated entries, run `pnpm contentful:seed`.
5. `src/app/[locale]/layout.tsx` — add the Clerk localization (`deDE`…).
6. `pnpm typecheck && pnpm lint && pnpm build`, then spot-check `/xx/…`.

Nothing else needs a locale list: routing, sitemap, `hreflang` and JSON-LD
all read `src/lib/locales.ts`.

## Known gaps

- **Image alt text inside Contentful** is stored per asset, not per locale —
  guide illustrations keep their English alt in German pages.
- **`public/llms.txt`** is a static file in `public/`, so route-level i18n
  never reaches it; it is English-only.
- **404 pages**: `notFound()` in a dynamic route resolves correctly, but two
  caveats apply. (1) The *first* render of an unknown slug per server process
  streams the shell early and returns 200 with the 404 body + `noindex`; every
  later request is a real 404 — verified identical at pre-localization HEAD,
  so it is framework behaviour, not a localization regression. (2) Next 16
  serves its own HTML shell for a `notFound()` (the localized tree hydrates
  client-side); the experimental `global-not-found` would SSR a shell but
  cannot know the locale.
- **Detail pages block navigation on purpose**: `guides/[slug]`,
  `opportunities/[slug]` and `sessions/[slug]` resolve the record before the
  first flush (that is what keeps the 404 honest) and therefore export
  `instant = false` to opt out of Next's dev "instant navigation" validation.
  Wrapping the lookup in `<Suspense>` would silence it natively but stream a
  200 for every unknown slug.
- **Fraunces has no Cyrillic** — irrelevant while Ukrainian is deferred, but
  it is the reason Ukrainian headings would need a second display face.

## Scope notes

- Content re-seed: done, in the same pass as localization.
- Ukrainian: locale-list change plus a Contentful plan upgrade — the Free
  plan allows 2 locales and `en-US` + `de` uses both.
