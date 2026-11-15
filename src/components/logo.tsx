"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { tv } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

const logo = tv({
  slots: {
    root: "flex items-center gap-2.5",
    image: "h-9 w-9 object-contain transition-transform duration-300 hover:scale-105",
    wordmark: "font-display text-lg tracking-tight text-foreground",
  },
});

export function Logo({ className }: { className?: string }) {
  const t = useTranslations("Common");
  const slots = logo();
  return (
    <Link
      href="/"
      aria-label={t("logoHome")}
      className={slots.root({ class: className })}
    >
      <Image
        src="/logo.png"
        alt={t("logoAlt")}
        width={40}
        height={40}
        className={slots.image()}
      />
      <span className={slots.wordmark()}>GLOBAL CONNECT</span>
    </Link>
  );
}
