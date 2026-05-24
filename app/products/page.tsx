import type { Metadata } from "next";
import { ProductCatalog } from "@/components/ProductCatalog";
import { getPublishedProducts, siteUrl } from "@/lib/products";

const productsTitle = "VRChat・Unity向けR18 3D素材一覧";
const productsDescription =
  "VRChatアバターやUnity向けのR18 3Dポーズ、モーション、マテリアル素材をカテゴリ・タグ・対応アバターで絞り込めます。";
const productsOgImage = `${siteUrl}/Macaroni_Samune/ogp-v4.png`;

export const metadata: Metadata = {
  title: productsTitle,
  description: productsDescription,
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/products`,
    title: `${productsTitle} | マカロニ`,
    description: productsDescription,
    siteName: "マカロニ",
    locale: "ja_JP",
    images: [
      {
        url: productsOgImage,
        width: 1200,
        height: 630,
        alt: "マカロニ BOOTH作品一覧",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${productsTitle} | マカロニ`,
    description: productsDescription,
    images: [productsOgImage],
  },
};

export default function ProductsPage() {
  const products = getPublishedProducts();

  return (
    <main className="booth-list-page">
      <section className="section booth-list-section" aria-label="BOOTH作品一覧">
        <div className="list-page-intro booth-list-intro">
          <div className="booth-list-intro-copy">
            <h1>
              VRChat・Unity向け
              <br />
              R18 3D素材一覧
            </h1>
            <p>ポーズ・モーション・マテリアル素材をサムネイルから確認できます。</p>
          </div>
          <div className="booth-sort-tabs" role="group" aria-label="BOOTH作品表示順">
            <button className="booth-sort-button is-active" type="button" data-booth-sort-button="default" aria-pressed="true">
              通常順
            </button>
            <button className="booth-sort-button" type="button" data-booth-sort-button="popular" aria-pressed="false">
              人気順
            </button>
          </div>
        </div>
        <ProductCatalog products={products} />
      </section>
    </main>
  );
}
