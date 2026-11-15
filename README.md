# Global Connect

A Next.js 16 (App Router, React 19, Tailwind v4) clone of the Global Connect
youth-opportunity site, built CMS-first with **Contentful**. Rendered fully
static with ISR (Cache Components), with **no cookies, no accounts and no
third-party request before the visitor asks for one**.

## Stack

| Concern   | Choice                                                    |
| --------- | --------------------------------------------------------- |
| Framework | Next.js 16 (App Router, React 19, TypeScript)             |
| Styling   | Tailwind v4 + [tailwind-variants](https://tailwind-variants.org) + [shadcn/ui](https://ui.shadcn.com) (Base UI) |
| CMS       | Contentful (Delivery + Preview API)                       |
| Privacy   | Zero cookies; analytics and video are cookieless / click-to-load |
| Caching   | SSG + ISR via Cache Components (`cacheLife` / `cacheTag`) |
| Quality   | ESLint, `tsc --noEmit`, [React Doctor](https://react-doctor.com) |

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

> The site ships with built-in sample content so it renders before you connect
> Contentful. Once your CMS is wired up, real entries replace it automatically.
> To populate your CMS, run `pnpm contentful:import` then `pnpm contentful:seed`
> (see [`contentful/README.md`](./contentful/README.md) for full details).

## Environment variables

Copy `.env.example` → `.env.local` and fill in your keys. Full walkthroughs:

- **Contentful** — see [`contentful/README.md`](./contentful/README.md) (model
  import, entries, codegen, caching).
- **Site origin** — `NEXT_PUBLIC_SITE_URL` drives canonical URLs, Open Graph,
  `sitemap.xml` and `robots.txt` (see `src/lib/site.ts`). On Vercel it falls
  back to `$VERCEL_PROJECT_PRODUCTION_URL`; locally to `http://localhost:3000`.
- **Analytics** — Vercel Web Analytics and Speed Insights take no keys: they
  are enabled per project in the Vercel dashboard and served from `/_vercel/…`.
  Both are mounted in `src/app/[locale]/layout.tsx` for
  `VERCEL_ENV === "production"` only, so previews and `pnpm dev` send nothing.

## Useful commands

```bash
pnpm dev               # development server
pnpm build             # production build
pnpm start             # run production build
pnpm lint              # eslint
pnpm typecheck         # tsc --noEmit
pnpm react-doctor      # scan the codebase for React issues (0-100 score)
pnpm contentful:import # import the content model into your space (see contentful/README.md)
pnpm contentful:locales# add/verify the localized content model (see LOCALIZATION.md)
pnpm contentful:seed   # seed entries + assets into Contentful (see contentful/README.md)
pnpm contentful:codegen# generate TS types from your Contentful content model
```

## Quality control

There is no test suite yet, so these four commands are the gate. All must pass
before an MR:

- [ ] `pnpm typecheck` — `tsc --noEmit`, zero errors
- [ ] `pnpm lint` — ESLint, zero problems
- [ ] `pnpm react-doctor` — React diagnostics over the whole codebase, `100/100`
- [ ] `pnpm build` — production build; every route must prerender

`react-doctor` is a pinned devDependency and its script scans **everything**, not
just changed files, so a regression shows up locally instead of waiting for CI.
It scores render stability, hooks, a11y (anchor content, internal links), list
keys, async data fetching and export hygiene — the fixes behind the current
100/100 were mostly real bugs: `Promise.all` for independent awaits, module-scope
rich-text renderers, `next/link` for internal links, stable carousel keys.

While iterating on one file, scope it down:

```bash
npx react-doctor . --scope changed          # only issues in changed files
npx react-doctor . --scope changed --base main
```

## Project structure

```
src/
  app/                    # routes (page.tsx per route), all under [locale]/
    (sections on the home page) + /opportunities, /sessions, /guides, /about
  i18n/                   # routing.ts, navigation.ts (locale-aware Link), request.ts, t.ts
  components/
    sections/             # homepage section components
    ui/                   # shadcn/ui primitives
    settings-menu.tsx     # header settings dropdown (theme + language)
  messages/               # en.json, de.json — every UI string
  lib/
    contentful/           # client.ts, queries.ts (cached fetchers), seed*.ts (CMS seed data)
    locales.ts            # the locale registry: routes, hreflang, og:locale all read it
    richtext.tsx          # Contentful rich-text → React
  types/                  # hand-written models (models.ts) + Contentful skeleton types (contentful.ts)
contentful/               # content-model.json + setup guide
scripts/                  # contentful-locales.ts, contentful-seed.ts
```

## Localization

English (`en`) and German (`de`), one URL per language (`/en/…`, `/de/…`),
auto-detected from `Accept-Language` only — the site sets no cookie, and the
locale in the URL is what survives a reload. UI copy
lives in `src/messages/`, CMS copy in Contentful's `de` locale. See
[LOCALIZATION.md](LOCALIZATION.md) for the rules, the coverage logic behind
`hreflang`, and the checklist for adding a language.

## Styling conventions

Every class lives in a `tv()` recipe from `tailwind-variants`, re-exported by
`src/lib/utils.ts` (`tv`, `cn`, `cx`, `VariantProps`, `mergeClass`).
`class-variance-authority` and the `cn` package are gone — ESLint blocks
reintroducing them.

- **Colocate the recipe.** `const card = tv({ ... })` sits directly above its
  component. Extract to a shared file only when two or more components use it.
- **Several styled parts → `slots`.** Each part calls its own slot, so JSX keeps
  markup only: `className={slots.title({ class: className })}`.
- **Conditional styling → `variants`.** Ternaries, index lookups and
  `data-[side=…]` blocks become axes (`variant`, `size`, `tone`, `side`,
  `align`), resolved in JS instead of CSS selectors.
- **Caller overrides use `class`.** `button({ variant, size, class: className })`
  merges the caller's classes last, so they win.
- **No class strings in JSX.** A `className` prop may only be passed through to
  a recipe; never build one with `${}`.
- **Keep `data-*` attributes.** `data-slot`, `data-size`, `data-side` and the
  `group-*` selectors around them are behaviour, not leftovers.

Shared recipes: `ui/tile.tsx` (colour palettes), `ui/arrow-link.tsx`,
`ui/blobs.tsx` (decorative backdrops), `page-shell.tsx` (route chrome),
`legal-page.tsx`.

For Tailwind IntelliSense inside `tv(...)` strings, add to VS Code settings:

```json
"tailwindCSS.experimental.classRegex": [
  ["tv\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
]
```

## Caching model

Fetchers in `src/lib/contentful/queries.ts` are marked `"use cache"` with the
`cms` `cacheLife` profile (revalidate every 15 min, serve stale up to 24 h) and
tagged `contentful`. Watch the `contentful/README.md` section on revalidation to
wire a webhook for instant refreshes.