"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { CheckIcon, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

import { tv } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themeSwitcher = tv({
  slots: {
    trigger:
      "flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground",
    triggerIcon: "size-4",
    triggerLabel: "hidden sm:inline",
    item: "gap-2",
    check: "size-4",
  },
});

const MODES = ["light", "dark"] as const;

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
 * Header light/dark switcher. The site always starts light (next-themes
 * `defaultTheme="light"`, OS preference ignored); picking a mode stores it in
 * `localStorage` and flips the `.dark` class on `<html>`.
 *
 * The stored theme is read through `useSyncExternalStore` rather than
 * `useTheme().theme` during render: next-themes reads `localStorage`
 * synchronously in its state initializer, which would disagree with the
 * server-rendered (always "light") markup. The server snapshot keeps the
 * hydration output stable, and `setTheme` from `useTheme` still performs the
 * write and the class toggle.
 */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { setTheme } = useTheme();
  const storedTheme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const t = useTranslations("Common");
  const slots = themeSwitcher();

  const current = storedTheme === "dark" ? "dark" : "light";
  const Icon = current === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={t("theme")}
            className={slots.trigger({ class: className })}
          >
            <Icon className={slots.triggerIcon()} aria-hidden="true" />
            <span className={slots.triggerLabel()}>{t(current)}</span>
          </button>
        }
      />
      <DropdownMenuContent align="end">
        {MODES.map((mode) => (
          <DropdownMenuItem
            key={mode}
            className={slots.item()}
            onClick={() => setTheme(mode)}
          >
            {current === mode && (
              <CheckIcon className={slots.check()} aria-hidden="true" />
            )}
            {t(mode)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
