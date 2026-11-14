import Image from "next/image";
import Link from "next/link";

import { tv } from "@/lib/utils";
import { getSiteSettings } from "@/lib/contentful/queries";

const footer = tv({
  slots: {
    root: "border-t border-border/70 bg-card/40 px-6 py-16",
    inner: "mx-auto max-w-7xl",
    grid: "grid gap-12 lg:grid-cols-[1.4fr_repeat(2,1fr)]",
    brandRow: "flex items-center gap-2.5",
    brandLogo: "h-9 w-9 object-contain",
    brandWordmark: "font-display text-lg text-foreground",
    tagline: "mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground",
    columnTitle: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
    list: "mt-4 space-y-2.5",
    link: "text-sm text-foreground/80 transition-colors hover:text-foreground",
    bottom:
      "mt-14 flex flex-col gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
    legalLinks: "flex gap-6",
    legalLink: "transition-colors hover:text-foreground",
  },
});

const aboutLinks = [
  { label: "Our story", href: "/about" },
  { label: "Impact", href: "/about#impact" },
  { label: "Partners", href: "/about#partners" },
  { label: "Contact", href: "/about#contact" },
];

export async function SiteFooter() {
  const { communityUrl } = await getSiteSettings();

  const exploreLinks = [
    { label: "Opportunities", href: "/opportunities" },
    { label: "Sessions", href: "/sessions" },
    { label: "Guides", href: "/guides" },
    { label: "Community", href: communityUrl, external: true },
  ];

  const slots = footer();

  return (
    <footer className={slots.root()}>
      <div className={slots.inner()}>
        <div className={slots.grid()}>
          <div>
            <div className={slots.brandRow()}>
              <Image
                src="/logo.png"
                alt="Global Connect logo"
                width={40}
                height={40}
                loading="lazy"
                className={slots.brandLogo()}
              />
              <p className={slots.brandWordmark()}>GLOBAL CONNECT</p>
            </div>
            <p className={slots.tagline()}>
              Helping young people discover what&apos;s possible.
            </p>
          </div>

          <FooterColumn title="Explore" links={exploreLinks} />
          <FooterColumn title="About" links={aboutLinks} />
        </div>

        <div className={slots.bottom()}>
          <p>&copy; 2026 Global Connect</p>
          <div className={slots.legalLinks()}>
            <Link href="/privacy" className={slots.legalLink()}>
              Privacy
            </Link>
            <Link href="/terms" className={slots.legalLink()}>
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  const slots = footer();
  return (
    <div>
      <p className={slots.columnTitle()}>{title}</p>
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
    </div>
  );
}
