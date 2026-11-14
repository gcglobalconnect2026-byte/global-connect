import Link from "next/link";
import Image from "next/image";

import { tv } from "@/lib/utils";

const logo = tv({
  slots: {
    root: "flex items-center gap-2.5",
    image: "h-9 w-9 object-contain transition-transform duration-300 hover:scale-105",
    wordmark: "font-display text-lg tracking-tight text-foreground",
  },
});

export function Logo({ className }: { className?: string }) {
  const slots = logo();
  return (
    <Link
      href="/"
      aria-label="Global Connect — home"
      className={slots.root({ class: className })}
    >
      <Image
        src="/logo.png"
        alt="Global Connect logo"
        width={40}
        height={40}
        className={slots.image()}
      />
      <span className={slots.wordmark()}>GLOBAL CONNECT</span>
    </Link>
  );
}
