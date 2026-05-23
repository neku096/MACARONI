import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getPublishedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "VRChat・Unity向けR18無料3Dポーズ素材",
  description: "VRChat・Unity向けのR18 3Dポーズ、モーション、マテリアル素材を一覧で確認できるマカロニの商品サイトです。",
};

export default function HomePage() {
  const products = getPublishedProducts();
  const featuredProducts = products.slice(0, 10);

  return (
    <main>
      <section className="section sales-band sales-band-top" aria-labelledby="works-title">
        <div className="next-home-hero">
          <p className="eyebrow">MACARONI PRODUCTS</p>
          <h1 id="works-title">VRChat・Unity向けR18 3D素材</h1>
          <p>
            アバター撮影、動画制作、3Dゲーム制作に使いやすいポーズ、モーション、マテリアル素材をまとめています。
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/products">
              商品一覧を見る
            </Link>
            <a className="button ghost" href="https://macaronin.booth.pm/" target="_blank" rel="noopener noreferrer">
              BOOTHへ
            </a>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="featured-title">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">FEATURED</p>
            <h2 id="featured-title">おすすめ商品</h2>
          </div>
          <Link className="text-link" href="/products">
            すべて見る
          </Link>
        </div>
        <div className="next-product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
