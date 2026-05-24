import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AgeGate } from "@/components/AgeGate";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteUrl } from "@/lib/products";
import "../styles.css";
import "./next.css";

const ageGateBootScript = `(() => {
  try {
    if (localStorage.getItem("ageConfirmed") === "true") {
      document.documentElement.classList.add("age-confirmed");
    }
  } catch {
    document.documentElement.classList.remove("age-confirmed");
  }
})();`;

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: "マカロニ | VRChat・Unity向けR18 3D素材",
    template: "%s | マカロニ",
  },
  description: "VRChat・Unity向けのR18 3Dポーズ、モーション、マテリアル素材を一覧で確認できるマカロニの商品サイトです。",
  applicationName: "マカロニ",
  authors: [{ name: "マカロニ" }],
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
    siteName: "マカロニ",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ageGateBootScript }} />
      </head>
      <body>
        <AgeGate />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
