import Link from "next/link";
import type { Product } from "@/lib/products";
import { getGalleryImages, getRelatedProducts } from "@/lib/products";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductLegacyCollapses } from "@/components/ProductLegacyCollapses";
import { ProductCard } from "@/components/ProductCard";

type ProductDetailProps = {
  product: Product;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const gallery = getGalleryImages(product);
  const galleryImages =
    gallery.length > 0
      ? gallery
      : [
          {
            src: product.coverImage,
            thumb: product.coverImage,
            alt: product.shortTitle,
          },
        ];
  const relatedProducts = getRelatedProducts(product);
  const summaryTags = product.summaryTags?.length
    ? product.summaryTags
    : [...product.avatars, ...product.tags].slice(0, 12);
  const categoryMeta = getCategoryMeta(product);
  const showTagSection = product.category !== "material" && Boolean(categoryMeta);

  return (
    <main className="product-page">
      <section className="section product-hero" aria-labelledby="product-title">
        <ProductGallery images={galleryImages} title={product.shortTitle} />

        <aside className="product-summary" aria-label="商品情報">
          <nav className="product-summary-breadcrumb" aria-label="作品カテゴリ">
            <Link href="/products">BOOTH作品一覧</Link>
            {categoryMeta ? (
              <>
                <span aria-hidden="true">›</span>
                <Link href={`/products?category=${categoryMeta.query}`}>{categoryMeta.label}</Link>
              </>
            ) : null}
            {product.avatars.map((avatar, index) => (
              <BreadcrumbAvatarLink
                avatar={avatar}
                categoryQuery={getBreadcrumbAvatarCategoryQuery(product)}
                isFirst={index === 0}
                key={`${avatar}-${index}`}
              />
            ))}
          </nav>
          <h1 id="product-title">{product.title}</h1>
          <div className="product-summary-tags" aria-label="商品キーワード">
            {summaryTags.map((tag, index) => (
              <span key={`${tag}-${index}`}>{tag}</span>
            ))}
          </div>
          <dl className="product-specs">
            {product.specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                {spec.label === "対応アバター" && product.avatars.length >= 8 ? (
                  <dd className="product-avatar-list">
                    <span className="product-avatar-count">{product.avatars.length}アバター対応</span>
                    <span className="product-avatar-list-content" aria-label="対応アバター一覧">
                      {product.avatars.map((avatar, index) => (
                        <AvatarListItem
                          avatar={avatar}
                          isLast={index === product.avatars.length - 1}
                          key={`${avatar}-${index}`}
                        />
                      ))}
                    </span>
                  </dd>
                ) : (
                  <dd>{spec.value}</dd>
                )}
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
            {product.purchaseNote ??
              "購入前に、対応アバター、同梱ファイル、価格、利用条件、注意事項をBOOTHの商品ページでご確認ください。"}
          </p>
        </aside>
      </section>

      <section className="section product-detail-section" aria-labelledby="product-detail-title">
        {product.detailSections?.length ? (
          <div className="product-detail-grid">
            {product.detailSections.map((section, index) => (
              <article
                className="product-detail-block booth-description"
                dangerouslySetInnerHTML={{ __html: section.html }}
                key={`${section.title}-${index}`}
              />
            ))}
          </div>
        ) : (
          <FallbackDetailSections product={product} />
        )}
      </section>

      {showTagSection && categoryMeta ? (
        <section className="section product-tag-section" aria-label="この商品のタグ">
          <p className="booth-subtag-heading">通常タグ</p>
          <div className="product-tag-list">
            <Link className="product-tag" href={`/products?category=${categoryMeta.query}`}>
              {categoryMeta.label}
            </Link>
          </div>
          {product.avatars.length > 0 ? (
            <>
              <p className="booth-subtag-heading">サブタグ</p>
              <div className="product-tag-list">
                {product.avatars.map((avatar, index) => (
                  <Link
                    className="product-tag"
                    href={`/products?subtag=${getCharacterSubtag(avatar)}`}
                    key={`${avatar}-${index}`}
                  >
                    {avatar}
                  </Link>
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
            <Link className="button secondary" href="/products">
              BOOTH作品一覧へ
            </Link>
          </div>
          <div className="product-related-grid">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      ) : null}
      <ProductLegacyCollapses />
    </main>
  );
}

function FallbackDetailSections({ product }: ProductDetailProps) {
  return (
    <div className="product-detail-grid">
      <article className="product-detail-block booth-description">
        <h2 id="product-detail-title" className="booth-section-title">
          商品詳細
        </h2>
        <p className="booth-lead">{product.description}</p>
        <p>
          VRChatでのアバター撮影、Unity動画制作、BOOTH用サムネイル制作、改変後の見え方チェックなどに使いやすい素材です。
        </p>
        {product.avatars.length > 0 ? (
          <p>
            対応アバターは <strong>{product.avatars.join(" / ")}</strong> です。導入前にBOOTH側の最新説明も確認してください。
          </p>
        ) : (
          <p>汎用素材として使いやすい構成ですが、導入前に利用環境とBOOTH側の最新説明を確認してください。</p>
        )}
      </article>

      <article className="product-detail-block booth-description">
        <h2 className="booth-section-title">導入方法</h2>
        <ol>
          <li>
            <strong className="booth-step-title">Unity 2022のプロジェクトを用意</strong>
            <span className="booth-step-desc">BOOTH商品側で指定されている導入環境を確認します。</span>
          </li>
          <li>
            <strong className="booth-step-title">unitypackageやPrefabをインポート</strong>
            <span className="booth-step-desc">購入したファイルをProjectへ入れ、同梱説明に沿って配置します。</span>
          </li>
        </ol>
      </article>
    </div>
  );
}

function BreadcrumbAvatarLink({
  avatar,
  categoryQuery,
  isFirst,
}: {
  avatar: string;
  categoryQuery: string | null;
  isFirst: boolean;
}) {
  const subtag = getCharacterSubtag(avatar);
  const params = new URLSearchParams();

  if (categoryQuery) {
    params.set("category", categoryQuery);
  }

  if (subtag) {
    params.set("subtag", subtag);
  }

  return (
    <>
      <span aria-hidden="true">{isFirst ? "›" : "/"}</span>
      <Link href={`/products?${params.toString()}`}>{avatar}</Link>
    </>
  );
}

function AvatarListItem({ avatar, isLast }: { avatar: string; isLast: boolean }) {
  return (
    <>
      <span className="product-avatar-list-item">{avatar}</span>
      {isLast ? null : (
        <span className="product-avatar-separator" aria-hidden="true">
          /
        </span>
      )}
    </>
  );
}

function getCategoryMeta(product: Product) {
  if (product.category === "material") {
    return null;
  }

  if (product.category === "motion") {
    return {
      label: "汎用",
      query: "universal",
    };
  }

  if (product.category === "solo-motion") {
    return {
      label: "一人用",
      query: "solo",
    };
  }

  return {
    label: "ポーズ",
    query: "pose",
  };
}

function getBreadcrumbAvatarCategoryQuery(product: Product) {
  if (product.category === "pose") {
    return "pose";
  }

  if (product.category === "solo-motion") {
    return "solo";
  }

  return null;
}

function getCharacterSubtag(avatar: string) {
  return characterSubtagsByAvatar[avatar] ?? "";
}

const characterSubtagsByAvatar: Record<string, string> = {
  愛莉: "character-airi",
  イチゴ: "character-ichigo",
  エク: "character-eku",
  クマリ: "character-kumaly",
  しお: "character-sio",
  しなの: "character-shinano",
  ショコラ: "character-chocolat",
  セレスティア: "character-selestia",
  プラム: "character-plum",
  マヌカ: "character-manuka",
  真冬: "character-mafuyu",
  まよ: "character-mayo",
  ミルティナ: "character-milltina",
  ミルフィ: "character-milfy",
  萌: "character-moe",
  ラシューシャ: "character-lasyusha",
  ラムネ: "character-ramune",
  りりか: "character-ririka",
  ルミナ: "character-lumina",
  ルルネ: "character-rurune",
};
