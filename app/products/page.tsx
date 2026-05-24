import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCatalog } from "@/components/ProductCatalog";
import { getFilterOptions, getPublishedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "VRChat・Unity向けR18 3Dポーズ/モーション素材一覧 | BOOTH作品",
  description:
    "VRChatアバターやUnity向けのR18 3Dポーズ、セクシーモーション、一人用モーション、マテリアル素材を一覧で確認できます。BOOTH購入前に画像、対応内容、関連商品を見比べられる作品ページです。",
  alternates: {
    canonical: "/products",
    languages: {
      ja: "/products",
      en: "/en/booth.html",
      "x-default": "/products",
    },
  },
};

export default function ProductsPage() {
  const products = getPublishedProducts();
  const { avatars } = getFilterOptions();

  return (
    <main className="booth-list-page">
      <section className="section booth-list-section" aria-label="BOOTH作品一覧">
        <Suspense fallback={<p className="booth-list-help">商品一覧を読み込んでいます。</p>}>
          <ProductCatalog products={products} avatars={avatars} />
        </Suspense>
      </section>
    </main>
  );
}
