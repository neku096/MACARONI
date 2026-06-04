import type { Product } from "@/lib/products";
import { getGalleryImages, getLegacyCategoryTag, getRelatedProducts } from "@/lib/products";

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
  const englishDetailArticles = getEnglishDetailArticles(product);

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
              data-i18n-html=""
              data-ja-html={article}
              data-en-html={englishDetailArticles[index] ?? ""}
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
            {relatedProducts.map((related) => {
              const cover = related.coverImage.replace("-800.webp", "-600.webp");
              const srcSet = `${cover} 600w, ${related.coverImage} 800w, ${related.ogImage} 1000w`;

              return (
                <a className="product-card" href={`/products/${related.slug}`} key={related.id}>
                  <img
                    className="product-cover"
                    src={cover}
                    alt={related.shortTitle}
                    srcSet={srcSet}
                    sizes="(max-width: 720px) 52vw, 260px"
                    width="600"
                    height="600"
                    loading="lazy"
                    decoding="async"
                  />
                  <strong>{related.shortTitle}</strong>
                  <small>{getRelatedProductTag(related)}</small>
                </a>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function getRelatedProductTag(product: Product) {
  const labels: Record<Product["category"], string> = {
    material: "素材",
    motion: "汎用",
    pose: "ポーズ",
    "solo-motion": "一人用",
  };

  return labels[product.category];
}

function getEnglishDetailArticles(product: Product) {
  const title = translateProductTitle(product.shortTitle);
  const assetKind = getEnglishAssetKind(product);
  const avatarText = product.avatars.length
    ? product.avatars.map(translateCharacterName).join(" / ")
    : "general avatars";
  const contents = getSpecValue(product, "内容") || product.tags.map(translateShortText).join(", ");
  const usage = getSpecValue(product, "用途") || "VRChat avatar photography, Unity video production, thumbnail creation, and 3D game production";
  const price = getSpecValue(product, "価格") || product.price || "Check BOOTH";
  const requiresModularAvatar = product.tags.some((tag) => tag.includes("Modular Avatar"))
    || product.detailArticles?.some((article) => article.includes("Modular Avatar"));

  return [
    `<h2 id="product-detail-title" class="booth-section-title">Product Details</h2>
            <p class="booth-lead">${title} is an ${assetKind} for VRChat and Unity.</p>
            <p>This page summarizes the BOOTH product information in English. It is intended for ${avatarText} and can be used for <strong>avatar photography</strong>, <strong>Unity video production</strong>, <strong>BOOTH thumbnail creation</strong>, and checking how modified avatars look.</p>
            <p>The included poses, motions, expressions, audio, particles, models, or materials vary by product. Please check the BOOTH product page before purchasing for the latest supported avatars, included files, price, and notes.</p>`,
    `<h2 class="booth-section-title">Setup</h2>
            <ol>
              <li><strong class="booth-step-title">Prepare a Unity 2022 project</strong><span class="booth-step-desc">Use a VRChat avatar project in Unity 2022.${requiresModularAvatar ? " Modular Avatar is expected for this product." : ""}</span></li>
              <li><strong class="booth-step-title">Import the unitypackage</strong><span class="booth-step-desc">Import the purchased unitypackage into your Unity project.</span></li>
              <li><strong class="booth-step-title">Place the included Prefab or settings</strong><span class="booth-step-desc">Follow the BOOTH product page and place the included Prefab, animation, material, or setup files as instructed.</span></li>
              <li><strong class="booth-step-title">Check the supported avatar</strong><span class="booth-step-desc">Confirm the pose, motion, expression, material, or gimmick on the supported avatar before taking photos, recording video, or uploading.</span></li>
              <li><strong class="booth-step-title">Review duplicate controller notes</strong><span class="booth-step-desc">If you already use another Macaroni controller Prefab, check the BOOTH notes before adding another one.</span></li>
            </ol>
            <p class="booth-note">Setup details can differ by product version. Please prioritize the latest BOOTH product page when installing.</p>`,
    `<h2 class="booth-section-title">Included Contents</h2>
            <ul>
              <li><strong>${escapeHtml(contents)}</strong></li>
              <li>unitypackage and setup files listed on the BOOTH product page</li>
              <li>Usage: ${escapeHtml(translateSpecText(usage))}</li>
              <li>Price: ${escapeHtml(price)}</li>
            </ul>`,
    `<h2 class="booth-section-title">FAQ</h2>
            <h3 class="booth-sub-title">Can I use it with a modified avatar?</h3>
            <p>It may work if the avatar is based on a supported model. Depending on body shape, outfit, scale, bones, or material changes, adjustment may be required.</p>
            <h3 class="booth-sub-title">Can I use it outside VRChat?</h3>
            <p>You can use it as a Unity asset for still images, video production, and 3D game production where the license allows it. Please also check the rules of the avatar creator and the platform where you publish.</p>
            <h3 class="booth-sub-title">Is the avatar model included?</h3>
            <p><strong class="booth-negative">No.</strong> Avatar models are not included. Please obtain each avatar from its official page.</p>
            <div class="booth-faq-break" aria-hidden="true"></div>
            <h3 class="booth-sub-title">What should I check before purchasing?</h3>
            <p>Confirm the supported avatar, included files, price, license, setup notes, and latest product information on the BOOTH product page.</p>`,
  ];
}

function getSpecValue(product: Product, label: string) {
  return product.specs.find((spec) => spec.label === label)?.value;
}

function getEnglishAssetKind(product: Product) {
  const labels: Record<Product["category"], string> = {
    material: "R18 material asset",
    motion: "R18 motion asset",
    pose: "R18 pose and expression asset",
    "solo-motion": "R18 solo motion asset",
  };

  return labels[product.category];
}

function translateCharacterName(name: string) {
  const names: Record<string, string> = {
    愛莉: "Airi",
    イチゴ: "Ichigo",
    エク: "Eku",
    クマリ: "Kumaly",
    しお: "Sio",
    しなの: "Shinano",
    ショコラ: "Chocolat",
    "プラム・ショコラ": "Plum / Chocolat",
    セレスティア: "Selestia",
    プラム: "Plum",
    マヌカ: "Manuka",
    真冬: "Mafuyu",
    まよ: "Mayo",
    ミルティナ: "Milltina",
    ミルフィ: "Milfy",
    萌: "Moe",
    ラシューシャ: "Lasyusha",
    ラムネ: "Ramune",
    りりか: "Ririka",
    ルミナ: "Lumina",
    ルルネ: "Rurune",
  };

  return names[name] || name;
}

function translateProductTitle(title: string) {
  const sexyPose = title.match(/^(?:【|〖)(.+?)用(?:\s*\/\s*無料有)?(?:\s*)(?:】|〗)セクシーポーズ(\d+)種＋表情(\d+)種/);

  if (sexyPose) {
    return `${sexyPose[2]} Sexy Poses + ${sexyPose[3]} Expressions for ${translateCharacterName(sexyPose[1])}`;
  }

  const sexyMotion = title.match(/^(?:【|〖)(.+?)用(?:】|〗)セクシーポーズ(\d+)種＋挿入モーション(\d+)種/);

  if (sexyMotion) {
    return `${sexyMotion[2]} Sexy Poses + ${sexyMotion[3]} Motion Animations for ${translateCharacterName(sexyMotion[1])}`;
  }

  const plainSexyPose = title.match(/^(.+?)用 セクシーポーズ(\d+)種＋表情(\d+)種/);

  if (plainSexyPose) {
    return `${plainSexyPose[2]} Sexy Poses + ${plainSexyPose[3]} Expressions for ${translateCharacterName(plainSexyPose[1])}`;
  }

  const plainSexyMotion = title.match(/^(.+?)用 セクシーポーズ(\d+)種＋挿入モーション(\d+)種/);

  if (plainSexyMotion) {
    return `${plainSexyMotion[2]} Sexy Poses + ${plainSexyMotion[3]} Motion Animations for ${translateCharacterName(plainSexyMotion[1])}`;
  }

  return translateShortText(title);
}

function translateSpecText(text: string) {
  const exact: Record<string, string> = {
    "VRChat、Unity 2022、Modular Avatar、アバター撮影、動画制作、3Dゲーム制作向け":
      "VRChat, Unity 2022, Modular Avatar, avatar photography, video production, and 3D game production",
    "VRChatアバター撮影、Unityでの動画制作、3Dシーン作成向け":
      "VRChat avatar photography, Unity video production, and 3D scene creation",
    "VRChatアバター撮影、Unity 2022での動画制作、改変アバターの見え方確認、3Dゲーム制作向け":
      "VRChat avatar photography, Unity 2022 video production, checking modified avatars, and 3D game production",
    "VRChatアバター撮影、Unity 2022での動画制作、R18シーン確認、3Dゲーム制作向け":
      "VRChat avatar photography, Unity 2022 video production, R18 scene checks, and 3D game production",
  };

  return exact[text] || translateShortText(text);
}

function translateShortText(text: string) {
  const replacements: Array<[string, string]> = [
    ["一人エッチモーション", "Solo Motion"],
    ["セクシーアタックモーション", "Sexy Attack Motion"],
    ["セクシーモーション", "Sexy Motion"],
    ["足○キモーション", "Foot Motion"],
    ["手○キモーション", "Hand Motion"],
    ["フ〇ラモーション", "Oral Motion"],
    ["ドスケベマテリアル", "Adult Material"],
    ["対応アバター", "Supported Avatars"],
    ["一人用R18モーション", "Solo R18 motion"],
    ["一人用", "Solo"],
    ["汎用", "General"],
    ["セクシーポーズ", "Sexy Pose"],
    ["表情", "expressions"],
    ["音素材", "audio assets"],
    ["音声", "voice audio"],
    ["音", "audio"],
    ["パーティクル", "particles"],
    ["玩具ギミック", "toy gimmick"],
    ["玩具", "toy"],
    ["アバター撮影", "avatar photography"],
    ["動画制作", "video production"],
    ["サムネイル制作", "thumbnail creation"],
    ["3Dゲーム制作", "3D game production"],
    ["向け", "for"],
    ["用", "for"],
  ];

  return replacements.reduce(
    (result, [jaText, enText]) => result.replaceAll(jaText, enText),
    text.split(" / ").map(translateCharacterName).join(" / "),
  );
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
