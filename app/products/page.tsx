import type { Metadata } from "next";
import { ProductCatalog } from "@/components/ProductCatalog";
import { getPublishedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "VRChat・Unity向けR18 3D素材一覧",
  description: "VRChatアバターやUnity向けのR18 3Dポーズ、モーション、マテリアル素材をカテゴリ・タグ・対応アバターで絞り込めます。",
  alternates: {
    canonical: "/products",
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
