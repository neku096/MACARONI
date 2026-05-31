"use client";

import { useMemo, useState } from "react";
import { AdminGalleryNumbersField, AdminGalleryPrefixField, AdminPathField } from "@/components/AdminPathAssist";
import type { Product, ProductCategory } from "@/lib/products";

type AdminProductEditorProps = {
  products: Product[];
};

type EditableProduct = Product & {
  archived?: boolean;
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
  const publishedProducts = useMemo(
    () => products.filter((product) => product.published && !product.archived),
    [products],
  );
  const draftProducts = useMemo(
    () => products.filter((product) => !product.published && !product.archived),
    [products],
  );
  const archivedProducts = useMemo(() => products.filter((product) => product.archived), [products]);

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

  const selectedProductIndex = products.indexOf(selectedProduct);
  const isNewProduct = newProductIds.has(selectedProduct.id);
  const detailArticles = selectedProduct.detailArticles ?? [];
  const faqArticleIndex = detailArticles.findIndex((article) => /<h2[^>]*>\s*FAQ\s*<\/h2>/i.test(article));
  const faqArticle = faqArticleIndex >= 0 ? detailArticles[faqArticleIndex] : "";
  const slugDuplicate = products.some(
    (product, index) => index !== selectedProductIndex && product.slug === selectedProduct.slug,
  );
  const relatedIdWarnings = selectedProduct.relatedIds.filter(
    (relatedId) => !products.some((product) => product.id === relatedId),
  );
  const galleryPreview = previewGalleryPaths(selectedProduct, 8);
  const usedSlugs = products.map((product) => product.slug).sort((a, b) => a.localeCompare(b));
  const productImageBasePath = `/products/${selectedProduct.slug}`;
  const coverImageBasePath = getPathDirectory(selectedProduct.coverImage, productImageBasePath);
  const ogImageBasePath = getPathDirectory(selectedProduct.ogImage, productImageBasePath);

  function createNewProduct() {
    const product = createDraftProduct(products);

    setProducts((currentProducts) => [product, ...currentProducts]);
    setSelectedId(product.id);
    setNewProductIds((currentIds) => new Set(currentIds).add(product.id));
    setSaveState({
      status: "idle",
      message: "新規下書きを作成しました。画像とBOOTHリンクを確認してから保存してください。",
    });
  }

  function duplicateProduct(sourceProduct: EditableProduct) {
    const product = createDuplicatedProduct(sourceProduct, products);

    setProducts((currentProducts) => [product, ...currentProducts]);
    setSelectedId(product.id);
    setNewProductIds((currentIds) => new Set(currentIds).add(product.id));
    setSaveState({
      status: "idle",
      message: `${sourceProduct.shortTitle || sourceProduct.title} を複製しました。URL識別子、画像、BOOTHリンクを確認してから保存してください。`,
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
    const nextId = products.some((product) => product.id !== previousId && product.id === nextSlug)
      ? previousId
      : nextSlug;
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === previousId
          ? {
              ...product,
              id: nextId,
              slug: nextSlug,
              legacyPath: `product-${nextSlug}.html`,
              galleryPrefix: product.galleryPrefix === product.slug ? nextSlug : product.galleryPrefix,
            }
          : product,
      ),
    );
    setSelectedId(nextId);
    setNewProductIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.delete(previousId);
      nextIds.add(nextId);
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

  function archiveSelectedProduct() {
    const confirmed = window.confirm(
      `${selectedProduct.shortTitle || selectedProduct.title} をアーカイブしますか？\nproducts.jsonからは削除せず、公開一覧・検索・関連商品から外します。`,
    );
    if (!confirmed) {
      return;
    }

    updateSelected((product) => ({
      ...product,
      archived: true,
      published: false,
      noindex: true,
    }));
    setSaveState({ status: "idle", message: "アーカイブ状態にしました。確定するには保存してください。" });
  }

  function restoreSelectedProduct() {
    updateSelected((product) => {
      const nextProduct = {
        ...product,
        published: false,
        noindex: true,
      };
      delete nextProduct.archived;
      return nextProduct;
    });
    setSaveState({ status: "idle", message: "下書きとして復元しました。確定するには保存してください。" });
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
            onClone={duplicateProduct}
            products={publishedProducts}
            selectedId={selectedProduct.id}
            title="公開中"
            onSelect={setSelectedId}
          />
          <ProductListGroup
            onClone={duplicateProduct}
            products={draftProducts}
            selectedId={selectedProduct.id}
            title="下書き"
            onSelect={setSelectedId}
          />
          <ProductListGroup
            onClone={duplicateProduct}
            products={archivedProducts}
            selectedId={selectedProduct.id}
            title="アーカイブ済み"
            onSelect={setSelectedId}
          />
        </div>
      </aside>

      <section className="admin-editor" aria-label={`${selectedProduct.shortTitle}の編集`}>
        <div className="admin-editor-header">
          <div>
            <p className="admin-kicker">{isNewProduct ? "新規下書き" : "編集中"}</p>
            <h2>{selectedProduct.shortTitle || selectedProduct.title}</h2>
          </div>
          <div className="admin-button-row">
            <a className="button compact" href={`/products/${selectedProduct.slug}`} target="_blank" rel="noreferrer">
              LPを開く
            </a>
            {selectedProduct.archived ? (
              <button className="button compact" type="button" onClick={restoreSelectedProduct}>
                復元
              </button>
            ) : (
              <button className="button compact" type="button" onClick={archiveSelectedProduct}>
                アーカイブ
              </button>
            )}
          </div>
        </div>

        <div className="admin-notice">
          <strong>商品追加メモ</strong>
          <span>
            新規商品は下書き・検索除外で作成します。不要になった商品は削除せず、アーカイブで公開面から外してください。
          </span>
        </div>

        <div className="admin-card">
          <h3>基本情報</h3>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span>商品名</span>
              <input value={selectedProduct.title} onChange={(event) => updateField("title", event.target.value)} />
              <p className="admin-help">商品LPや検索結果で使う正式な商品名です。</p>
            </label>
            <label className="admin-field">
              <span>短縮商品名</span>
              <input
                value={selectedProduct.shortTitle}
                onChange={(event) => updateField("shortTitle", event.target.value)}
              />
              <p className="admin-help">一覧や管理画面で短く表示する名前です。</p>
            </label>
            <label className="admin-field">
              <span>URL識別子</span>
              <input value={selectedProduct.slug} onChange={(event) => updateSlug(event.target.value)} />
              <p className="admin-help">商品ページURLに使用されます。公開後は変更しないことを推奨します。</p>
            </label>
            <label className="admin-field">
              <span>旧HTMLパス</span>
              <input
                value={selectedProduct.legacyPath}
                onChange={(event) => updateField("legacyPath", event.target.value)}
              />
              <p className="admin-help">旧HTMLからNext.js商品ページへ転送するための互換パスです。</p>
            </label>
            <label className="admin-field">
              <span>カテゴリ</span>
              <select value={selectedProduct.category} onChange={(event) => updateCategory(event.target.value as ProductCategory)}>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="admin-help">商品一覧の種類フィルターに使います。</p>
            </label>
            <label className="admin-field">
              <span>価格</span>
              <input value={selectedProduct.price} onChange={(event) => updateField("price", event.target.value)} />
              <p className="admin-help">LP上に表示する価格表記です。</p>
            </label>
          </div>

          <div className="admin-checks">
            <label className="admin-check-row">
              <input
                type="checkbox"
                checked={selectedProduct.published}
                onChange={(event) => updateField("published", event.target.checked)}
              />
              <span>公開する</span>
            </label>
            <label className="admin-check-row">
              <input
                type="checkbox"
                checked={Boolean(selectedProduct.noindex)}
                onChange={(event) => updateField("noindex", event.target.checked || undefined)}
              />
              <span>検索結果に載せない</span>
            </label>
            {!selectedProduct.published ? <span className="admin-badge is-draft">下書き</span> : null}
            {selectedProduct.archived ? <span className="admin-badge">アーカイブ済み</span> : null}
            {selectedProduct.noindex ? <span className="admin-badge">検索除外</span> : null}
          </div>
          <p className="admin-help">
            「検索結果に載せない」を有効にすると、Google検索へ登録しません。アーカイブ済み商品は公開一覧・サイトマップ・関連商品から外れます。
          </p>

          <div className="admin-warning-list" aria-live="polite">
            {slugDuplicate ? <p>URL識別子が重複しています。保存前に別の値へ変更してください。</p> : null}
            {!isNewProduct ? <p>公開済み商品のURL識別子変更は旧URL redirectの確認が必要です。</p> : null}
          </div>

          <details className="admin-used-slugs">
            <summary>使用済みURL識別子を表示</summary>
            <div>
              {usedSlugs.map((slug, index) => (
                <code key={`${slug}-${index}`}>{slug}</code>
              ))}
            </div>
          </details>
        </div>

        <div className="admin-card">
          <div className="admin-card-heading">
            <h3>画像・ギャラリー</h3>
            <div className="admin-button-row">
              <button className="button compact" type="button" onClick={resetGalleryFromSlug}>
                URL識別子から一括生成
              </button>
              <button className="button compact" type="button" onClick={syncCoverWithGallery}>
                メイン画像を先頭ギャラリーに同期
              </button>
            </div>
          </div>
          <div className="admin-form-grid">
            <AdminPathField
              basePath={coverImageBasePath}
              label="メイン画像"
              value={selectedProduct.coverImage}
              helpText="商品LPのメイン画像やカード表示に使う画像です。"
              onChange={(value) => updateField("coverImage", value)}
            />
            <AdminPathField
              basePath={ogImageBasePath}
              label="SNS共有画像"
              value={selectedProduct.ogImage}
              helpText="SNS共有やOGPで使う画像です。"
              onChange={(value) => updateField("ogImage", value)}
            />
            <AdminGalleryPrefixField
              label="ギャラリー画像パス"
              value={selectedProduct.galleryPrefix}
              helpText="ギャラリー画像名の共通部分です。例: product-name-01.webp の product-name 部分。"
              onChange={(value) => updateField("galleryPrefix", value)}
            />
            <label className="admin-field">
              <span>ギャラリー枚数</span>
              <input
                min="0"
                max="100"
                type="number"
                value={selectedProduct.galleryCount}
                onChange={(event) => updateField("galleryCount", Number(event.target.value))}
              />
              <p className="admin-help">連番で自動生成するギャラリー画像の枚数です。</p>
            </label>
            <AdminGalleryNumbersField
              label="ギャラリー番号"
              value={selectedProduct.galleryNumbers?.join(", ") ?? ""}
              helpText={`複数画像を選ぶと、${productImageBasePath} 配下の画像名から番号候補を作ります。`}
              onTextChange={(value) => updateField("galleryNumbers", parseNumberList(value))}
              onApply={(numbers) => updateField("galleryNumbers", numbers.length ? numbers : undefined)}
            />
          </div>
          <div className="admin-path-preview" aria-label="生成される画像パス">
            {galleryPreview.map((image) => (
              <div key={image.src}>
                <span>通常</span>
                <code>{image.src}</code>
                <span>サムネ</span>
                <code>{image.thumb}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3>タグ・説明文</h3>
          <label className="admin-field">
            <span>タグ（1行に1つ）</span>
            <textarea
              rows={6}
              value={selectedProduct.tags.join("\n")}
              onChange={(event) => updateField("tags", parseTextList(event.target.value))}
            />
            <p className="admin-help">商品検索やLP上部の補助情報に使います。</p>
          </label>
          <label className="admin-field">
            <span>対応アバター（1行に1つ）</span>
            <textarea
              rows={4}
              value={selectedProduct.avatars.join("\n")}
              onChange={(event) => updateField("avatars", parseTextList(event.target.value))}
            />
            <p className="admin-help">対応キャラ絞り込みやサブタグに使うアバター名です。</p>
          </label>
          <label className="admin-field">
            <span>説明文</span>
            <textarea
              rows={5}
              value={selectedProduct.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
            <p className="admin-help">一覧、SEO、SNS共有で使う短い説明文です。</p>
          </label>
        </div>

        <div className="admin-card">
          <h3>関連商品</h3>
          <label className="admin-field">
            <span>関連商品（1行に1つ）</span>
            <textarea
              rows={5}
              value={selectedProduct.relatedIds.join("\n")}
              onChange={(event) => updateField("relatedIds", parseTextList(event.target.value))}
            />
            <p className="admin-help">関連商品に表示する商品のURL識別子です。</p>
          </label>
          {relatedIdWarnings.length ? (
            <p className="admin-inline-warning">存在しない関連商品: {relatedIdWarnings.join(", ")}</p>
          ) : (
            <p className="admin-help">空欄なら関連商品なし。公開前に4件以内を目安に設定してください。</p>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-heading">
            <h3>商品詳細・FAQ本文</h3>
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
              <span>{extractSectionTitle(article) || `セクション ${index + 1}`}</span>
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
          <h3>プレビュー</h3>
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
                <dd>{selectedProduct.published ? "公開中" : "下書き"}</dd>
              </div>
              <div>
                <dt>検索</dt>
                <dd>{selectedProduct.noindex ? "検索除外" : "検索対象"}</dd>
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
  onClone: (product: EditableProduct) => void;
  onSelect: (id: string) => void;
  products: EditableProduct[];
  selectedId: string;
  title: string;
};

function ProductListGroup({ onClone, onSelect, products, selectedId, title }: ProductListGroupProps) {
  if (!products.length) {
    return null;
  }

  return (
    <div className="admin-product-group">
      <p>{title}</p>
      {products.map((product) => (
        <div className={`admin-product-row${product.id === selectedId ? " is-active" : ""}`} key={product.id}>
          <button className="admin-product-button" type="button" onClick={() => onSelect(product.id)}>
            <span>{product.shortTitle || product.title}</span>
            <small>{product.slug}</small>
            <span className="admin-product-status">
              {!product.published ? <em>下書き</em> : null}
              {product.archived ? <em>アーカイブ</em> : null}
              {product.noindex ? <em>検索除外</em> : null}
            </span>
          </button>
          <button
            className="admin-product-clone"
            type="button"
            onClick={() => onClone(product)}
            aria-label={`${product.shortTitle || product.title}を複製`}
          >
            複製
          </button>
        </div>
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
    archived: undefined,
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

function createDuplicatedProduct(sourceProduct: EditableProduct, products: EditableProduct[]): EditableProduct {
  const slug = makeUniqueSlug(`${sourceProduct.slug}-copy`, products);
  const product = cloneProduct(sourceProduct);
  const title = `${sourceProduct.title} コピー`;
  const shortTitle = `${sourceProduct.shortTitle || sourceProduct.title} コピー`;
  const firstGallery = `/products/${slug}/${slug}-01.webp`;

  return {
    ...product,
    id: slug,
    slug,
    legacyPath: `product-${slug}.html`,
    published: false,
    noindex: true,
    title,
    shortTitle,
    coverImage: firstGallery,
    ogImage: firstGallery,
    galleryPrefix: slug,
    summaryTags: product.summaryTags ? [...product.summaryTags] : undefined,
    normalTags: product.normalTags ? cloneProduct(product.normalTags) : undefined,
    subTags: product.subTags ? cloneProduct(product.subTags) : undefined,
    detailArticles: product.detailArticles ? [...product.detailArticles] : undefined,
    catalogCards: product.catalogCards?.map((card) => ({
      ...card,
      image: `/products/${slug}/${slug}-01-600.webp`,
      imageSet: `/products/${slug}/${slug}-01-600.webp 600w, /products/${slug}/${slug}-01.webp 1000w`,
      alt: `${shortTitle} VRChat・Unity向け3D素材`,
    })),
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

function cloneProduct<T>(product: T): T {
  return JSON.parse(JSON.stringify(product)) as T;
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

function getPathDirectory(path: string, fallback: string) {
  const normalizedPath = path.trim().replace(/\\/g, "/");
  const slashIndex = normalizedPath.lastIndexOf("/");

  if (slashIndex > 0) {
    return normalizedPath.slice(0, slashIndex);
  }

  return fallback;
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
