import type { ReactNode } from "react";
import type { Product, ProductCatalogCard } from "@/lib/products";

type ProductCatalogProps = {
  products: Product[];
};

type CharacterOption = {
  id: string;
  label: string;
  searchText: string;
};

type CatalogEntry = {
  product: Product;
  card: ProductCatalogCard;
};

const characterOptions: CharacterOption[] = [
  { id: "character-airi", label: "愛莉", searchText: "あいり airi" },
  { id: "character-ichigo", label: "イチゴ", searchText: "いちご ichigo" },
  { id: "character-eku", label: "エク", searchText: "えく eku" },
  { id: "character-kumaly", label: "クマリ", searchText: "くまり kumaly kumari" },
  { id: "character-sio", label: "しお", searchText: "しお sio shio" },
  { id: "character-shinano", label: "しなの", searchText: "しなの shinano" },
  { id: "character-chocolat", label: "ショコラ", searchText: "しょこら chocolat chocolate" },
  { id: "character-selestia", label: "セレスティア", searchText: "せれすてぃあ selestia celestia" },
  { id: "character-plum", label: "プラム", searchText: "ぷらむ plum" },
  { id: "character-manuka", label: "マヌカ", searchText: "まぬか manuka" },
  { id: "character-mafuyu", label: "真冬", searchText: "まふゆ mafuyu" },
  { id: "character-mayo", label: "まよ", searchText: "まよ mayo" },
  { id: "character-milltina", label: "ミルティナ", searchText: "みるてぃな milltina" },
  { id: "character-milfy", label: "ミルフィ", searchText: "みるふぃ milfy" },
  { id: "character-moe", label: "萌", searchText: "もえ moe" },
  { id: "character-lasyusha", label: "ラシューシャ", searchText: "らしゅーしゃ lasyusha" },
  { id: "character-ramune", label: "ラムネ", searchText: "らむね ramune" },
  { id: "character-ririka", label: "りりか", searchText: "りりか ririka" },
  { id: "character-lumina", label: "ルミナ", searchText: "るみな lumina" },
  { id: "character-rurune", label: "ルルネ", searchText: "るるね rurune" },
];

export function ProductCatalog({ products }: ProductCatalogProps) {
  const catalogEntries = products.flatMap<CatalogEntry>((product) =>
    (product.catalogCards ?? []).map((card) => ({ product, card })),
  );

  return (
    <>
      <div className="booth-filter-panel" data-booth-filter="" data-count-suffix="件" data-page-size="12">
        <p className="booth-filter-heading">種類</p>
        <div className="booth-filter-tabs" role="group" aria-label="BOOTH作品タグ絞り込み">
          <FilterButton id="all" active>
            すべて
          </FilterButton>
          <FilterButton id="pose">ポーズ</FilterButton>
          <FilterButton id="universal">汎用</FilterButton>
          <FilterButton id="solo">一人用</FilterButton>
          <FilterButton id="material">マテリアル</FilterButton>
        </div>
        <span className="booth-filter-status booth-list-count" data-booth-filter-status="" aria-live="polite" />
      </div>
      <div className="booth-subtag-panel" id="booth-subtags" data-booth-subtag-filter="">
        <p className="booth-subtag-heading">対応キャラ</p>
        <div className="booth-subtag-mobile-controls">
          <span className="booth-subtag-mobile-label">対応キャラ</span>
          <button
            className="booth-subtag-picker-toggle"
            type="button"
            data-booth-subtag-toggle=""
            data-default-label="すべて"
            aria-expanded="false"
            aria-controls="booth-subtag-options"
          >
            すべて
          </button>
        </div>
        <div className="booth-subtag-picker" id="booth-subtag-options" data-booth-subtag-picker="">
          <div className="booth-subtag-search-panel" data-booth-subtag-search-panel="">
            <div className="booth-subtag-search-header">
              <label className="booth-subtag-search-label" htmlFor="booth-subtag-search">
                対応キャラ検索
              </label>
              <button
                className="booth-subtag-popover-close"
                type="button"
                data-booth-subtag-close=""
                aria-label="対応キャラ検索を閉じる"
              >
                ×
              </button>
            </div>
            <div className="booth-subtag-search-field">
              <span className="booth-subtag-search-icon" aria-hidden="true" />
              <input
                className="booth-subtag-search"
                id="booth-subtag-search"
                type="search"
                data-booth-subtag-search=""
                placeholder="キャラ名で検索…"
                autoComplete="off"
                inputMode="search"
              />
              <button
                className="booth-subtag-search-clear"
                type="button"
                data-booth-subtag-search-clear=""
                aria-label="検索文字列をクリア"
              >
                ×
              </button>
            </div>
            <p className="booth-subtag-empty" data-booth-subtag-empty="" hidden>
              該当するキャラがありません
            </p>
          </div>
          <div className="booth-subtag-tabs" role="group" aria-label="対応キャラ絞り込み">
            <SubtagButton id="all" label="すべて" searchText="全部 all" active />
            {characterOptions.map((option) => (
              <SubtagButton key={option.id} id={option.id} label={option.label} searchText={option.searchText} />
            ))}
          </div>
        </div>
        <button
          className="booth-subtag-row-toggle"
          type="button"
          data-booth-subtag-row-toggle=""
          data-open-label="対応キャラを検索 ▼"
          data-close-label="対応キャラを検索 ▲"
          data-open-aria-label="対応キャラ検索を開く"
          data-close-aria-label="対応キャラ検索を閉じる"
          aria-expanded="false"
          aria-controls="booth-subtag-options"
          aria-label="対応キャラ検索を開く"
        >
          対応キャラを検索 ▼
        </button>
      </div>
      <div className="booth-list-grid" data-booth-list="">
        {catalogEntries.map(({ product, card }, index) => (
          <a
            className="booth-list-thumb"
            data-booth-tags={card.tags.join(" ")}
            data-booth-subtags={card.subtags.join(" ")}
            data-popularity={card.popularity}
            href={`/products/${product.slug}`}
            key={`${product.id}-${index}`}
          >
            <img
              src={card.image}
              alt={card.alt}
              srcSet={card.imageSet}
              sizes="(max-width: 720px) 46vw, (max-width: 1200px) 30vw, 420px"
              width="600"
              height="600"
              loading={index === 0 ? undefined : "lazy"}
              decoding="async"
              fetchPriority={index === 0 ? "high" : undefined}
            />
          </a>
        ))}
      </div>
      <nav className="booth-pagination" data-booth-pagination="" aria-label="BOOTH作品ページ切り替え">
        <button className="booth-page-button" type="button" data-booth-page-button="prev">
          前へ
        </button>
        <span className="booth-page-status" data-booth-page-status="" aria-live="polite" />
        <button className="booth-page-button" type="button" data-booth-page-button="next">
          次へ
        </button>
      </nav>
    </>
  );
}

function FilterButton({ id, active = false, children }: { id: string; active?: boolean; children: ReactNode }) {
  return (
    <button
      className={`booth-filter-button${active ? " is-active" : ""}`}
      type="button"
      data-booth-filter-button={id}
      aria-pressed={active ? "true" : "false"}
    >
      {children}
    </button>
  );
}

function SubtagButton({
  id,
  label,
  searchText,
  active = false,
}: {
  id: string;
  label: string;
  searchText: string;
  active?: boolean;
}) {
  return (
    <button
      className={`booth-subtag-button${active ? " is-active" : ""}`}
      type="button"
      data-booth-subtag-button={id}
      data-booth-subtag-search-text={searchText}
      aria-pressed={active ? "true" : "false"}
    >
      {label}
    </button>
  );
}
