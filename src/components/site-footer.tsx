import Image from "next/image";
import { getT } from "@/i18n/t";

import { tv } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
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

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export async function SiteFooter() {
  const [siteSettings, t, tc] = await Promise.all([
    getSiteSettings(),
    getT("Footer"),
    getT("Common"),
  ]);
  const { communityUrl } = siteSettings;

  const aboutLinks: FooterLink[] = [
    { label: t("ourStory"), href: "/about" },
    { label: t("impact"), href: "/about#impact" },
    { label: t("partners"), href: "/about#partners" },
    { label: t("contact"), href: "/about#contact" },
  ];

  const exploreLinks: FooterLink[] = [
    { label: t("opportunities"), href: "/opportunities" },
    { label: t("sessions"), href: "/sessions" },
    { label: t("guides"), href: "/guides" },
    { label: t("community"), href: communityUrl, external: true },
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
                alt={tc("logoAlt")}
                width={40}
                height={40}
                loading="lazy"
                className={slots.brandLogo()}
              />
              <p className={slots.brandWordmark()}>GLOBAL CONNECT</p>
            </div>
            <p className={slots.tagline()}>{t("tagline")}</p>
          </div>

          <FooterColumn title={t("explore")} links={exploreLinks} />
          <FooterColumn title={t("about")} links={aboutLinks} />
        </div>

        <div className={slots.bottom()}>
          <p>{t("copyright")}</p>
          <div className={slots.legalLinks()}>
            <Link href="/privacy" className={slots.legalLink()}>
              {t("privacy")}
            </Link>
            <Link href="/terms" className={slots.legalLink()}>
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  const slots = footer();
  return (
    <div>
      <p className={slots.columnTitle()}>{title}</p>
      <ul className={slots.list()}>
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={slots.link()}
              >
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className={slots.link()}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
