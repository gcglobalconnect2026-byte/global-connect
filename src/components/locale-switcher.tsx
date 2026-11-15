"use client";

import { CheckIcon, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { tv } from "@/lib/utils";
import { LOCALES, LOCALE_LIST, type Locale } from "@/lib/locales";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const localeSwitcher = tv({
  slots: {
    trigger:
      "flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground",
    triggerIcon: "size-4",
    triggerLabel: "hidden sm:inline",
    item: "gap-2",
    check: "size-4",
  },
});

/**
 * Header language switcher. Keeps the current path and swaps only the locale
 * segment (`/de/guides` → `/en/guides`); next-intl sets the `NEXT_LOCALE`
 * cookie so the choice survives a reload.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Common");
  const slots = localeSwitcher();

  function select(next: Locale) {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={t("language")}
            className={slots.trigger({ class: className })}
          >
            <Languages className={slots.triggerIcon()} aria-hidden="true" />
            <span className={slots.triggerLabel()}>{LOCALES[locale].label}</span>
          </button>
        }
      />
      <DropdownMenuContent align="end">
        {LOCALE_LIST.map((meta) => (
          <DropdownMenuItem
            key={meta.code}
            className={slots.item()}
            onClick={() => select(meta.code)}
          >
            {meta.code === locale && (
              <CheckIcon className={slots.check()} aria-hidden="true" />
            )}
            {meta.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
