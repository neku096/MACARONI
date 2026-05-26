"use client";

import { useMemo, useState } from "react";
import type { SlideLink } from "@/lib/slide-links";

type AdminSlideLinkEditorProps = {
  slideLinks: SlideLink[];
};

type EditableSlideLink = SlideLink & {
  clientId: string;
  originalUrl?: string;
  isNew?: boolean;
};

type SaveState =
  | { status: "idle"; message: string }
  | { status: "saving"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function AdminSlideLinkEditor({ slideLinks: initialSlideLinks }: AdminSlideLinkEditorProps) {
  const [items, setItems] = useState<EditableSlideLink[]>(() => cloneSlideLinks(initialSlideLinks));
  const [selectedClientId, setSelectedClientId] = useState(items[0]?.clientId ?? "");
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle", message: "" });

  const selectedItem = useMemo(
    () => items.find((item) => item.clientId === selectedClientId) ?? items[0],
    [items, selectedClientId],
  );
  const publishedItems = useMemo(() => items.filter((item) => item.published), [items]);
  const draftItems = useMemo(() => items.filter((item) => !item.published), [items]);

  if (!selectedItem) {
    return (
      <div className="admin-empty">
        <p>編集できるリンクカードがありません。</p>
        <button className="button primary" type="button" onClick={createNewItem}>
          新規リンクカード作成
        </button>
      </div>
    );
  }

  const urlDuplicate = items.some((item) => item.clientId !== selectedItem.clientId && item.url === selectedItem.url);

  function createNewItem() {
    const item = createDraftSlideLink(items);

    setItems((currentItems) => [item, ...currentItems]);
    setSelectedClientId(item.clientId);
    setSaveState({ status: "idle", message: "新規リンクカードdraftを作成しました。URLとサムネイルを確認してください。" });
  }

  function updateSelected(update: (item: EditableSlideLink) => EditableSlideLink) {
    setItems((currentItems) =>
      currentItems.map((item) => (item.clientId === selectedItem.clientId ? update(item) : item)),
    );
    setSaveState({ status: "idle", message: "" });
  }

  function updateField<K extends keyof SlideLink>(key: K, value: SlideLink[K]) {
    updateSelected((item) => ({ ...item, [key]: value }));
  }

  async function saveItem() {
    setSaveState({ status: "saving", message: "保存中です..." });

    try {
      const response = await fetch("/api/admin/slide-links", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: selectedItem.isNew ? undefined : selectedItem.originalUrl,
          item: stripClientFields(selectedItem),
        }),
      });
      const result = (await response.json()) as { items?: SlideLink[]; message?: string };

      if (!response.ok || !result.items) {
        throw new Error(result.message || "保存に失敗しました。");
      }

      setItems(cloneSlideLinks(result.items));
      setSelectedClientId(selectedItem.url);
      setSaveState({ status: "success", message: "slide-links.json を更新しました。" });
    } catch (error) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "保存に失敗しました。",
      });
    }
  }

  async function deleteItem() {
    if (selectedItem.isNew) {
      const nextItems = items.filter((item) => item.clientId !== selectedItem.clientId);
      setItems(nextItems);
      setSelectedClientId(nextItems[0]?.clientId ?? "");
      setSaveState({ status: "idle", message: "未保存のdraftを削除しました。" });
      return;
    }

    const targetUrl = selectedItem.originalUrl || selectedItem.url;
    const confirmed = window.confirm(`${selectedItem.title} を slide-links.json から削除しますか？`);
    if (!confirmed) {
      return;
    }

    setSaveState({ status: "saving", message: "削除中です..." });

    try {
      const response = await fetch("/api/admin/slide-links", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: targetUrl }),
      });
      const result = (await response.json()) as { items?: SlideLink[]; message?: string };

      if (!response.ok || !result.items) {
        throw new Error(result.message || "削除に失敗しました。");
      }

      const nextItems = cloneSlideLinks(result.items);
      setItems(nextItems);
      setSelectedClientId(nextItems[0]?.clientId ?? "");
      setSaveState({ status: "success", message: "slide-links.json から削除しました。" });
    } catch (error) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "削除に失敗しました。",
      });
    }
  }

  return (
    <div className="admin-grid">
      <aside className="admin-sidebar" aria-label="スライドリンクカード一覧">
        <div className="admin-sidebar-heading">
          <div>
            <h2>リンクカード</h2>
            <span>{items.length}件</span>
          </div>
          <button className="button compact" type="button" onClick={createNewItem}>
            新規カード作成
          </button>
        </div>
        <div className="admin-product-list">
          <SlideLinkListGroup
            items={draftItems}
            selectedClientId={selectedItem.clientId}
            title="Draft"
            onSelect={setSelectedClientId}
          />
          <SlideLinkListGroup
            items={publishedItems}
            selectedClientId={selectedItem.clientId}
            title="Published"
            onSelect={setSelectedClientId}
          />
        </div>
      </aside>

      <section className="admin-editor" aria-label={`${selectedItem.title}の編集`}>
        <div className="admin-editor-header">
          <div>
            <p className="admin-kicker">{selectedItem.isNew ? "New Draft" : "Editing"}</p>
            <h2>{selectedItem.title}</h2>
          </div>
          <button className="button compact" type="button" onClick={deleteItem}>
            削除
          </button>
        </div>

        <div className="admin-notice">
          <strong>スライドリンク集カード管理</strong>
          <span>URLとサムネイルを手入力します。リンク先のスクレイピング、画像取得、外部API呼び出しは行いません。</span>
        </div>

        <div className="admin-card">
          <h3>基本情報</h3>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span>title</span>
              <input value={selectedItem.title} onChange={(event) => updateField("title", event.target.value)} />
            </label>
            <label className="admin-field">
              <span>category</span>
              <input value={selectedItem.category} onChange={(event) => updateField("category", event.target.value)} />
            </label>
            <label className="admin-field">
              <span>sortOrder</span>
              <input
                type="number"
                value={selectedItem.sortOrder}
                onChange={(event) => updateField("sortOrder", Number(event.target.value))}
              />
            </label>
            <label className="admin-field admin-field-wide">
              <span>description</span>
              <textarea
                rows={4}
                value={selectedItem.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
            </label>
            <label className="admin-field admin-field-wide">
              <span>url</span>
              <input value={selectedItem.url} onChange={(event) => updateField("url", event.target.value)} />
            </label>
            <label className="admin-field admin-field-wide">
              <span>thumbnail</span>
              <input
                value={selectedItem.thumbnail}
                onChange={(event) => updateField("thumbnail", event.target.value)}
              />
            </label>
            <label className="admin-field admin-field-wide">
              <span>tags（1行に1つ）</span>
              <textarea
                rows={4}
                value={selectedItem.tags.join("\n")}
                onChange={(event) => updateField("tags", parseTextList(event.target.value))}
              />
            </label>
          </div>
          <div className="admin-checks">
            <label className="admin-check-row">
              <input
                type="checkbox"
                checked={selectedItem.published}
                onChange={(event) => updateField("published", event.target.checked)}
              />
              <span>published</span>
            </label>
            <label className="admin-check-row">
              <input
                type="checkbox"
                checked={selectedItem.openInNewTab}
                onChange={(event) => updateField("openInNewTab", event.target.checked)}
              />
              <span>openInNewTab</span>
            </label>
            {!selectedItem.published ? <span className="admin-badge is-draft">draft</span> : null}
          </div>
          <div className="admin-warning-list" aria-live="polite">
            {urlDuplicate ? <p>URLが重複しています。保存前に別URLへ変更してください。</p> : null}
          </div>
        </div>

        <div className="admin-card admin-preview">
          <h3>簡易プレビュー</h3>
          <div className="admin-preview-panel">
            <h4>{selectedItem.title}</h4>
            <p>{selectedItem.description}</p>
            <dl>
              <div>
                <dt>URL</dt>
                <dd>{selectedItem.url}</dd>
              </div>
              <div>
                <dt>サムネイル</dt>
                <dd>{selectedItem.thumbnail}</dd>
              </div>
              <div>
                <dt>カテゴリ</dt>
                <dd>{selectedItem.category}</dd>
              </div>
            </dl>
            <div className="admin-preview-tags">
              {selectedItem.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-actions">
          <button
            className="button primary"
            type="button"
            onClick={saveItem}
            disabled={saveState.status === "saving" || urlDuplicate}
          >
            slide-links.jsonへ保存
          </button>
          <span className={`admin-save-state is-${saveState.status}`}>
            {saveState.message || "保存APIはlocalhostかつMACARONI_ADMIN_ENABLED=1の時だけ有効です。"}
          </span>
        </div>
      </section>
    </div>
  );
}

type SlideLinkListGroupProps = {
  items: EditableSlideLink[];
  onSelect: (clientId: string) => void;
  selectedClientId: string;
  title: string;
};

function SlideLinkListGroup({ items, onSelect, selectedClientId, title }: SlideLinkListGroupProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="admin-product-group">
      <p>{title}</p>
      {items.map((item) => (
        <button
          className={`admin-product-button${item.clientId === selectedClientId ? " is-active" : ""}`}
          key={item.clientId}
          type="button"
          onClick={() => onSelect(item.clientId)}
        >
          <span>{item.title}</span>
          <small>{item.category}</small>
          <span className="admin-product-status">{!item.published ? <em>draft</em> : null}</span>
        </button>
      ))}
    </div>
  );
}

function cloneSlideLinks(items: SlideLink[]): EditableSlideLink[] {
  return items.map((item) => ({
    ...JSON.parse(JSON.stringify(item)),
    clientId: item.url,
    originalUrl: item.url,
  })) as EditableSlideLink[];
}

function createDraftSlideLink(items: EditableSlideLink[]): EditableSlideLink {
  const nextOrder = Math.max(0, ...items.map((item) => item.sortOrder)) + 1;

  return {
    title: "新規リンクカード",
    description: "リンクカードの説明を入力してください。",
    url: `https://example.com/manual-link-${nextOrder}`,
    thumbnail: "/images/link-icons/booth.webp",
    category: "draft",
    tags: ["draft"],
    sortOrder: nextOrder,
    published: false,
    openInNewTab: true,
    clientId: `new-slide-link-${Date.now()}`,
    isNew: true,
  };
}

function stripClientFields(item: EditableSlideLink): SlideLink {
  const slideLink = { ...item } as Partial<EditableSlideLink>;
  delete slideLink.clientId;
  delete slideLink.originalUrl;
  delete slideLink.isNew;
  return slideLink as SlideLink;
}

function parseTextList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}
