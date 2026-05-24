"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

type ProductCatalogProps = {
  products: Product[];
  avatars: string[];
};

type CatalogCategory = "all" | "pose" | "universal" | "solo" | "material";
type SortMode = "default" | "popular";

type CatalogItem = {
  key: string;
  product: Product;
  title: string;
  coverImage: string;
  avatars: string[];
  category: CatalogCategory;
  popularity: number;
};

const pageSize = 12;

const categoryFilters: Array<{ id: CatalogCategory; label: string }> = [
  { id: "all", label: "すべて" },
  { id: "pose", label: "ポーズ" },
  { id: "universal", label: "汎用" },
  { id: "solo", label: "一人用" },
  { id: "material", label: "マテリアル" },
];

const characterOptions = [
  { label: "愛莉", value: "愛莉", search: "あいり airi" },
  { label: "イチゴ", value: "イチゴ", search: "いちご ichigo" },
  { label: "エク", value: "エク", search: "えく eku" },
  { label: "クマリ", value: "クマリ", search: "くまり kumaly kumari" },
  { label: "しお", value: "しお", search: "しお sio shio" },
  { label: "しなの", value: "しなの", search: "しなの shinano" },
  { label: "ショコラ", value: "ショコラ", search: "しょこら chocolat chocolate" },
  { label: "セレスティア", value: "セレスティア", search: "せれすてぃあ selestia celestia" },
  { label: "プラム", value: "プラム", search: "ぷらむ plum" },
  { label: "マヌカ", value: "マヌカ", search: "まぬか manuka" },
  { label: "真冬", value: "真冬", search: "まふゆ mafuyu" },
  { label: "まよ", value: "まよ", search: "まよ mayo" },
  { label: "ミルティナ", value: "ミルティナ", search: "みるてぃな milltina" },
  { label: "ミルフィ", value: "ミルフィ", search: "みるふぃ milfy" },
  { label: "萌", value: "萌", search: "もえ moe" },
  { label: "ラシューシャ", value: "ラシューシャ", search: "らしゅーしゃ lasyusha" },
  { label: "ラムネ", value: "ラムネ", search: "らむね ramune" },
  { label: "りりか", value: "りりか", search: "りりか ririka" },
  { label: "ルミナ", value: "ルミナ", search: "るみな lumina" },
  { label: "ルルネ", value: "ルルネ", search: "るるね rurune" },
];

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

const avatarByCharacterSubtag = Object.fromEntries(
  Object.entries(characterSubtagsByAvatar).map(([avatar, subtag]) => [subtag, avatar]),
) as Record<string, string>;

const popularityById: Record<string, number> = {
  "sexy-pose-kumaly": 115,
  "sexy-pose-plum-chocolat": 233,
  "sexy-pose-ramune": 125,
  "sexy-pose-eku": 229,
  "sexy-pose-lumina": 226,
  "sexy-pose-ichigo": 296,
  "sexy-pose-shinano": 355,
  "sexy-pose-milltina": 413,
  "sexy-pose-rurune": 227,
  "sexy-motion-vol1": 880,
  "sexy-attack-motion-vol1": 178,
  "sexy-motion-attack-vol2": 567,
  "foot-motion": 369,
  "hand-motion": 404,
  "bj-motion": 375,
  "solo-motion-vol1": 884,
  "solo-motion-vol2": 790,
  "solo-motion-vol3": 532,
  "solo-motion-vol4": 135,
  "dosukebe-material": 387,
};

export function ProductCatalog({ products, avatars }: ProductCatalogProps) {
  const searchParams = useSearchParams();
  const queryCategory = normalizeCategoryParam(searchParams.get("category") ?? searchParams.get("tag"));
  const queryAvatar = normalizeAvatarParam(searchParams.get("subtag") ?? searchParams.get("avatar"));
  const [category, setCategory] = useState<CatalogCategory>(queryCategory);
  const [avatar, setAvatar] = useState(queryAvatar);
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [page, setPage] = useState(0);
  const [isSubtagOpen, setIsSubtagOpen] = useState(false);
  const [subtagSearch, setSubtagSearch] = useState("");

  const catalogItems = useMemo(() => buildCatalogItems(products), [products]);
  const avatarSet = useMemo(() => new Set(avatars), [avatars]);
  const availableCharacters = useMemo(
    () => characterOptions.filter((option) => avatarSet.has(option.value)),
    [avatarSet],
  );

  const filteredCharacters = useMemo(() => {
    const normalizedSearch = subtagSearch.trim().toLowerCase();
    if (!normalizedSearch) {
      return availableCharacters;
    }

    return availableCharacters.filter((option) =>
      `${option.label} ${option.search}`.toLowerCase().includes(normalizedSearch),
    );
  }, [availableCharacters, subtagSearch]);

  const filteredItems = useMemo(() => {
    const items = catalogItems.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesAvatar = avatar === "all" || item.avatars.includes(avatar);
      return matchesCategory && matchesAvatar;
    });

    if (sortMode === "popular") {
      return [...items].sort((a, b) => b.popularity - a.popularity || a.title.localeCompare(b.title, "ja"));
    }

    return items;
  }, [avatar, catalogItems, category, sortMode]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const visibleItems = filteredItems.slice(safePage * pageSize, safePage * pageSize + pageSize);
  const selectedAvatarLabel = avatar === "all" ? "すべて" : avatar;

  function updateCategory(nextCategory: CatalogCategory) {
    setCategory(nextCategory);
    setPage(0);
  }

  function updateAvatar(nextAvatar: string) {
    setAvatar(nextAvatar);
    setPage(0);
    setIsSubtagOpen(false);
  }

  function updateSort(nextSortMode: SortMode) {
    setSortMode(nextSortMode);
    setPage(0);
  }

  return (
    <>
      <div className="list-page-intro booth-list-intro">
        <div className="booth-list-intro-copy">
          <h1>
            VRChat・Unity向け
            <br />
            R18 3D素材一覧
          </h1>
          <p>ポーズ・モーション・マテリアル素材をサムネイルから確認できます。</p>
        </div>
        <div className="booth-sort-tabs" role="group" aria-label="BOOTH作品表示順">
          <button
            className={`booth-sort-button${sortMode === "default" ? " is-active" : ""}`}
            type="button"
            aria-pressed={sortMode === "default"}
            onClick={() => updateSort("default")}
          >
            通常順
          </button>
          <button
            className={`booth-sort-button${sortMode === "popular" ? " is-active" : ""}`}
            type="button"
            aria-pressed={sortMode === "popular"}
            onClick={() => updateSort("popular")}
          >
            人気順
          </button>
        </div>
      </div>

      <div className="booth-filter-panel" data-booth-filter data-count-suffix="件" data-page-size={pageSize}>
        <p className="booth-filter-heading">種類</p>
        <div className="booth-filter-tabs" role="group" aria-label="BOOTH作品タグ絞り込み">
          {categoryFilters.map((option) => (
            <button
              className={`booth-filter-button${category === option.id ? " is-active" : ""}`}
              type="button"
              data-booth-filter-button={option.id}
              aria-pressed={category === option.id}
              key={option.id}
              onClick={() => updateCategory(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <span className="booth-filter-status booth-list-count" data-booth-filter-status aria-live="polite">
          {filteredItems.length}件
        </span>
      </div>

      <div className={`booth-subtag-panel${isSubtagOpen ? " is-subtag-search-open" : ""}`} id="booth-subtags">
        <p className="booth-subtag-heading">対応キャラ</p>
        <div className="booth-subtag-mobile-controls">
          <span className="booth-subtag-mobile-label">対応キャラ</span>
          <button
            className={`booth-subtag-picker-toggle${avatar !== "all" ? " is-selected" : ""}`}
            type="button"
            aria-expanded={isSubtagOpen}
            aria-controls="booth-subtag-options"
            onClick={() => setIsSubtagOpen((current) => !current)}
          >
            {selectedAvatarLabel}
          </button>
        </div>
        <div className={`booth-subtag-picker${isSubtagOpen ? " is-open" : ""}`} id="booth-subtag-options">
          <div className="booth-subtag-search-panel">
            <div className="booth-subtag-search-header">
              <label className="booth-subtag-search-label" htmlFor="booth-subtag-search">
                対応キャラ検索
              </label>
              <button
                className="booth-subtag-popover-close"
                type="button"
                aria-label="対応キャラ検索を閉じる"
                onClick={() => setIsSubtagOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="booth-subtag-search-field">
              <span className="booth-subtag-search-icon" aria-hidden="true"></span>
              <input
                className="booth-subtag-search"
                id="booth-subtag-search"
                type="search"
                placeholder="キャラ名で検索…"
                autoComplete="off"
                inputMode="search"
                value={subtagSearch}
                onChange={(event) => setSubtagSearch(event.target.value)}
              />
              <button
                className="booth-subtag-search-clear"
                type="button"
                aria-label="検索文字列をクリア"
                onClick={() => setSubtagSearch("")}
                hidden={!subtagSearch}
              >
                ×
              </button>
            </div>
            <p className="booth-subtag-empty" hidden={filteredCharacters.length > 0}>
              該当するキャラがありません
            </p>
          </div>
          <div className="booth-subtag-tabs" role="group" aria-label="対応キャラ絞り込み">
            <button
              className={`booth-subtag-button${avatar === "all" ? " is-active" : ""}`}
              type="button"
              data-booth-subtag-button="all"
              data-booth-subtag-search-text="全部 all"
              aria-pressed={avatar === "all"}
              onClick={() => updateAvatar("all")}
            >
              すべて
            </button>
            {filteredCharacters.map((option) => (
              <button
                className={`booth-subtag-button${avatar === option.value ? " is-active" : ""}`}
                type="button"
                data-booth-subtag-button={getCharacterSubtag(option.value)}
                data-booth-subtag-search-text={`${option.label} ${option.search}`}
                aria-pressed={avatar === option.value}
                key={option.value}
                onClick={() => updateAvatar(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <button
          className="booth-subtag-row-toggle"
          type="button"
          aria-expanded={isSubtagOpen}
          aria-controls="booth-subtag-options"
          aria-label={isSubtagOpen ? "対応キャラ検索を閉じる" : "対応キャラ検索を開く"}
          onClick={() => setIsSubtagOpen((current) => !current)}
        >
          {isSubtagOpen ? "対応キャラを検索 ▲" : "対応キャラを検索 ▼"}
        </button>
      </div>

      <div className="booth-list-grid" data-booth-list>
        {visibleItems.map((item, index) => (
          <ProductCard
            alt={item.title}
            boothSubtags={item.avatars.map(getCharacterSubtag).join(" ")}
            boothTags={getBoothTags(item)}
            coverImage={item.coverImage}
            key={item.key}
            popularity={item.popularity}
            priority={safePage === 0 && index === 0}
            product={item.product}
            title={item.title}
            variant="booth-thumb"
          />
        ))}
      </div>

      {visibleItems.length === 0 ? <p className="booth-list-help">条件に合う商品がありません。</p> : null}

      <nav className="booth-pagination" aria-label="BOOTH作品ページ切り替え" hidden={pageCount <= 1}>
        <button
          className="booth-page-button"
          type="button"
          disabled={safePage === 0}
          onClick={() => setPage((current) => Math.max(0, current - 1))}
        >
          前へ
        </button>
        <span className="booth-page-status" aria-live="polite">
          {safePage + 1} / {pageCount}
        </span>
        <button
          className="booth-page-button"
          type="button"
          disabled={safePage >= pageCount - 1}
          onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
        >
          次へ
        </button>
      </nav>

    </>
  );
}

function buildCatalogItems(products: Product[]): CatalogItem[] {
  return products.flatMap((product) => {
    const baseItem = {
      product,
      category: getCatalogCategory(product),
      popularity: popularityById[product.id] ?? 0,
    };

    if (product.id === "sexy-pose-plum-chocolat") {
      return [
        {
          ...baseItem,
          key: `${product.id}-chocolat`,
          title: "ショコラ用 セクシーポーズ15種＋表情5種",
          coverImage: "/products/covers/CH-800.webp",
          avatars: ["ショコラ"],
        },
        {
          ...baseItem,
          key: `${product.id}-plum`,
          title: "プラム用 セクシーポーズ15種＋表情5種",
          coverImage: "/products/covers/PL-800.webp",
          avatars: ["プラム"],
        },
      ];
    }

    return [
      {
        ...baseItem,
        key: product.id,
        title: product.shortTitle,
        coverImage: product.coverImage,
        avatars: product.avatars,
      },
    ];
  });
}

function getCatalogCategory(product: Product): CatalogCategory {
  if (product.category === "motion") {
    return "universal";
  }

  if (product.category === "solo-motion") {
    return "solo";
  }

  return product.category;
}

function normalizeCategoryParam(value: string | null): CatalogCategory {
  const key = value?.trim().toLowerCase();

  switch (key) {
    case "pose":
      return "pose";
    case "motion":
    case "universal":
    case "universal-motion":
      return "universal";
    case "solo":
    case "solo-motion":
    case "solo_h":
    case "solo-h":
      return "solo";
    case "material":
      return "material";
    default:
      return "all";
  }
}

function normalizeAvatarParam(value: string | null) {
  const key = value?.trim();

  if (!key || key === "all") {
    return "all";
  }

  let decodedKey = key;
  try {
    decodedKey = decodeURIComponent(key);
  } catch {
    decodedKey = key;
  }
  const normalizedSubtag = decodedKey.toLowerCase();
  const avatarFromSubtag = avatarByCharacterSubtag[normalizedSubtag];

  if (avatarFromSubtag) {
    return avatarFromSubtag;
  }

  return characterOptions.some((option) => option.value === decodedKey) ? decodedKey : "all";
}

function getBoothTags(item: CatalogItem) {
  const tags: string[] = [item.category];
  if (item.product.category === "motion" || item.product.category === "solo-motion") {
    tags.push("motion");
  }
  if (item.product.tags.includes("表情付き")) {
    tags.push("expression");
  }
  return tags.join(" ");
}

function getCharacterSubtag(avatar: string) {
  return characterSubtagsByAvatar[avatar] ?? "";
}
