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

export function AdminProductEditor({ products: initialProducts }: AdminProductEditorProps) {
  const [products, setProducts] = useState<EditableProduct[]>(() => cloneProducts(initialProducts));
  const [selectedId, setSelectedId] = useState(initialProducts[0]?.id ?? "");
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle", message: "" });

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? products[0],
    [products, selectedId],
  );

  if (!selectedProduct) {
    return <p className="admin-empty">編集できる商品がありません。</p>;
  }

  const detailArticles = selectedProduct.detailArticles ?? [];
  const faqArticleIndex = detailArticles.findIndex((article) => /<h2[^>]*>\s*FAQ\s*<\/h2>/i.test(article));
  const faqArticle = faqArticleIndex >= 0 ? detailArticles[faqArticleIndex] : "";

  function updateSelected(update: (product: EditableProduct) => EditableProduct) {
    setProducts((currentProducts) =>
      currentProducts.map((product) => (product.id === selectedProduct.id ? update(product) : product)),
    );
    setSaveState({ status: "idle", message: "" });
  }

  function updateField<K extends keyof EditableProduct>(key: K, value: EditableProduct[K]) {
    updateSelected((product) => ({ ...product, [key]: value }));
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
          originalId: selectedProduct.id,
          product: selectedProduct,
        }),
      });
      const result = (await response.json()) as { products?: EditableProduct[]; message?: string };

      if (!response.ok || !result.products) {
        throw new Error(result.message || "保存に失敗しました。");
      }

      setProducts(result.products);
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
          <h2>商品一覧</h2>
          <span>{products.length}件</span>
        </div>
        <div className="admin-product-list">
          {products.map((product) => (
            <button
              className={`admin-product-button${product.id === selectedProduct.id ? " is-active" : ""}`}
              key={product.id}
              type="button"
              onClick={() => setSelectedId(product.id)}
            >
              <span>{product.shortTitle || product.title}</span>
              <small>{product.slug}</small>
            </button>
          ))}
        </div>
      </aside>

      <section className="admin-editor" aria-label={`${selectedProduct.shortTitle}の編集`}>
        <div className="admin-editor-header">
          <div>
            <p className="admin-kicker">Editing</p>
            <h2>{selectedProduct.shortTitle || selectedProduct.title}</h2>
          </div>
          <a className="button compact" href={`/products/${selectedProduct.slug}`} target="_blank" rel="noreferrer">
            LPを開く
          </a>
        </div>

        <div className="admin-card">
          <h3>基本情報</h3>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span>title</span>
              <input value={selectedProduct.title} onChange={(event) => updateField("title", event.target.value)} />
            </label>
            <label className="admin-field">
              <span>slug</span>
              <input value={selectedProduct.slug} onChange={(event) => updateField("slug", event.target.value)} />
            </label>
            <label className="admin-field">
              <span>category</span>
              <select
                value={selectedProduct.category}
                onChange={(event) => updateField("category", event.target.value as ProductCategory)}
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
            <label className="admin-field">
              <span>galleryNumbers</span>
              <input
                placeholder="例: 1, 2, 5"
                value={selectedProduct.galleryNumbers?.join(", ") ?? ""}
                onChange={(event) => updateField("galleryNumbers", parseNumberList(event.target.value))}
              />
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
            <span>description</span>
            <textarea
              rows={5}
              value={selectedProduct.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </label>
        </div>

        <div className="admin-card">
          <div className="admin-card-heading">
            <h3>商品詳細・FAQ HTML</h3>
            <button
              className="button compact"
              type="button"
              onClick={() => updateField("detailArticles", [...detailArticles, "<h2 class=\"booth-section-title\">新規セクション</h2>\n<p></p>"])}
            >
              セクション追加
            </button>
          </div>
          {detailArticles.map((article, index) => (
            <label className="admin-field" key={index}>
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
                <dd>{selectedProduct.published ? "公開" : "非公開"}</dd>
              </div>
              <div>
                <dt>検索</dt>
                <dd>{selectedProduct.noindex ? "noindex" : "index"}</dd>
              </div>
              <div>
                <dt>画像</dt>
                <dd>{previewGalleryPaths(selectedProduct).join(" / ") || "なし"}</dd>
              </div>
            </dl>
            {faqArticle ? <div className="admin-preview-html" dangerouslySetInnerHTML={{ __html: faqArticle }} /> : null}
          </div>
        </div>

        <div className="admin-actions">
          <button className="button primary" type="button" onClick={saveProduct} disabled={saveState.status === "saving"}>
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

function previewGalleryPaths(product: EditableProduct) {
  const numbers =
    product.galleryNumbers ?? Array.from({ length: Math.min(product.galleryCount, 4) }, (_, index) => index + 1);

  return numbers.slice(0, 4).map((galleryNumber) => {
    const padded = String(galleryNumber).padStart(2, "0");
    return `${product.galleryPrefix}-${padded}.webp`;
  });
}
