import { notFound } from "next/navigation";

/**
 * Catch-all so every request inside `[locale]` renders the localized
 * `not-found.tsx` instead of Next's default 404 — without it, unknown routes
 * (e.g. `/en/typo`) bypass the `[locale]` segment entirely.
 *
 * `instant = false`: this segment exists to throw `notFound()`, so the
 * instant-navigation validator can never render it and would only log that
 * it could not validate.
 */
export const instant = false;

export default function CatchAllPage() {
  notFound();
}
