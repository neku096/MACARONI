"use client";

import { useMemo, useState } from "react";
import { freePoseCharacterOptions, type FreePose, type FreePoseGalleryImage } from "@/lib/free-poses";

type AdminFreePoseEditorProps = {
  freePoses: FreePose[];
};

type EditableFreePose = FreePose & {
  clientId: string;
  originalSlug?: string;
  isNew?: boolean;
};

type SaveState =
  | { status: "idle"; message: string }
  | { status: "saving"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function AdminFreePoseEditor({ freePoses: initialFreePoses }: AdminFreePoseEditorProps) {
  const [items, setItems] = useState<EditableFreePose[]>(() => cloneFreePoses(initialFreePoses));
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
        <p>編集できる対応キャラ別無料ポーズがありません。</p>
        <button className="button primary" type="button" onClick={createNewItem}>
          新規無料ポーズ作成
        </button>
      </div>
    );
  }

  const slugDuplicate = items.some(
    (item) => item.clientId !== selectedItem.clientId && item.slug === selectedItem.slug,
  );

  function createNewItem() {
    const item = createDraftFreePose(items);

    setItems((currentItems) => [item, ...currentItems]);
    setSelectedClientId(item.clientId);
    setSaveState({ status: "idle", message: "新規無料ポーズdraftを作成しました。character、downloadUrl、サムネイルを確認してください。" });
  }

  function updateSelected(update: (item: EditableFreePose) => EditableFreePose) {
    setItems((currentItems) =>
      currentItems.map((item) => (item.clientId === selectedItem.clientId ? update(item) : item)),
    );
    setSaveState({ status: "idle", message: "" });
  }

  function updateField<K extends keyof FreePose>(key: K, value: FreePose[K]) {
    updateSelected((item) => ({ ...item, [key]: value }));
  }

  async function saveItem() {
    setSaveState({ status: "saving", message: "保存中です..." });

    try {
      const response = await fetch("/api/admin/free-poses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalSlug: selectedItem.isNew ? undefined : selectedItem.originalSlug,
          item: stripClientFields(selectedItem),
        }),
      });
      const result = (await response.json()) as { items?: FreePose[]; message?: string };

      if (!response.ok || !result.items) {
        throw new Error(result.message || "保存に失敗しました。");
      }

      setItems(cloneFreePoses(result.items));
      setSelectedClientId(selectedItem.slug);
      setSaveState({ status: "success", message: "free-poses.json を更新しました。" });
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

    const targetSlug = selectedItem.originalSlug || selectedItem.slug;
    const confirmed = window.confirm(`${selectedItem.title} を free-poses.json から削除しますか？`);
    if (!confirmed) {
      return;
    }

    setSaveState({ status: "saving", message: "削除中です..." });

    try {
      const response = await fetch("/api/admin/free-poses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: targetSlug }),
      });
      const result = (await response.json()) as { items?: FreePose[]; message?: string };

      if (!response.ok || !result.items) {
        throw new Error(result.message || "削除に失敗しました。");
      }

      const nextItems = cloneFreePoses(result.items);
      setItems(nextItems);
      setSelectedClientId(nextItems[0]?.clientId ?? "");
      setSaveState({ status: "success", message: "free-poses.json から削除しました。" });
    } catch (error) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "削除に失敗しました。",
      });
    }
  }

  return (
    <div className="admin-grid">
      <aside className="admin-sidebar" aria-label="対応キャラ別無料ポーズ一覧">
        <div className="admin-sidebar-heading">
          <div>
            <h2>対応キャラ別無料ポーズ</h2>
            <span>{items.length}件</span>
          </div>
          <button className="button compact" type="button" onClick={createNewItem}>
            新規無料ポーズ作成
          </button>
        </div>
        <div className="admin-product-list">
          <FreePoseListGroup
            items={draftItems}
            selectedClientId={selectedItem.clientId}
            title="Draft"
            onSelect={setSelectedClientId}
          />
          <FreePoseListGroup
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
          <strong>対応キャラ別無料ポーズ管理</strong>
          <span>
            桔梗、マヌカ、ショコラなど、対応キャラごとの無料配布ポーズを管理します。anim取得や外部API呼び出しは行いません。
          </span>
        </div>

        <div className="admin-card">
          <h3>基本情報</h3>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span>title</span>
              <input value={selectedItem.title} onChange={(event) => updateField("title", event.target.value)} />
            </label>
            <label className="admin-field">
              <span>slug</span>
              <input value={selectedItem.slug} onChange={(event) => updateField("slug", event.target.value.trim())} />
            </label>
            <label className="admin-field">
              <span>character</span>
              <select value={selectedItem.character} onChange={(event) => updateField("character", event.target.value)}>
                {freePoseCharacterOptions.map((character) => (
                  <option key={character} value={character}>
                    {character}
                  </option>
                ))}
              </select>
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
                checked={selectedItem.noindex}
                onChange={(event) => updateField("noindex", event.target.checked)}
              />
              <span>noindex</span>
            </label>
            {!selectedItem.published ? <span className="admin-badge is-draft">draft</span> : null}
            {selectedItem.noindex ? <span className="admin-badge">noindex</span> : null}
          </div>
          <div className="admin-warning-list" aria-live="polite">
            {slugDuplicate ? <p>slugが重複しています。保存前に別slugへ変更してください。</p> : null}
          </div>
        </div>

        <div className="admin-card">
          <h3>配布ファイル</h3>
          <div className="admin-form-grid">
            <label className="admin-field admin-field-wide">
              <span>thumbnail</span>
              <input
                value={selectedItem.thumbnail}
                onChange={(event) => updateField("thumbnail", event.target.value)}
              />
            </label>
            <label className="admin-field admin-field-wide">
              <span>downloadUrl</span>
              <input
                value={selectedItem.downloadUrl}
                onChange={(event) => updateField("downloadUrl", event.target.value)}
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
            <label className="admin-field admin-field-wide">
              <span>gallery（src | alt、1行に1つ。任意）</span>
              <textarea
                rows={4}
                value={formatGallery(selectedItem.gallery)}
                onChange={(event) => updateField("gallery", parseGallery(event.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="admin-card admin-preview">
          <h3>簡易プレビュー</h3>
          <div className="admin-preview-panel">
            <h4>{selectedItem.title}</h4>
            <p>{selectedItem.description}</p>
            <dl>
              <div>
                <dt>キャラ</dt>
                <dd>{selectedItem.character}</dd>
              </div>
              <div>
                <dt>サムネイル</dt>
                <dd>{selectedItem.thumbnail}</dd>
              </div>
              <div>
                <dt>DL</dt>
                <dd>{selectedItem.downloadUrl}</dd>
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
            disabled={saveState.status === "saving" || slugDuplicate}
          >
            free-poses.jsonへ保存
          </button>
          <span className={`admin-save-state is-${saveState.status}`}>
            {saveState.message || "保存APIはlocalhostかつMACARONI_ADMIN_ENABLED=1の時だけ有効です。"}
          </span>
        </div>
      </section>
    </div>
  );
}

type FreePoseListGroupProps = {
  items: EditableFreePose[];
  onSelect: (clientId: string) => void;
  selectedClientId: string;
  title: string;
};

function FreePoseListGroup({ items, onSelect, selectedClientId, title }: FreePoseListGroupProps) {
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
          <small>{item.slug}</small>
          <span className="admin-product-status">
            {!item.published ? <em>draft</em> : null}
            {item.noindex ? <em>noindex</em> : null}
          </span>
        </button>
      ))}
    </div>
  );
}

function cloneFreePoses(items: FreePose[]): EditableFreePose[] {
  return items.map((item) => ({
    ...JSON.parse(JSON.stringify(item)),
    clientId: item.slug,
    originalSlug: item.slug,
  })) as EditableFreePose[];
}

function createDraftFreePose(items: EditableFreePose[]): EditableFreePose {
  const nextOrder = Math.max(0, ...items.map((item) => item.sortOrder)) + 1;
  const slug = makeUniqueSlug("new-free-pose", items);

  return {
    title: "新規無料ポーズ",
    slug,
    description: "無料配布ポーズの内容を入力してください。",
    character: freePoseCharacterOptions[0],
    thumbnail: "/images/FreePose/Chocolat/CH_Pose_01_result.webp",
    downloadUrl: "/FreePose/SexyPose_01.anim",
    tags: ["無料配布", "Unity anim"],
    sortOrder: nextOrder,
    published: false,
    noindex: true,
    gallery: [],
    clientId: `${slug}-${Date.now()}`,
    isNew: true,
  };
}

function stripClientFields(item: EditableFreePose): FreePose {
  const freePose = { ...item } as Partial<EditableFreePose>;
  delete freePose.clientId;
  delete freePose.originalSlug;
  delete freePose.isNew;
  return freePose as FreePose;
}

function parseTextList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatGallery(gallery?: FreePoseGalleryImage[]) {
  return gallery?.map((image) => `${image.src} | ${image.alt}`).join("\n") ?? "";
}

function parseGallery(value: string) {
  const gallery = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [src = "", alt = ""] = line.split("|").map((part) => part.trim());
      return { src, alt };
    })
    .filter((image) => image.src);

  return gallery.length ? gallery : undefined;
}

function makeUniqueSlug(baseSlug: string, items: EditableFreePose[]) {
  const usedSlugs = new Set(items.map((item) => item.slug));

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
