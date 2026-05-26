"use client";

import { useMemo, useState } from "react";
import type { Product, ProductCategory } from "@/lib/products";

type AdminProductEditorProps = {
  products: Product[];
};

type EditableProduct = Product & {
  noindex?: boolean;
};

type SaveState =
  | { status: "idle"; message: string }
  | { status: "saving"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const categoryOptions: Array<{ value: ProductCategory; label: string }> = [
  { value: "pose", label: "ポーズ" },
  { value: "motion", label: "モーション" },
  { value: "solo-motion", label: "一人用" },
  { value: "material", label: "マテリアル" },
];

const categoryLabelMap: Record<ProductCategory, string> = {
  pose: "ポーズ",
  motion: "モーション",
  "solo-motion": "一人用",
  material: "マテリアル",
};

export function AdminProductEditor({ products: initialProducts }: AdminProductEditorProps) {
  const [products, setProducts] = useState<EditableProduct[]>(() => cloneProducts(initialProducts));
  const [selectedId, setSelectedId] = useState(initialProducts[0]?.id ?? "");
  const [newProductIds, setNewProductIds] = useState<Set<string>>(() => new Set());
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle", message: "" });

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? products[0],
    [products, selectedId],
  );
  const publishedProducts = useMemo(() => products.filter((product) => product.published), [products]);
  const draftProducts = useMemo(() => products.filter((product) => !product.published), [products]);

  if (!selectedProduct) {
    return (
      <div className="admin-empty">
        <p>編集できる商品がありません。</p>
        <button className="button primary" type="button" onClick={createNewProduct}>
          新規商品作成
        </button>
      </div>
    );
  }

  const isNewProduct = newProductIds.has(selectedProduct.id);
  const detailArticles = selectedProduct.detailArticles ?? [];
  const faqArticleIndex = detailArticles.findIndex((article) => /<h2[^>]*>\s*FAQ\s*<\/h2>/i.test(article));
  const faqArticle = faqArticleIndex >= 0 ? detailArticles[faqArticleIndex] : "";
  const slugDuplicate = products.some(
    (product) => product.id !== selectedProduct.id && product.slug === selectedProduct.slug,
  );
  const relatedIdWarnings = selectedProduct.relatedIds.filter(
    (relatedId) => !products.some((product) => product.id === relatedId),
  );
  const galleryPreview = previewGalleryPaths(selectedProduct, 8);
  const usedSlugs = products.map((product) => product.slug).sort((a, b) => a.localeCompare(b));

  function createNewProduct() {
    const product = createDraftProduct(products);

    setProducts((currentProducts) => [product, ...currentProducts]);
    setSelectedId(product.id);
    setNewProductIds((currentIds) => new Set(currentIds).add(product.id));
    setSaveState({
      status: "idle",
      message: "新規draftを作成しました。画像とBOOTHリンクを確認してから保存してください。",
    });
  }

  function updateSelected(update: (product: EditableProduct) => EditableProduct) {
    setProducts((currentProducts) =>
      currentProducts.map((product) => (product.id === selectedProduct.id ? update(product) : product)),
    );
    setSaveState({ status: "idle", message: "" });
  }

  function updateField<K extends keyof EditableProduct>(key: K, value: EditableProduct[K]) {
    updateSelected((product) => ({ ...product, [key]: value }));
  }

  function updateCategory(category: ProductCategory) {
    updateSelected((product) => ({
      ...product,
      category,
      categoryLabel: categoryLabelMap[category],
      normalTags: [{ href: `/products?tag=${category}`, label: categoryLabelMap[category] }],
    }));
  }

  function updateSlug(nextValue: string) {
    const nextSlug = nextValue.trim();

    if (!isNewProduct || !nextSlug) {
      updateField("slug", nextSlug);
      return;
    }

    const previousId = selectedProduct.id;
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === previousId
          ? {
              ...product,
              id: nextSlug,
              slug: nextSlug,
              legacyPath: `product-${nextSlug}.html`,
              galleryPrefix: product.galleryPrefix === product.slug ? nextSlug : product.galleryPrefix,
            }
          : product,
      ),
    );
    setSelectedId(nextSlug);
    setNewProductIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.delete(previousId);
      nextIds.add(nextSlug);
      return nextIds;
    });
    setSaveState({ status: "idle", message: "" });
  }

  function syncCoverWithGallery() {
    const firstImage = firstGalleryImage(selectedProduct);

    updateSelected((product) => ({
      ...product,
      coverImage: firstImage.src,
      ogImage: firstImage.src,
    }));
  }

  function resetGalleryFromSlug() {
    updateSelected((product) => ({
      ...product,
      galleryPrefix: product.slug,
      galleryCount: Math.max(1, product.galleryCount || 1),
      galleryNumbers: undefined,
    }));
  }

  function appendMissingTemplates() {
    const existingTitles = new Set(detailArticles.map(extractSectionTitle).filter(Boolean));
    const templates = createDetailArticleTemplates(selectedProduct);
    const missingTemplates = templates.filter((template) => !existingTitles.has(extractSectionTitle(template)));

    if (missingTemplates.length) {
      updateField("detailArticles", [...detailArticles, ...missingTemplates]);
    }
  }

  async function saveProduct() {
    setSaveState({ status: "saving", message: "保存中です..." });

    try {
      const response = await fetch("/api/admin/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalId: isNewProduct ? undefined : selectedProduct.id,
          product: selectedProduct,
        }),
      });
      const result = (await response.json()) as { products?: EditableProduct[]; message?: string };

      if (!response.ok || !result.products) {
        throw new Error(result.message || "保存に失敗しました。");
      }

      setProducts(result.products);
      setSelectedId(selectedProduct.id);
      setNewProductIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(selectedProduct.id);
        return nextIds;
      });
      setSaveState({ status: "success", message: "products.json を更新しました。" });
    } catch (error) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "保存に失敗しました。",
      });
    }
  }

  return (
    <div className="admin-grid">
      <aside className="admin-sidebar" aria-label="商品一覧">
        <div className="admin-sidebar-heading">
          <div>
            <h2>商品一覧</h2>
            <span>{products.length}件</span>
          </div>
          <button className="button compact" type="button" onClick={createNewProduct}>
            新規商品作成
          </button>
        </div>
        <div className="admin-product-list">
          <ProductListGroup
            products={draftProducts}
            selectedId={selectedProduct.id}
            title="Draft"
            onSelect={setSelectedId}
          />
          <ProductListGroup
            products={publishedProducts}
            selectedId={selectedProduct.id}
            title="Published"
            onSelect={setSelectedId}
          />
        </div>
      </aside>

      <section className="admin-editor" aria-label={`${selectedProduct.shortTitle}の編集`}>
        <div className="admin-editor-header">
          <div>
            <p className="admin-kicker">{isNewProduct ? "New Draft" : "Editing"}</p>
            <h2>{selectedProduct.shortTitle || selectedProduct.title}</h2>
          </div>
          <a className="button compact" href={`/products/${selectedProduct.slug}`} target="_blank" rel="noreferrer">
            LPを開く
          </a>
        </div>

        <div className="admin-notice">
          <strong>商品追加メモ</strong>
          <span>
            新規商品は draft / noindex で作成します。slug変更後は旧URL redirectの追加が必要か確認してください。
          </span>
        </div>

        <div className="admin-card">
          <h3>基本情報</h3>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span>title</span>
              <input value={selectedProduct.title} onChange={(event) => updateField("title", event.target.value)} />
            </label>
            <label className="admin-field">
              <span>shortTitle</span>
              <input
                value={selectedProduct.shortTitle}
                onChange={(event) => updateField("shortTitle", event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>slug</span>
              <input value={selectedProduct.slug} onChange={(event) => updateSlug(event.target.value)} />
            </label>
            <label className="admin-field">
              <span>legacyPath</span>
              <input
                value={selectedProduct.legacyPath}
                onChange={(event) => updateField("legacyPath", event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>category</span>
              <select value={selectedProduct.category} onChange={(event) => updateCategory(event.target.value as ProductCategory)}>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>price</span>
              <input value={selectedProduct.price} onChange={(event) => updateField("price", event.target.value)} />
            </label>
          </div>

          <div className="admin-checks">
            <label className="admin-check-row">
              <input
                type="checkbox"
                checked={selectedProduct.published}
                onChange={(event) => updateField("published", event.target.checked)}
              />
              <span>published</span>
            </label>
            <label className="admin-check-row">
              <input
                type="checkbox"
                checked={Boolean(selectedProduct.noindex)}
                onChange={(event) => updateField("noindex", event.target.checked || undefined)}
              />
              <span>noindex</span>
            </label>
            {!selectedProduct.published ? <span className="admin-badge is-draft">draft</span> : null}
            {selectedProduct.noindex ? <span className="admin-badge">noindex</span> : null}
          </div>

          <div className="admin-warning-list" aria-live="polite">
            {slugDuplicate ? <p>slugが重複しています。保存前に別slugへ変更してください。</p> : null}
            {!isNewProduct ? <p>公開済み商品のslug変更は旧URL redirectの確認が必要です。</p> : null}
          </div>

          <details className="admin-used-slugs">
            <summary>使用済みslugを表示</summary>
            <div>
              {usedSlugs.map((slug) => (
                <code key={slug}>{slug}</code>
              ))}
            </div>
          </details>
        </div>

        <div className="admin-card">
          <div className="admin-card-heading">
            <h3>画像・ギャラリー</h3>
            <div className="admin-button-row">
              <button className="button compact" type="button" onClick={resetGalleryFromSlug}>
                slugから一括生成
              </button>
              <button className="button compact" type="button" onClick={syncCoverWithGallery}>
                coverをgallery[0]に同期
              </button>
            </div>
          </div>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span>coverImage</span>
              <input
                value={selectedProduct.coverImage}
                onChange={(event) => updateField("coverImage", event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>ogImage</span>
              <input value={selectedProduct.ogImage} onChange={(event) => updateField("ogImage", event.target.value)} />
            </label>
            <label className="admin-field">
              <span>galleryPrefix</span>
              <input
                value={selectedProduct.galleryPrefix}
                onChange={(event) => updateField("galleryPrefix", event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>galleryCount</span>
              <input
                min="0"
                max="100"
                type="number"
                value={selectedProduct.galleryCount}
                onChange={(event) => updateField("galleryCount", Number(event.target.value))}
              />
            </label>
            <label className="admin-field admin-field-wide">
              <span>galleryNumbers</span>
              <input
                placeholder="例: 1, 2, 5。空欄なら1からgalleryCountまで自動生成"
                value={selectedProduct.galleryNumbers?.join(", ") ?? ""}
                onChange={(event) => updateField("galleryNumbers", parseNumberList(event.target.value))}
              />
            </label>
          </div>
          <div className="admin-path-preview" aria-label="生成される画像パス">
            {galleryPreview.map((image) => (
              <div key={image.src}>
                <span>src</span>
                <code>{image.src}</code>
                <span>thumb</span>
                <code>{image.thumb}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3>タグ・説明文</h3>
          <label className="admin-field">
            <span>tags（1行に1つ）</span>
            <textarea
              rows={6}
              value={selectedProduct.tags.join("\n")}
              onChange={(event) => updateField("tags", parseTextList(event.target.value))}
            />
          </label>
          <label className="admin-field">
            <span>avatars（1行に1つ）</span>
            <textarea
              rows={4}
              value={selectedProduct.avatars.join("\n")}
              onChange={(event) => updateField("avatars", parseTextList(event.target.value))}
            />
          </label>
          <label className="admin-field">
            <span>description</span>
            <textarea
              rows={5}
              value={selectedProduct.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </label>
        </div>

        <div className="admin-card">
          <h3>関連商品</h3>
          <label className="admin-field">
            <span>relatedIds（1行に1つ）</span>
            <textarea
              rows={5}
              value={selectedProduct.relatedIds.join("\n")}
              onChange={(event) => updateField("relatedIds", parseTextList(event.target.value))}
            />
          </label>
          {relatedIdWarnings.length ? (
            <p className="admin-inline-warning">存在しないrelatedIds: {relatedIdWarnings.join(", ")}</p>
          ) : (
            <p className="admin-help">空欄なら関連商品なし。公開前に4件以内を目安に設定してください。</p>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-heading">
            <h3>商品詳細・FAQ HTML</h3>
            <div className="admin-button-row">
              <button
                className="button compact"
                type="button"
                onClick={() =>
                  updateField("detailArticles", [
                    ...detailArticles,
                    '<h2 class="booth-section-title">新規セクション</h2>\n<p></p>',
                  ])
                }
              >
                セクション追加
              </button>
              <button className="button compact" type="button" onClick={appendMissingTemplates}>
                不足テンプレ追加
              </button>
            </div>
          </div>
          {detailArticles.map((article, index) => (
            <label className="admin-field" key={`${extractSectionTitle(article)}-${index}`}>
              <span>{extractSectionTitle(article) || `section ${index + 1}`}</span>
              <textarea
                rows={index === faqArticleIndex ? 12 : 9}
                value={article}
                onChange={(event) => {
                  const nextArticles = [...detailArticles];
                  nextArticles[index] = event.target.value;
                  updateField("detailArticles", nextArticles);
                }}
              />
            </label>
          ))}
        </div>

        <div className="admin-card admin-preview">
          <h3>簡易プレビュー</h3>
          <div className="admin-preview-panel">
            <h4>{selectedProduct.title}</h4>
            <p>{selectedProduct.description}</p>
            <div className="admin-preview-tags">
              {selectedProduct.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <dl>
              <div>
                <dt>公開</dt>
                <dd>{selectedProduct.published ? "公開" : "draft"}</dd>
              </div>
              <div>
                <dt>検索</dt>
                <dd>{selectedProduct.noindex ? "noindex" : "index"}</dd>
              </div>
              <div>
                <dt>画像</dt>
                <dd>{galleryPreview.map((image) => image.src).join(" / ") || "なし"}</dd>
              </div>
              <div>
                <dt>関連</dt>
                <dd>{selectedProduct.relatedIds.join(", ") || "なし"}</dd>
              </div>
            </dl>
            {faqArticle ? <div className="admin-preview-html" dangerouslySetInnerHTML={{ __html: faqArticle }} /> : null}
          </div>
        </div>

        <div className="admin-actions">
          <button
            className="button primary"
            type="button"
            onClick={saveProduct}
            disabled={saveState.status === "saving" || slugDuplicate}
          >
            products.jsonへ保存
          </button>
          <span className={`admin-save-state is-${saveState.status}`}>
            {saveState.message || "保存APIはlocalhostからのアクセス時だけ有効です。"}
          </span>
        </div>
      </section>
    </div>
  );
}

type ProductListGroupProps = {
  onSelect: (id: string) => void;
  products: EditableProduct[];
  selectedId: string;
  title: string;
};

function ProductListGroup({ onSelect, products, selectedId, title }: ProductListGroupProps) {
  if (!products.length) {
    return null;
  }

  return (
    <div className="admin-product-group">
      <p>{title}</p>
      {products.map((product) => (
        <button
          className={`admin-product-button${product.id === selectedId ? " is-active" : ""}`}
          key={product.id}
          type="button"
          onClick={() => onSelect(product.id)}
        >
          <span>{product.shortTitle || product.title}</span>
          <small>{product.slug}</small>
          <span className="admin-product-status">
            {!product.published ? <em>draft</em> : null}
            {product.noindex ? <em>noindex</em> : null}
          </span>
        </button>
      ))}
    </div>
  );
}

function createDraftProduct(products: EditableProduct[]): EditableProduct {
  const slug = makeUniqueSlug("new-product", products);

  const product: EditableProduct = {
    id: slug,
    slug,
    legacyPath: `product-${slug}.html`,
    published: false,
    noindex: true,
    title: "新規商品タイトル",
    shortTitle: "新規商品",
    description: "BOOTH商品説明をもとに、商品の内容、用途、導入条件が分かる短い説明文を入力してください。",
    category: "pose",
    categoryLabel: "ポーズ",
    tags: ["VRChat", "Unity"],
    avatars: [],
    price: "未設定",
    coverImage: `/products/${slug}/${slug}-01.webp`,
    ogImage: `/products/${slug}/${slug}-01.webp`,
    galleryPrefix: slug,
    galleryCount: 1,
    specs: [
      { label: "対応アバター", value: "未設定" },
      { label: "内容", value: "未設定" },
      { label: "用途", value: "VRChat、Unity 2022向け" },
      { label: "価格", value: "未設定" },
    ],
    salesLinks: [],
    relatedIds: [],
    summaryTags: ["VRChat", "Unity", "just"],
    normalTags: [{ href: "/products?tag=pose", label: "ポーズ" }],
    subTags: [],
    detailArticles: [],
    catalogCards: [],
  };

  return {
    ...product,
    detailArticles: createDetailArticleTemplates(product),
  };
}

function createDetailArticleTemplates(product: EditableProduct) {
  const target = product.avatars.join("・") || "対応アバター";

  return [
    `<h2 id="product-detail-title" class="booth-section-title">商品詳細</h2>
            <p class="booth-lead">${target}向けの商品詳細を入力してください。</p>
            <p>商品の内容、用途、導入条件、購入前に確認してほしい点をBOOTH商品説明に沿って入力してください。</p>
            <p class="booth-note">同梱内容や最新の<strong>注意事項</strong>については、<strong>BOOTHの商品ページ</strong>をご確認ください。</p>`,
    `<h2 class="booth-section-title">導入方法</h2>
            <ol>
              <li><strong class="booth-step-title">Unity 2022のプロジェクトを用意</strong><span class="booth-step-desc">導入先のUnityプロジェクトを用意します。</span></li>
              <li><strong class="booth-step-title">unitypackageをインポート</strong><span class="booth-step-desc">購入したunitypackageをプロジェクトへインポートします。</span></li>
              <li><strong class="booth-step-title">Prefabまたは設定を配置</strong><span class="booth-step-desc">BOOTHの商品説明に従い、同梱Prefabまたは設定を配置します。</span></li>
              <li><strong class="booth-step-title">動作確認</strong><span class="booth-step-desc">対象環境で動作を確認してから、撮影やアップロードに進みます。</span></li>
            </ol>`,
    `<h2 class="booth-section-title">同梱内容</h2>
            <ul>
              <li>当アセットのunitypackage</li>
              <li>Prefab</li>
              <li>Animation</li>
              <li>Texture</li>
            </ul>`,
    `<h2 class="booth-section-title">FAQ</h2>
            <h3 class="booth-sub-title">改変済みアバターでも使えますか？</h3>
            <p>対応条件を満たしていれば使える可能性があります。ただし、改変内容によっては調整が必要です。</p>
            <h3 class="booth-sub-title">対応アバター本体は含まれますか？</h3>
            <p><strong class="booth-negative">含まれません。</strong>アバター本体は各公式ページから別途入手してください。</p>
            <h3 class="booth-sub-title">購入前に何を確認すればいいですか？</h3>
            <p>対応環境、同梱ファイル、価格、利用条件、導入上の注意事項をBOOTHの商品ページで確認してください。</p>`,
    `<h2 class="booth-section-title">注意事項</h2>
            <p class="booth-note">購入前に、対応アバター、同梱ファイル、価格、利用条件、導入上の注意事項をBOOTHの商品ページで確認してください。</p>`,
  ];
}

function cloneProducts(products: Product[]): EditableProduct[] {
  return JSON.parse(JSON.stringify(products)) as EditableProduct[];
}

function parseTextList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseNumberList(value: string) {
  const numbers = value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number)
    .filter((number) => Number.isInteger(number) && number > 0);

  return numbers.length ? numbers : undefined;
}

function extractSectionTitle(html: string) {
  const match = html.match(/<h2[^>]*>(.*?)<\/h2>/i);
  return match?.[1]?.replace(/<[^>]*>/g, "").trim() ?? "";
}

function previewGalleryPaths(product: EditableProduct, limit = 4) {
  const numbers =
    product.galleryNumbers?.length ? product.galleryNumbers : Array.from({ length: product.galleryCount }, (_, index) => index + 1);

  return numbers.slice(0, limit).map((galleryNumber) => {
    const padded = String(galleryNumber).padStart(2, "0");
    const base = `/products/${product.slug}/${product.galleryPrefix}-${padded}`;
    return {
      src: `${base}.webp`,
      thumb: `${base}-600.webp`,
    };
  });
}

function firstGalleryImage(product: EditableProduct) {
  return previewGalleryPaths(product, 1)[0] ?? {
    src: `/products/${product.slug}/${product.galleryPrefix}-01.webp`,
    thumb: `/products/${product.slug}/${product.galleryPrefix}-01-600.webp`,
  };
}

function makeUniqueSlug(baseSlug: string, products: EditableProduct[]) {
  const usedSlugs = new Set(products.map((product) => product.slug));

  if (!usedSlugs.has(baseSlug)) {
    return baseSlug;
  }

  for (let index = 2; index < 1000; index += 1) {
    const slug = `${baseSlug}-${index}`;
    if (!usedSlugs.has(slug)) {
      return slug;
    }
  }

  return `${baseSlug}-${Date.now()}`;
}
