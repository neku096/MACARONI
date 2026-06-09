import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { AgeGate } from "@/components/AgeGate";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteUrl } from "@/lib/products";
import "../styles.css";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: "R18無料3Dポーズ素材 | VRChat・Unity向けポーズ集 - MACARONI",
    template: "%s | MACARONI",
  },
  description: "VRChat・Unity向けのR18無料3Dポーズ素材を配布。成人向けイラスト制作、ゲーム制作、動画制作に利用できるポーズ・モーション素材を掲載しています。",
  applicationName: "MACARONI",
  authors: [{ name: "MACARONI" }],
  referrer: "no-referrer",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=20260516", sizes: "any" },
      { url: "/images/favicon-32x32.png?v=20260516", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-16x16.png?v=20260516", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/images/apple-touch-icon.png?v=20260516", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest?v=20260516",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "MACARONI",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <Script src="/age-gate-boot.js?v=20260516" strategy="beforeInteractive" />
        <AgeGate />
        <SiteHeader />
        {children}
        <SiteFooter />
        <Script src="/script.js?v=26" strategy="afterInteractive" />
      </body>
    </html>
  );
}
