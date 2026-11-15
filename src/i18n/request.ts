import * as rootParams from "next/root-params";
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "./routing";
import en from "@/messages/en.json";
import de from "@/messages/de.json";

const messages = { en, de } as const;

export default getRequestConfig(async ({ locale }) => {
  // The `[locale]` root param is available via `next/root-params` in every
  // Server Component; reading it here keeps `getRequestConfig` working for
  // cached functions, where the param also becomes part of the cache key.
  if (!locale) {
    const paramValue = await rootParams.locale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }

  return {
    locale,
    messages: messages[locale as keyof typeof messages],
    timeZone: "UTC",
  };
});
