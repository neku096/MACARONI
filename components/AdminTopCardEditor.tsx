"use client";

import { useMemo, useState } from "react";
import { AdminPathField } from "@/components/AdminPathAssist";
import type { TopCard } from "@/lib/top-cards";

type AdminTopCardEditorProps = {
  topCards: TopCard[];
};

type EditableTopCard = TopCard & {
  clientId: string;
  originalUrl?: string;
  isNew?: boolean;
};

type SaveState =
  | { status: "idle"; message: string }
  | { status: "saving"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function AdminTopCardEditor({ topCards: initialTopCards }: AdminTopCardEditorProps) {
  const [items, setItems] = useState<EditableTopCard[]>(() => cloneTopCards(initialTopCards));
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
        <p>編集できるトップページ表示カードがありません。</p>
        <button className="button primary" type="button" onClick={createNewItem}>
          新規トップカード作成
        </button>
      </div>
    );
  }

  const urlDuplicate = items.some((item) => item.clientId !== selectedItem.clientId && item.url === selectedItem.url);
  const thumbnailBasePath = getPathDirectory(selectedItem.thumbnail, "/products/covers");

  function createNewItem() {
    const item = createDraftTopCard(items);

    setItems((currentItems) => [item, ...currentItems]);
    setSelectedClientId(item.clientId);
    setSaveState({ status: "idle", message: "新規トップカードの下書きを作成しました。URLとサムネイル画像を確認してください。" });
  }

  function duplicateItem(sourceItem: EditableTopCard) {
    const item = createDuplicatedTopCard(sourceItem, items);

    setItems((currentItems) => [item, ...currentItems]);
    setSelectedClientId(item.clientId);
    setSaveState({
      status: "idle",
      message: `${sourceItem.title} を複製しました。URL重複がある場合は、保存前に商品導線を確認してください。`,
    });
  }

  function updateSelected(update: (item: EditableTopCard) => EditableTopCard) {
    setItems((currentItems) =>
      currentItems.map((item) => (item.clientId === selectedItem.clientId ? update(item) : item)),
    );
    setSaveState({ status: "idle", message: "" });
  }

  function updateField<K extends keyof TopCard>(key: K, value: TopCard[K]) {
    updateSelected((item) => ({ ...item, [key]: value }));
  }

  async function saveItem() {
    setSaveState({ status: "saving", message: "保存中です..." });

    try {
      const response = await fetch("/api/admin/top-cards", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: selectedItem.isNew ? undefined : selectedItem.originalUrl,
          item: stripClientFields(selectedItem),
        }),
      });
      const result = (await response.json()) as { items?: TopCard[]; message?: string };

      if (!response.ok || !result.items) {
        throw new Error(result.message || "保存に失敗しました。");
      }

      setItems(cloneTopCards(result.items));
      setSelectedClientId(selectedItem.url);
      setSaveState({ status: "success", message: "top-cards.json を更新しました。" });
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
      setSaveState({ status: "idle", message: "未保存の下書きを削除しました。" });
      return;
    }

    const targetUrl = selectedItem.originalUrl || selectedItem.url;
    const confirmed = window.confirm(`${selectedItem.title} を top-cards.json から削除しますか？`);
    if (!confirmed) {
      return;
    }

    setSaveState({ status: "saving", message: "削除中です..." });

    try {
      const response = await fetch("/api/admin/top-cards", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: targetUrl }),
      });
      const result = (await response.json()) as { items?: TopCard[]; message?: string };

      if (!response.ok || !result.items) {
        throw new Error(result.message || "削除に失敗しました。");
      }

      const nextItems = cloneTopCards(result.items);
      setItems(nextItems);
      setSelectedClientId(nextItems[0]?.clientId ?? "");
      setSaveState({ status: "success", message: "top-cards.json から削除しました。" });
    } catch (error) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "削除に失敗しました。",
      });
    }
  }

  return (
    <div className="admin-grid">
      <aside className="admin-sidebar" aria-label="トップページ表示カード一覧">
        <div className="admin-sidebar-heading">
          <div>
            <h2>トップカード</h2>
            <span>{items.length}件</span>
          </div>
          <button className="button compact" type="button" onClick={createNewItem}>
            新規トップカード作成
          </button>
        </div>
        <div className="admin-product-list">
          <TopCardListGroup
            items={draftItems}
            onClone={duplicateItem}
            selectedClientId={selectedItem.clientId}
            title="下書き"
            onSelect={setSelectedClientId}
          />
          <TopCardListGroup
            items={publishedItems}
            onClone={duplicateItem}
            selectedClientId={selectedItem.clientId}
            title="公開中"
            onSelect={setSelectedClientId}
          />
        </div>
      </aside>

      <section className="admin-editor" aria-label={`${selectedItem.title}の編集`}>
        <div className="admin-editor-header">
          <div>
            <p className="admin-kicker">{selectedItem.isNew ? "新規下書き" : "編集中"}</p>
            <h2>{selectedItem.title}</h2>
          </div>
          <button className="button compact" type="button" onClick={deleteItem}>
            削除
          </button>
        </div>

        <div className="admin-notice">
          <strong>トップページ表示カード管理</strong>
          <span>
            商品リンクカード、おすすめカード、スライドカード、商品導線カードを編集します。URL先のスクレイピング、画像取得、外部API呼び出しは行いません。
          </span>
        </div>

        <div className="admin-card">
          <h3>基本情報</h3>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span>カード名</span>
              <input value={selectedItem.title} onChange={(event) => updateField("title", event.target.value)} />
              <p className="admin-help">トップページのカード上に表示する名前です。</p>
            </label>
            <label className="admin-field">
              <span>カテゴリ</span>
              <input value={selectedItem.category} onChange={(event) => updateField("category", event.target.value)} />
              <p className="admin-help">カードの分類表示や並び確認に使います。</p>
            </label>
            <label className="admin-field">
              <span>表示順</span>
              <input
                type="number"
                value={selectedItem.sortOrder}
                onChange={(event) => updateField("sortOrder", Number(event.target.value))}
              />
              <p className="admin-help">数字が小さいカードから順に表示します。</p>
            </label>
            <label className="admin-field admin-field-wide">
              <span>リンク先URL</span>
              <input value={selectedItem.url} onChange={(event) => updateField("url", event.target.value)} />
              <p className="admin-help">BOOTH商品URLまたは /products/ から始まる商品LPを指定します。SNSリンクは使いません。</p>
            </label>
            <label className="admin-field admin-field-wide">
              <span>元商品</span>
              <input
                value={selectedItem.sourceProductSlug ?? ""}
                onChange={(event) => updateField("sourceProductSlug", event.target.value.trim() || undefined)}
              />
              <p className="admin-help">products.json の商品URL識別子です。トップカードと元商品を紐づけます。</p>
            </label>
            <AdminPathField
              basePath={thumbnailBasePath}
              label="サムネイル画像"
              value={selectedItem.thumbnail}
              helpText="カードに表示する画像です。public配下の公開パスを指定します。"
              wide
              onChange={(value) => updateField("thumbnail", value)}
            />
            <label className="admin-field admin-field-wide">
              <span>タグ（1行に1つ）</span>
              <textarea
                rows={4}
                value={selectedItem.tags.join("\n")}
                onChange={(event) => updateField("tags", parseTextList(event.target.value))}
              />
              <p className="admin-help">カードの補助情報として表示・整理に使います。</p>
            </label>
          </div>
          <div className="admin-checks">
            <label className="admin-check-row">
              <input
                type="checkbox"
                checked={selectedItem.published}
                onChange={(event) => updateField("published", event.target.checked)}
              />
              <span>公開する</span>
            </label>
            <label className="admin-check-row">
              <input
                type="checkbox"
                checked={selectedItem.openInNewTab}
                onChange={(event) => updateField("openInNewTab", event.target.checked)}
              />
              <span>新しいタブで開く</span>
            </label>
            {!selectedItem.published ? <span className="admin-badge is-draft">下書き</span> : null}
          </div>
          <p className="admin-help">公開するを外すとトップページには表示されません。外部のBOOTH商品URLは新しいタブで開く設定を推奨します。</p>
          <div className="admin-warning-list" aria-live="polite">
            {urlDuplicate ? <p>URLが重複しています。保存前に別URLへ変更してください。</p> : null}
          </div>
        </div>

        <div className="admin-card admin-preview">
          <h3>プレビュー</h3>
          <div className="admin-preview-panel">
            <h4>{selectedItem.title}</h4>
            <dl>
              <div>
                <dt>URL</dt>
                <dd>{selectedItem.url}</dd>
              </div>
              <div>
                <dt>サムネイル画像</dt>
                <dd>{selectedItem.thumbnail}</dd>
              </div>
              <div>
                <dt>カテゴリ</dt>
                <dd>{selectedItem.category}</dd>
              </div>
              <div>
                <dt>元商品</dt>
                <dd>{selectedItem.sourceProductSlug || "なし"}</dd>
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
            top-cards.jsonへ保存
          </button>
          <span className={`admin-save-state is-${saveState.status}`}>
            {saveState.message || "保存APIはlocalhostかつMACARONI_ADMIN_ENABLED=1の時だけ有効です。"}
          </span>
        </div>
      </section>
    </div>
  );
}

type TopCardListGroupProps = {
  items: EditableTopCard[];
  onClone: (item: EditableTopCard) => void;
  onSelect: (clientId: string) => void;
  selectedClientId: string;
  title: string;
};

function TopCardListGroup({ items, onClone, onSelect, selectedClientId, title }: TopCardListGroupProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="admin-product-group">
      <p>{title}</p>
      {items.map((item) => (
        <div className={`admin-product-row${item.clientId === selectedClientId ? " is-active" : ""}`} key={item.clientId}>
          <button className="admin-product-button" type="button" onClick={() => onSelect(item.clientId)}>
            <span>{item.title}</span>
            <small>{item.category}</small>
            <span className="admin-product-status">{!item.published ? <em>下書き</em> : null}</span>
          </button>
          <button
            className="admin-product-clone"
            type="button"
            onClick={() => onClone(item)}
            aria-label={`${item.title}を複製`}
          >
            複製
          </button>
        </div>
      ))}
    </div>
  );
}

function cloneTopCards(items: TopCard[]): EditableTopCard[] {
  return items.map((item) => ({
    ...JSON.parse(JSON.stringify(item)),
    clientId: item.url,
    originalUrl: item.url,
  })) as EditableTopCard[];
}

function createDraftTopCard(items: EditableTopCard[]): EditableTopCard {
  const nextOrder = Math.max(0, ...items.map((item) => item.sortOrder)) + 1;

  return {
    title: "新規トップカード",
    url: `https://example.com/top-card-${nextOrder}`,
    thumbnail: "/images/link-icons/booth.webp",
    category: "下書き",
    tags: ["下書き"],
    sortOrder: nextOrder,
    published: false,
    openInNewTab: true,
    clientId: `new-top-card-${Date.now()}`,
    isNew: true,
  };
}

function createDuplicatedTopCard(sourceItem: EditableTopCard, items: EditableTopCard[]): EditableTopCard {
  const item = cloneTopCard(sourceItem);
  const nextOrder = Math.max(0, ...items.map((currentItem) => currentItem.sortOrder)) + 1;

  return {
    ...item,
    title: `${sourceItem.title} コピー`,
    tags: [...sourceItem.tags],
    sortOrder: nextOrder,
    published: false,
    clientId: `copy-top-card-${Date.now()}`,
    originalUrl: undefined,
    isNew: true,
  };
}

function stripClientFields(item: EditableTopCard): TopCard {
  const topCard = { ...item } as Partial<EditableTopCard>;
  delete topCard.clientId;
  delete topCard.originalUrl;
  delete topCard.isNew;
  return topCard as TopCard;
}

function cloneTopCard(item: EditableTopCard): EditableTopCard {
  return JSON.parse(JSON.stringify(item)) as EditableTopCard;
}

function parseTextList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getPathDirectory(path: string, fallback: string) {
  const normalizedPath = path.trim().replace(/\\/g, "/");
  const slashIndex = normalizedPath.lastIndexOf("/");

  if (slashIndex > 0) {
    return normalizedPath.slice(0, slashIndex);
  }

  return fallback;
}
