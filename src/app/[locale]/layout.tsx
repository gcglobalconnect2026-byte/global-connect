import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Fraunces, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";

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
  // Static colors can't follow the in-page theme toggle, so this only covers
  // the browser chrome: light by default, dark for OS-dark readers.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#17171c" },
  ],
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = withLocale(await params);

  const slots = appShell();
  const messages = await getMessages({ locale });

  return (
    // next-themes applies `.dark` to <html> via a pre-hydration script; the
    // mismatch against the server-rendered (light) markup is expected.
    <html
      lang={LOCALES[locale].htmlLang}
      className={cn(inter.variable, fraunces.variable, slots.html())}
      suppressHydrationWarning
    >
      <body className={slots.body()}>
        {/*
          `defaultTheme="light"` + `enableSystem={false}` means the site is
          light for everyone until the user explicitly picks Dark — OS
          preference is deliberately ignored.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <JsonLd data={organization()} />
          <JsonLd data={website(locale)} />
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
          {/*
          Vercel Web Analytics + Speed Insights: both render `null` and inject
          their own script, and both wrap themselves in <Suspense> internally,
          which Cache Components requires because they read `useSearchParams()`.

          Production only: preview builds must not add rows to the dataset, and
          `VERCEL_ENV` is evaluated at build time per deployment. The scripts are
          served from `/_vercel/...`, which `src/proxy.ts` already excludes from
          locale routing, so nothing else needs to change for them.
        */}
          {isProduction && (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
