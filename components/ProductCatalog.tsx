"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

type CategoryOption = {
  id: string;
  label: string;
};

type ProductCatalogProps = {
  products: Product[];
  categories: CategoryOption[];
  tags: string[];
  avatars: string[];
};

const all = "all";

export function ProductCatalog({ products, categories, tags, avatars }: ProductCatalogProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? all;
  const [category, setCategory] = useState(initialCategory);
  const [tag, setTag] = useState(all);
  const [avatar, setAvatar] = useState(all);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === all || product.category === category;
      const matchesTag = tag === all || product.tags.includes(tag);
      const matchesAvatar = avatar === all || product.avatars.includes(avatar);
      return matchesCategory && matchesTag && matchesAvatar;
    });
  }, [avatar, category, products, tag]);

  function resetFilters() {
    setCategory(all);
    setTag(all);
    setAvatar(all);
  }

  return (
    <>
      <div className="next-filter-stack" aria-label="商品フィルター">
        <FilterPanel title="カテゴリ" status={`${filteredProducts.length}件`}>
          <FilterButton active={category === all} onClick={() => setCategory(all)}>
            すべて
          </FilterButton>
          {categories.map((option) => (
            <FilterButton key={option.id} active={category === option.id} onClick={() => setCategory(option.id)}>
              {option.label}
            </FilterButton>
          ))}
        </FilterPanel>

        <FilterPanel title="タグ">
          <FilterButton active={tag === all} onClick={() => setTag(all)}>
            すべて
          </FilterButton>
          {tags.map((option) => (
            <FilterButton key={option} active={tag === option} onClick={() => setTag(option)}>
              {option}
            </FilterButton>
          ))}
        </FilterPanel>

        <FilterPanel title="対応キャラ">
          <FilterButton active={avatar === all} onClick={() => setAvatar(all)}>
            すべて
          </FilterButton>
          {avatars.map((option) => (
            <FilterButton key={option} active={avatar === option} onClick={() => setAvatar(option)}>
              {option}
            </FilterButton>
          ))}
        </FilterPanel>
      </div>

      {(category !== all || tag !== all || avatar !== all) && (
        <div className="next-filter-reset">
          <button className="booth-sort-button" type="button" onClick={resetFilters}>
            フィルターを解除
          </button>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="next-product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="booth-list-help">条件に合う商品がありません。</p>
      )}
    </>
  );
}

function FilterPanel({
  title,
  status,
  children,
}: {
  title: string;
  status?: string;
  children: ReactNode;
}) {
  return (
    <section className="booth-filter-panel next-filter-panel" aria-label={`${title}で絞り込み`}>
      <h2 className="booth-filter-heading">{title}</h2>
      <div className="booth-filter-tabs">{children}</div>
      {status ? <span className="booth-filter-status booth-list-count">{status}</span> : null}
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      className={`booth-filter-button${active ? " is-active" : ""}`}
      type="button"
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
