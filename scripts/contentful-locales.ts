import { config } from "dotenv";
import { createClient } from "contentful-management";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { LOCALIZED_FIELDS, RELAXED_VALIDATIONS } from "./lib/localized-fields";

/**
 * One-time (but idempotent) CMS setup for localization:
 *
 *   1. creates the `de` locale with `en-US` as its fallback, so untranslated
 *      entries serve English instead of nothing;
 *   2. flips the *text* fields of each content type to `localized: true`.
 *
 * Fields that must stay identical in every language — `slug` (it is the
 * URL), links, booleans, numbers, dates, emoji — are deliberately left
 * alone: localizing them would break routing and filtering for no benefit.
 *
 *   pnpm contentful:locales
 *
 * Run it before the first localized seed; running it twice changes nothing.
 */

config({ path: ".env.local" });
config({ path: ".env" });

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const ENV = process.env.CONTENTFUL_ENVIRONMENT || "master";

let TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
if (!TOKEN) {
  try {
    const rcPath =
      process.env.CONTENTFUL_CONFIG_FILE ||
      path.join(os.homedir(), ".contentfulrc.json");
    const rc = JSON.parse(fs.readFileSync(rcPath, "utf8"));
    TOKEN = rc.managementToken;
  } catch {
    // ignore — validated below
  }
}

if (!SPACE || !TOKEN) {
  console.error(
    "Missing CONTENTFUL_SPACE_ID / CONTENTFUL_MANAGEMENT_TOKEN. See contentful/README.md.",
  );
  process.exit(1);
}

const NEW_LOCALE = {
  name: "German (Germany)",
  code: "de",
  fallbackCode: "en-US",
  // Values are optional: the Delivery API falls back to `en-US` for anything
  // not translated yet, which is exactly the behaviour the site relies on.
  optional: true,
} as const;

async function main() {
  const client = createClient({ accessToken: TOKEN! });
  const base = { spaceId: SPACE!, environmentId: ENV };
  let changed = 0;

  // 1. Locale ---------------------------------------------------------------
  const locales = await client.locale.getMany({ ...base });
  const hasLocale = locales.items.some((locale) => locale.code === NEW_LOCALE.code);
  if (hasLocale) {
    console.log(`locale ${NEW_LOCALE.code} already exists`);
  } else {
    await client.locale.create({ ...base }, { ...NEW_LOCALE });
    console.log(`✓ created locale ${NEW_LOCALE.code} (fallback ${NEW_LOCALE.fallbackCode})`);
    changed++;
  }

  // 2. Localizable fields ---------------------------------------------------
  for (const [contentTypeId, fieldIds] of Object.entries(LOCALIZED_FIELDS)) {
    const contentType = await client.contentType.get({
      ...base,
      contentTypeId,
    });

    const relaxable = RELAXED_VALIDATIONS[contentTypeId] ?? [];
    let dirty = false;
    for (const field of contentType.fields) {
      if (fieldIds.includes(field.id) && field.localized !== true) {
        field.localized = true;
        dirty = true;
        console.log(`  ${contentTypeId}.${field.id} → localized`);
      }
      if (relaxable.includes(field.id) && (field.validations?.length ?? 0) > 0) {
        field.validations = [];
        dirty = true;
        console.log(`  ${contentTypeId}.${field.id} → validation relaxed`);
      }
    }

    if (dirty) {
      // Publish the entity the update returned — its `sys.version` is the
      // one the API now expects; publishing the pre-update object 409s.
      const updated = await client.contentType.update(
        { ...base, contentTypeId },
        contentType,
      );
      await client.contentType.publish({ ...base, contentTypeId }, updated);
      console.log(`  ${contentTypeId}: localized and published`);
      changed++;
    } else {
      // Publishing an unchanged, already published content type is a no-op,
      // but it repairs the one failure mode of this script: an earlier run
      // that saved the flags and then died before publishing them.
      await client.contentType.publish({ ...base, contentTypeId }, contentType);
      console.log(`  ${contentTypeId}: up to date`);
    }
  }

  console.log(
    changed === 0
      ? "nothing to do — the space is already localized"
      : `done (${changed} change${changed === 1 ? "" : "s"}). Re-run pnpm contentful:codegen to refresh the types.`,
  );
}

main().catch((err) => {
  console.error("✗ contentful:locales failed:", err);
  process.exit(1);
});
