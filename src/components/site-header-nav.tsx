"use client";

import { useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { tv } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const headerNav = tv({
  slots: {
    header:
      "sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md",
    nav: "mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6",
    list: "hidden items-center gap-7 lg:flex",
    link: "text-sm text-muted-foreground transition-colors hover:text-foreground",
    actions: "hidden items-center gap-3 lg:flex",
    joinRow: "flex items-center",
    menuButton:
      "flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden",
    menuLabel: "sr-only",
    menuLines: "flex flex-col gap-1.5",
    menuLine: "block h-px w-5 bg-foreground",
    mobileNav: "flex flex-col gap-2 px-4",
    mobileLink:
      "rounded-full px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
    mobileActions: "mt-6 flex flex-col gap-3 px-4 pb-6",
    mobileJoinRow: "flex items-center gap-3",
  },
});

type NavKey =
  "home" | "opportunities" | "sessions" | "guides" | "community" | "about";

type NavItem =
  | { key: NavKey; page: string; section?: string }
  | { key: NavKey; href: string; external: true };

/**
 * The single call to action: this site has no accounts, sign-in or
 * registration anywhere, so the button opens the community channel instead.
 * It opens in a new tab because the header persists across navigation and
 * sending a reader to Telegram from inside the site would drop them out of it.
 */
function JoinButton({
  communityUrl,
  variant = "desktop",
}: {
  communityUrl: string;
  variant?: "desktop" | "mobile";
}) {
  const t = useTranslations("Nav");
  const slots = headerNav();
  return (
    <div
      className={
        variant === "mobile" ? slots.mobileJoinRow() : slots.joinRow()
      }
    >
      <Button
        variant="default"
        size="xs"
        render={
          <a
            href={communityUrl}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        {t("join")}
      </Button>
    </div>
  );
}

export function SiteHeaderNav({ communityUrl }: { communityUrl: string }) {
  const pathname = usePathname();
  const locale = useLocale();
  const isHome = pathname === "/";
  const t = useTranslations("Nav");
  const slots = headerNav();

  // The header is layout-persistent, so the sheet would otherwise survive
  // client-side navigation and stay open over the new page. Any route or
  // locale change drops the key it was opened on — a render-phase update (the
  // React-recommended alternative to an effect here) — so the menu closes even
  // for the browser back/forward gesture. In-page anchor links keep the same
  // pathname, so they close it explicitly.
  const navigationKey = `${pathname}#${locale}`;
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  if (openedAt !== null && openedAt !== navigationKey) {
    setOpenedAt(null);
  }
  const menuOpen = openedAt !== null;
  const closeMenu = () => setOpenedAt(null);

  const NAV_LINKS: NavItem[] = [
    { key: "home", section: "top", page: "/" },
    { key: "opportunities", section: "opportunities", page: "/opportunities" },
    { key: "sessions", section: "sessions", page: "/sessions" },
    { key: "guides", section: "guides", page: "/guides" },
    { key: "community", href: communityUrl, external: true },
    { key: "about", page: "/about" },
  ];

  const links = NAV_LINKS.map((item) => {
    const label = t(item.key);
    if ("external" in item) {
      return { label, href: item.href, kind: "external" as const };
    }
    // On the homepage the nav jumps to the section instead of reloading.
    if (item.section && isHome) {
      return { label, href: `#${item.section}`, kind: "anchor" as const };
    }
    return { label, href: item.page, kind: "internal" as const };
  });

  return (
    <header className={slots.header()}>
      <nav className={slots.nav()}>
        <Logo />

        <ul className={slots.list()}>
          {links.map((link) => (
            <li key={link.label}>
              {link.kind === "internal" ? (
                <Link href={link.href} className={slots.link()}>
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  target={link.kind === "external" ? "_blank" : undefined}
                  rel={
                    link.kind === "external" ? "noopener noreferrer" : undefined
                  }
                  className={slots.link()}
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className={slots.actions()}>
          <Button
            variant="outline"
            size="xs"
            render={<Link href="/opportunities" />}
          >
            {t("explore")}
          </Button>
          <ThemeSwitcher />
          <LocaleSwitcher />
          <JoinButton communityUrl={communityUrl} />
        </div>

        <Sheet
          open={menuOpen}
          onOpenChange={(open) => setOpenedAt(open ? navigationKey : null)}
        >
          <SheetTrigger
            render={
              <button
                type="button"
                aria-label={t("toggle")}
                className={slots.menuButton()}
              >
                <span className={slots.menuLabel()}>{t("menu")}</span>
                <span className={slots.menuLines()}>
                  <span className={slots.menuLine()} />
                  <span className={slots.menuLine()} />
                  <span className={slots.menuLine()} />
                </span>
              </button>
            }
          />
          <SheetContent side="right">
            <SheetHeader className="text-left">
              <SheetTitle>{t("menu")}</SheetTitle>
              <SheetDescription>{t("menuDescription")}</SheetDescription>
            </SheetHeader>
            <nav className={slots.mobileNav()} aria-label={t("mobileNav")}>
              {links.map((link) =>
                link.kind === "internal" ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className={slots.mobileLink()}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.kind === "external" ? "_blank" : undefined}
                    rel={
                      link.kind === "external"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    onClick={closeMenu}
                    className={slots.mobileLink()}
                  >
                    {link.label}
                  </a>
                ),
              )}
            </nav>
            <div className={slots.mobileActions()}>
              <JoinButton communityUrl={communityUrl} variant="mobile" />
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/opportunities" />}
              >
                {t("explore")}
              </Button>
              <ThemeSwitcher />
              <LocaleSwitcher />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
