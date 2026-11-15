import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Fraunces, Inter } from "next/font/google";

import { cn, tv } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  HOMEPAGE_TITLE,
  SITE_NAME,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { organization, website } from "@/lib/schema";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOMEPAGE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  // Preview deployments must never compete with production for the same text.
  robots: isProduction ? undefined : { index: false, follow: false },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: HOMEPAGE_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: HOMEPAGE_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  applicationName: SITE_NAME,
  other: {
    "apple-mobile-web-app-title": SITE_NAME,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const slots = appShell();
  return (
    <html
      lang="en"
      className={cn(inter.variable, fraunces.variable, slots.html())}
    >
      <body className={slots.body()}>
        <JsonLd data={organization()} />
        <JsonLd data={website()} />
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
