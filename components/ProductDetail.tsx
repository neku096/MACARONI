import { Fragment } from "react";
import type { Product } from "@/lib/products";
import { getGalleryImages, getLegacyCategoryTag, getRelatedProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

type ProductDetailProps = {
  product: Product;
};

const categoryLabels: Record<string, string> = {
  pose: "ポーズ",
  universal: "汎用",
  solo: "一人用",
  material: "マテリアル",
};

export function ProductDetail({ product }: ProductDetailProps) {
  const gallery = getGalleryImages(product);
  const mainImage = gallery[0] ?? {
    src: product.coverImage,
    thumb: product.coverImage.replace("-800.webp", "-600.webp"),
    alt: product.shortTitle,
  };
  const relatedProducts = getRelatedProducts(product);
  const summaryTags = product.summaryTags?.length ? product.summaryTags : [...product.avatars, ...product.tags].slice(0, 12);
  const categoryTag = getLegacyCategoryTag(product);

  return (
    <main className="product-page">
      <section className="section product-hero" aria-labelledby="product-title">
        <div className="product-gallery" data-product-gallery="" aria-label="商品画像ギャラリー">
          <figure className="product-main-figure">
            <button
              className="product-main-button"
              type="button"
              data-gallery-open=""
              aria-label={`${product.shortTitle}の商品画像を拡大表示`}
            >
              <img
                data-product-main-image=""
                src={mainImage.src}
                srcSet={`${mainImage.thumb} 600w, ${mainImage.src} 1000w`}
                sizes="(max-width: 720px) 100vw, 620px"
                width="1000"
                height="1000"
                alt={mainImage.alt}
                decoding="async"
                fetchPriority="high"
              />
            </button>
          </figure>
          <div className="product-thumbnail-slider">
            <button className="product-thumbnail-arrow" type="button" data-gallery-inline-prev="" aria-label="前のサムネイルへ">
              ‹
            </button>
            <div className="product-thumbnails" data-gallery-inline-thumbs="" aria-label="サムネイル" />
            <button className="product-thumbnail-arrow" type="button" data-gallery-inline-next="" aria-label="次のサムネイルへ">
              ›
            </button>
          </div>
          <p className="product-media-note">クリックして拡大できます。</p>
        </div>

        <aside className="product-summary" aria-label="商品情報">
          <nav className="product-summary-breadcrumb" aria-label="作品カテゴリ">
            <a href="/products" aria-label="BOOTH">
              BOOTH作品一覧
            </a>
            <span aria-hidden="true">›</span>
            <a href={`/products?tag=${categoryTag}`}>{categoryLabels[categoryTag] ?? product.categoryLabel}</a>
            {product.subTags?.slice(0, 20).map((tag) => (
              <Fragment key={tag.href}>
                <span aria-hidden="true">›</span>
                <a href={tag.href}>{tag.label}</a>
              </Fragment>
            ))}
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

      <script
        type="application/json"
        id="product-gallery-data"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallery) }}
      />

      <section className="section product-detail-section" aria-labelledby="product-detail-title">
        <div className="product-detail-grid">
          {(product.detailArticles?.length ? product.detailArticles : []).map((article, index) => (
            <article
              className="product-detail-block booth-description"
              key={index}
              dangerouslySetInnerHTML={{ __html: article }}
            />
          ))}
        </div>
      </section>

      {product.normalTags?.length || product.subTags?.length ? (
        <section className="section product-tag-section" aria-label="この商品のタグ">
          {product.normalTags?.length ? (
            <>
              <p className="booth-subtag-heading">通常タグ</p>
              <div className="product-tag-list">
                {product.normalTags.map((tag) => (
                  <a className="product-tag" href={tag.href} key={tag.href}>
                    {tag.label}
                  </a>
                ))}
              </div>
            </>
          ) : null}
          {product.subTags?.length ? (
            <>
              <p className="booth-subtag-heading">サブタグ</p>
              <div className="product-tag-list">
                {product.subTags.map((tag) => (
                  <a className="product-tag" href={tag.href} key={tag.href}>
                    {tag.label}
                  </a>
                ))}
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      {relatedProducts.length > 0 ? (
        <section className="section product-related-section" aria-labelledby="product-related-title">
          <div className="section-heading">
            <div>
              <h2 id="product-related-title">関連商品</h2>
            </div>
            <a className="button secondary" href="/products">
              BOOTH作品一覧へ
            </a>
          </div>
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
