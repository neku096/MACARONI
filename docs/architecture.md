# Architecture

このメモは、現在のNext.js移行状態を安定版として把握するための構成整理です。

## App Router構成

- `app/layout.tsx`: 共通レイアウト、年齢確認、ヘッダー、フッター、グローバルCSS読み込み
- `app/page.tsx`: トップページ
- `app/products/page.tsx`: 商品一覧ページ
- `app/products/[slug]/page.tsx`: 商品LP自動生成
- `app/sitemap.ts`: sitemap生成
- `app/robots.ts`: robots.txt生成

共通UIは `components/` に置きます。

- `SiteHeader`: 共通ヘッダー
- `SiteFooter`: 共通フッター
- `AgeGate`: Next.js側の年齢確認ゲート
- `ProductCatalog`: 商品一覧、カテゴリ・対応キャラ絞り込み、ページング
- `ProductCard`: 商品カード
- `ProductDetail`: 商品LP本文、ギャラリー、購入導線、関連商品
- `ProductGallery`: 旧HTMLの商品画像ギャラリー / ライトボックス継承
- `ProductLegacyCollapses`: 旧 `script.js` の商品LP用折り畳み挙動継承
- `ShareButton`: 共有UI

## data/products.json 中心構造

商品情報は `data/products.json` を正として扱います。`lib/products.ts` で型定義、取得関数、URL生成、ギャラリー生成、関連商品生成をまとめています。

主な流れは以下です。

1. `products.json` に商品データを追加
2. `lib/products.ts` の `getPublishedProducts()` が `published: true` の商品だけを返す
3. 一覧、LP、sitemap、関連商品は公開商品のみを使う
4. 旧HTMLから移行した `galleryImages` があれば、それを優先して商品画像パスを使う
5. `galleryImages` が無い場合は、`galleryPrefix` と `galleryCount` から商品画像パスを生成する

旧HTML商品LPの継承用に、以下の任意フィールドも使います。

- `summaryTags`: 旧HTMLの `product-summary-tags`
- `purchaseNote`: 旧HTMLの `product-note`
- `galleryImages`: 旧HTMLの `product-gallery-data`
- `detailSections`: 旧HTMLの `商品詳細`、`導入方法`、`同梱内容`、`FAQ`
- `relatedIds`: 旧HTMLの関連商品表示順

## products → slug生成

`app/products/[slug]/page.tsx` の `generateStaticParams()` は、`getPublishedProducts()` の `slug` からLPを静的生成します。

- 公開URL: `/products/<slug>`
- 旧HTML互換URL: `/product-<slug>.html`
- 日本語旧HTML互換URL: `/ja/product-<slug>.html`

`published: false` の商品は静的生成されず、直接アクセス時も `notFound()` になります。

## SEO生成箇所

- サイト共通メタ: `app/layout.tsx`
- 商品一覧メタ: `app/products/page.tsx`
- 商品LPメタ: `app/products/[slug]/page.tsx`
- 商品構造化データ: `lib/products.ts` の `productJsonLd()`
- canonical / hreflang: 各ページの `metadata.alternates`
- sitemap: `app/sitemap.ts`
- robots: `app/robots.ts`

本番URLは `NEXT_PUBLIC_SITE_URL` を優先し、無い場合は `lib/products.ts` の既定値を使います。

旧HTMLのheadをそのまま返すのではなく、Next.jsの `metadata` と `productJsonLd()` で生成します。完全一致が必要な商品は、旧HTMLのtitle / description / OGP / JSON-LDとの比較を別途行います。

## sitemap生成

`app/sitemap.ts` は以下を出力します。

- `/`
- `/products`
- 主要な既存静的ページ
- `published: true` の `/products/<slug>`
- `public/en/` に残している英語静的ページ
- `published: true` 商品の英語旧HTMLパス

`published: false` の商品はsitemapに含めません。

## redirect設計

`next.config.ts` の `redirects()` で旧HTML互換を維持します。

- `/booth.html` → `/products`
- `/ja/booth.html` → `/products`
- `/index.html` → `/`
- `/ja/index.html` → `/`
- `/product-<slug>.html` → `/products/<slug>`
- `/ja/product-<slug>.html` → `/products/<slug>`
- `/ja/:path*` → `/:path*`

`/products/dark-voice-material` は現行データに該当slugがないため、互換入口として `/products/dosukebe-material` に転送します。

GitHub Pages向けの `basePath`、`assetPrefix`、`output: "export"` は入れていません。現時点ではVercelまたは独自ドメイン直下を前提にしています。

## 商品LPの旧HTML継承

商品LPは、旧 `product-*.html` の構造を正としてNext.js側へ寄せています。

- ヒーロー: `ProductDetail` が旧HTMLの `product-hero` / `product-summary` 構造を再現
- ギャラリー: `ProductGallery` が旧HTMLのクリック拡大、サムネイル、前後移動、Esc、背景クリックを継承
- 商品本文: `detailSections` のHTML断片を `product-detail-block booth-description` として表示
- 折り畳み: `ProductLegacyCollapses` がサブタグ、対応アバター、スマホ版パンくずの行数判定を継承
- 関連商品: `relatedIds` がある場合は旧HTML抽出順を優先し、自動候補で補完しない
- 旧URLリンク: `booth.html?...` ではなく、Next.jsで実際に動く `/products?...` へ置き換える

## 年齢確認フロー

旧HTMLとNext.jsで同じ `localStorage` キーを使います。

- キー: `ageConfirmed`
- 値: `"true"`
- 旧HTML: `public/age-gate-boot.js`、`public/script.js`、`public/characters.js`
- Next.js: `app/layout.tsx`、`components/AgeGate.tsx`

確認済みの流れ:

1. `app/layout.tsx` の小さなインラインスクリプトが、初期描画前に `ageConfirmed` を確認する
2. 確認済みなら `document.documentElement` に `age-confirmed` を付ける
3. CSSの `html.age-confirmed .age-gate` でゲートを非表示にする
4. `AgeGate` のマウント後、bodyのスクロールロック状態とReact stateを同期する
5. ユーザーが入場すると `ageConfirmed` を `"true"` に保存する

この方式により、旧HTMLページで確認済みにした状態をNext.jsページでも使えます。

## URLクエリ絞り込み

`components/ProductCatalog.tsx` は `useSearchParams()` で初期URLを読みます。

- `subtag=character-chocolat`: 対応キャラをショコラにする
- `avatar=ショコラ`: 対応キャラをショコラにする
- `category=pose`: ポーズ
- `category=motion`: 汎用
- `category=universal`: 汎用
- `category=solo`: 一人用
- `category=solo-motion`: 一人用
- `category=material`: マテリアル

商品データ上の `category: "motion"` は一覧UIでは `universal` として扱います。`category: "solo-motion"` は一覧UIでは `solo` として扱います。
