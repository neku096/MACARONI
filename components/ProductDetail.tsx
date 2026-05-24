import Link from "next/link";
import type { Product } from "@/lib/products";
import { getGalleryImages, getRelatedProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

type ProductDetailProps = {
  product: Product;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const gallery = getGalleryImages(product);
  const mainImage = gallery[0] ?? {
    src: product.coverImage,
    thumb: product.coverImage,
    alt: product.shortTitle,
  };
  const relatedProducts = getRelatedProducts(product);
  const summaryTags = [...product.avatars, ...product.tags].slice(0, 12);

  return (
    <main className="product-page">
      <section className="section product-hero" aria-labelledby="product-title">
        <div className="product-gallery" aria-label="商品画像ギャラリー">
          <figure className="product-main-figure">
            <a className="product-main-button" href={mainImage.src} target="_blank" rel="noopener noreferrer">
              <img
                src={mainImage.src}
                srcSet={`${mainImage.thumb} 600w, ${mainImage.src} 1000w`}
                sizes="(max-width: 720px) 100vw, 620px"
                width="1000"
                height="1000"
                alt={mainImage.alt}
                decoding="async"
                fetchPriority="high"
              />
            </a>
          </figure>
          <div className="product-thumbnail-slider" aria-label="サムネイルスライダー">
            <div className="product-thumbnails next-product-thumbnails" aria-label="サムネイル">
              {gallery.map((image, index) => (
                <a
                  className={`product-thumbnail${index === 0 ? " is-active" : ""}`}
                  href={image.src}
                  key={image.src}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={image.thumb} alt={`${image.alt} サムネイル`} width="600" height="600" loading="lazy" />
                </a>
              ))}
            </div>
          </div>
          <p className="product-media-note">画像クリックで拡大表示できます。</p>
        </div>

        <aside className="product-summary" aria-label="商品情報">
          <nav className="product-summary-breadcrumb" aria-label="作品カテゴリ">
            <Link href="/products">BOOTH作品一覧</Link>
            <span aria-hidden="true">›</span>
            <Link href={`/products?category=${product.category}`}>{product.categoryLabel}</Link>
          </nav>
          <h1 id="product-title">{product.title}</h1>
          <div className="product-summary-tags" aria-label="商品キーワード">
            {summaryTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <dl className="product-specs">
            {product.specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
          <div className="product-actions">
            {product.salesLinks.map((link) => (
              <a
                className={`button ${link.primary ? "primary" : "ghost"} product-buy-button`}
                href={link.url}
                key={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label === "BOOTH" ? "BOOTHで購入する" : `${link.label}で見る`}
              </a>
            ))}
          </div>
          <p className="product-note">
            購入前に、対応アバター、同梱ファイル、価格、利用条件、注意事項をBOOTHの商品ページでご確認ください。
          </p>
        </aside>
      </section>

      <section className="section product-detail-section" aria-labelledby="product-detail-title">
        <div className="product-detail-grid">
          <article className="product-detail-block booth-description">
            <h2 id="product-detail-title" className="booth-section-title">
              商品詳細
            </h2>
            <p className="booth-lead">{product.description}</p>
            <p>
              VRChatでのアバター撮影、Unity動画制作、BOOTH用サムネイル制作、改変後の見え方チェックなどに使いやすい素材です。
            </p>
            <p>
              商品画像で雰囲気やシルエットを確認しながら、使いたいアバターや制作シーンに合う素材を選べます。
            </p>
            {product.avatars.length > 0 ? (
              <p>
                対応アバターは <strong>{product.avatars.join(" / ")}</strong> です。導入前にBOOTH側の最新説明も確認してください。
              </p>
            ) : (
              <p>汎用素材として使いやすい構成ですが、導入前に利用環境とBOOTH側の最新説明を確認してください。</p>
            )}
            <p className="booth-note">
              同梱内容や最新の<strong>注意事項</strong>については、<strong>BOOTHの商品ページ</strong>をご確認ください。
            </p>
          </article>

          <article className="product-detail-block booth-description">
            <h2 className="booth-section-title">導入・確認ポイント</h2>
            <ol>
              <li>
                <strong className="booth-step-title">Unity 2022のプロジェクトを用意</strong>
                <span className="booth-step-desc">Modular Avatarなど、BOOTH商品側で指定されている導入環境を確認します。</span>
              </li>
              <li>
                <strong className="booth-step-title">unitypackageやPrefabをインポート</strong>
                <span className="booth-step-desc">購入したファイルをProjectへ入れ、同梱説明に沿って配置します。</span>
              </li>
              <li>
                <strong className="booth-step-title">対応アバター上でPreview確認</strong>
                <span className="booth-step-desc">撮影や動画制作の前に、見え方、表情、音、ギミックの動作を確認します。</span>
              </li>
              <li>
                <strong className="booth-step-title">利用条件を確認</strong>
                <span className="booth-step-desc">商用利用、改変、再配布可否などはBOOTHの商品ページと利用規約を優先してください。</span>
              </li>
            </ol>
          </article>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="section product-related-section" aria-labelledby="product-related-title">
          <h2 id="product-related-title">関連商品</h2>
          <div className="product-related-grid">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
