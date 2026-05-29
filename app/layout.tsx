import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/JsonLd";
import {
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  SEO_TITLE,
  SITE_NAME,
  SITE_URL,
  buildWebApplicationJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SEO_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: "introvista", url: "https://introvista.ai" }],
  creator: "introvista",
  publisher: "introvista",
  category: "抽獎工具",
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
  other: {
    "ai-content-declaration": "human-created",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c00000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [buildWebApplicationJsonLd(), buildWebPageJsonLd()];

  return (
    <html lang="zh-Hant">
      <body className="min-h-screen antialiased">
        <JsonLd data={jsonLd} />
        {children}
      </body>
    </html>
  );
}
