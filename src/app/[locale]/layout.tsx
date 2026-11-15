import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { deDE, enUS } from "@clerk/localizations";
import { Fraunces, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";

import { cn, tv } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import { DEFAULT_OG_IMAGE, SITE_NAME, alternatesFor } from "@/lib/seo";
import { LOCALES, LOCALE_CODES } from "@/lib/locales";
import { withLocale } from "@/i18n/params";
import { JsonLd } from "@/components/json-ld";
import { organization, website } from "@/lib/schema";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const appShell = tv({
  slots: {
    html: "h-full antialiased",
    body: "min-h-full flex flex-col",
  },
});

const isProduction = process.env.VERCEL_ENV === "production";

/** Clerk's own UI (sign-in modal, user button) is localized separately. */
const clerkLocalizations = { en: enUS, de: deDE } as const;

export function generateStaticParams() {
  return LOCALE_CODES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = withLocale(await params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t("defaultTitle");
  const description = t("defaultDescription");
  const alternates = alternatesFor("");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s · ${SITE_NAME}`,
    },
    description,
    // Preview deployments must never compete with production for the same text.
    robots: isProduction ? undefined : { index: false, follow: false },
    alternates: {
      canonical: `/${locale}`,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: SITE_NAME,
      type: "website",
      locale: LOCALES[locale].ogLocale,
      alternateLocale: LOCALE_CODES.filter((code) => code !== locale).map(
        (code) => LOCALES[code].ogLocale,
      ),
      images: [{ ...DEFAULT_OG_IMAGE, alt: t("ogImageAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
    applicationName: SITE_NAME,
    other: {
      "apple-mobile-web-app-title": SITE_NAME,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = withLocale(await params);

  const slots = appShell();
  const messages = await getMessages({ locale });

  return (
    <html lang={LOCALES[locale].htmlLang} className={cn(inter.variable, fraunces.variable, slots.html())}>
      <body className={slots.body()}>
        <JsonLd data={organization(locale)} />
        <JsonLd data={website(locale)} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClerkProvider localization={clerkLocalizations[locale]}>
            {children}
          </ClerkProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
