"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

import { tv } from "@/lib/utils";
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
    authRow: "flex items-center",
    menuButton:
      "flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden",
    menuLabel: "sr-only",
    menuLines: "flex flex-col gap-1.5",
    menuLine: "block h-px w-5 bg-foreground",
    mobileNav: "flex flex-col gap-2 px-4",
    mobileLink:
      "rounded-full px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
    mobileActions: "mt-6 flex flex-col gap-3 px-4 pb-6",
    mobileAuthRow: "flex items-center gap-3",
  },
});

function AuthButtons({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const slots = headerNav();
  return (
    <div className={variant === "mobile" ? slots.mobileAuthRow() : slots.authRow()}>
      <Show
        when="signed-out"
        fallback={
          <UserButton
            appearance={{
              elements: { avatarBox: "size-8", userButtonAvatarBox: "size-8" },
            }}
          />
        }
      >
        <SignInButton mode="modal">
          <Button variant="default" size="xs">
            Join us
          </Button>
        </SignInButton>
      </Show>
    </div>
  );
}

export function SiteHeaderNav({ communityUrl }: { communityUrl: string }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const NAV_LINKS = [
    { label: "Home", section: "top", page: "/" },
    { label: "Opportunities", section: "opportunities", page: "/opportunities" },
    { label: "Online Sessions", section: "sessions", page: "/sessions" },
    { label: "Guides", section: "guides", page: "/guides" },
    { label: "Community", href: communityUrl, external: true },
    { label: "About", page: "/about" },
  ];

  const links = NAV_LINKS.map((l) => ({
    label: l.label,
    href: "external" in l ? l.href : l.section && isHome ? `#${l.section}` : l.page,
    external: "external" in l,
  }));

  const slots = headerNav();

  return (
    <header className={slots.header()}>
      <nav className={slots.nav()}>
        <Logo />

        <ul className={slots.list()}>
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={slots.link()}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={slots.actions()}>
          <Button
            variant="outline"
            size="xs"
            render={<Link href="/opportunities" />}
          >
            Explore opportunities
          </Button>
          <AuthButtons />
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <button
                type="button"
                aria-label="Toggle navigation"
                className={slots.menuButton()}
              >
                <span className={slots.menuLabel()}>Menu</span>
                <span className={slots.menuLines()}>
                  <span className={slots.menuLine()} />
                  <span className={slots.menuLine()} />
                </span>
              </button>
            }
          />
          <SheetContent side="right">
            <SheetHeader className="text-left">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Explore Global Connect</SheetDescription>
            </SheetHeader>
            <nav className={slots.mobileNav()} aria-label="Mobile">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={slots.mobileLink()}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className={slots.mobileActions()}>
              <AuthButtons variant="mobile" />
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/opportunities" />}
              >
                Explore opportunities
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
