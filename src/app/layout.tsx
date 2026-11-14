import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Fraunces, Inter } from "next/font/google";

import { cn, tv } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Global Connect — Your next global opportunity",
    template: "%s · Global Connect",
  },
  description:
    "Discover international opportunities, online sessions, guides, and a global youth community. Exchanges, scholarships, conferences and volunteering for young people.",
  openGraph: {
    title: "Global Connect — Your next global opportunity",
    description:
      "Discover international opportunities, online sessions, guides, and a global youth community. Exchanges, scholarships, conferences and volunteering for young people.",
    siteName: "Global Connect",
    type: "website",
    locale: "en_US",
  },
  other: {
    "apple-mobile-web-app-title": "Global Connect",
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
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
