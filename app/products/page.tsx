import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCatalog } from "@/components/ProductCatalog";
import { getFilterOptions, getPublishedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "VRChat・Unity向けR18 3D素材一覧",
  description: "VRChatアバターやUnity向けのR18 3Dポーズ、モーション、マテリアル素材をカテゴリ・タグ・対応アバターで絞り込めます。",
  alternates: {
    canonical: "/products",
  },
};

export default function ProductsPage() {
  const products = getPublishedProducts();
  const options = getFilterOptions();

  return (
    <main className="booth-list-page">
      <section className="section booth-list-section" aria-label="BOOTH作品一覧">
        <div className="list-page-intro booth-list-intro">
          <div className="booth-list-intro-copy">
            <p className="eyebrow">BOOTH PRODUCTS</p>
            <h1>
              VRChat・Unity向け
              <br />
              R18 3D素材一覧
            </h1>
            <p>アバター撮影、動画制作、3Dゲーム制作向けの素材をカテゴリ、タグ、対応キャラで絞り込めます。</p>
          </div>
        </div>
        <Suspense fallback={<p className="booth-list-help">商品一覧を読み込んでいます。</p>}>
          <ProductCatalog products={products} categories={options.categories} tags={options.tags} avatars={options.avatars} />
        </Suspense>
      </section>
    </main>
  );
}
