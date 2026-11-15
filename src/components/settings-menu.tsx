"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Languages, Moon, Settings, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { tv } from "@/lib/utils";
import { LOCALE_LIST, type Locale } from "@/lib/locales";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const settingsMenu = tv({
  slots: {
    trigger:
      "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground",
    triggerIcon: "size-4",
    content: "w-56",
    row: "flex items-center justify-between gap-4 rounded-md px-1.5 py-1.5",
    rowLabel: "flex items-center gap-2 text-sm text-muted-foreground",
    rowIcon: "size-4",
    segmented: "flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5",
    segment:
      "rounded-full px-2 py-0.5 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
    segmentActive: "bg-foreground text-background",
    segmentIdle: "text-muted-foreground hover:text-foreground",
  },
});

/** next-themes' default storage key; kept in sync via the `storage` event. */
const STORAGE_KEY = "theme";

function subscribe(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) ?? "light";
}

function getServerSnapshot() {
  return "light";
}

/**
 * The header's single settings control: a gear button opening one dropdown
 * with the two toggles the site has — light/dark theme and language.
 *
 * The stored theme is read through `useSyncExternalStore` rather than
 * `useTheme().theme` during render: next-themes reads `localStorage`
 * synchronously in its state initializer, which would disagree with the
 * server-rendered (always "light") markup. The server snapshot keeps the
 * hydration output stable, and `setTheme` from `useTheme` still performs the
 * write and the class toggle.
 *
 * The rows are plain containers rather than menu items on purpose: flipping
 * a switch or the language should not close the dropdown, so the user can
 * toggle both without reopening it.
 */
export function SettingsMenu({ className }: { className?: string }) {
  const { setTheme } = useTheme();
  const storedTheme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Common");
  const slots = settingsMenu();

  const current = storedTheme === "dark" ? "dark" : "light";
  const ThemeIcon = current === "dark" ? Moon : Sun;

  function selectLocale(next: Locale) {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={t("settings")}
            className={slots.trigger({ class: className })}
          >
            <Settings className={slots.triggerIcon()} aria-hidden="true" />
          </button>
        }
      />
      <DropdownMenuContent align="end" className={slots.content()}>
        <div className={slots.row()}>
          <span className={slots.rowLabel()}>
            <ThemeIcon className={slots.rowIcon()} aria-hidden="true" />
            {t("darkMode")}
          </span>
          <Switch
            checked={current === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label={t("darkMode")}
          />
        </div>
        <div className={slots.row()}>
          <span className={slots.rowLabel()}>
            <Languages className={slots.rowIcon()} aria-hidden="true" />
            {t("language")}
          </span>
          <div
            className={slots.segmented()}
            role="group"
            aria-label={t("language")}
          >
            {LOCALE_LIST.map((meta) => {
              const active = meta.code === locale;
              return (
                <button
                  key={meta.code}
                  type="button"
                  aria-pressed={active}
                  className={slots.segment({
                    class: active ? slots.segmentActive() : slots.segmentIdle(),
                  })}
                  onClick={() => selectLocale(meta.code)}
                >
                  {meta.code.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
