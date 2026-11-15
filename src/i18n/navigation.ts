import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Locale-aware wrappers around Next.js navigation. Use these instead of
 * `next/link` / `next/navigation` in user-facing navigation so hrefs pick up
 * the current locale.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
