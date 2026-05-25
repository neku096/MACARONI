# Architecture

このプロジェクトは、旧HTMLサイトを参照しながらNext.js App Routerへ移行した構成です。

## 現役Next.js構成

- `app/`: App Routerのページ、metadata、sitemap、robots
- `components/`: 共通ヘッダー、フッター、商品一覧、商品詳細、共有UI、年齢確認
- `data/products.json`: 商品LP、一覧、関連商品、タグの中心データ
- `lib/products.ts`: 商品データの型、URL生成、関連商品、JSON-LD helper
- `styles.css`: 旧HTMLの見た目を継承した共通CSS。`app/layout.tsx` から読み込み
- `public/`: Vercel/Next.jsで配信するruntime assetと互換HTML

## Runtimeで参照されるrootファイル

- `styles.css`: Next.js runtimeで使用中
- `next.config.ts`: 旧HTML URL redirectを定義
- `package.json` / `package-lock.json`: Next.js runtime dependency
- `tsconfig.json` / `next-env.d.ts`: TypeScript/Next.js設定

## Public配信ファイル

`public/` 配下はURLとして直接配信されます。以下は現役または互換用のため、移動しないでください。

- `public/script.js`: 旧HTML由来のslider、lightbox、share、language bridgeなどのruntime挙動
- `public/age-gate-boot.js`: 年齢確認の初期表示制御
- `public/*.html`: `/terms.html`、`/tips.html`、`/characters.html` などの互換ページ
- `public/images/`, `public/products/`, `public/Macaroni_Samune/`: runtime画像

## Legacy参照資産

root直下の旧HTML、root `script.js`、root `age-gate-boot.js`、root `characters.js`、root `sitemap.xml`、root `robots.txt` はNext.js runtimeから直接参照されていません。

ただし、`scripts/extract-legacy-products.mjs` がroot `booth.html` とroot `product-*.html` を参照するため、移動する場合はscript更新と再検証が必要です。

## URL互換

旧URL互換は `next.config.ts` のredirectで維持します。

- `booth.html` -> `/products`
- `product-*.html` -> `/products/[slug]`
- `/ja/terms.html` -> `/terms.html`
- `/ja/characters.html` -> `/characters.html`
- `/blog.html` -> `/tips.html`

## SEO生成

- `app/layout.tsx`: 共通metadata、icons、manifest
- `app/page.tsx`: topページのcanonical/OGP
- `app/products/page.tsx`: 商品一覧のcanonical/OGP
- `app/products/[slug]/page.tsx`: 商品LPのmetadataとJSON-LD
- `app/sitemap.ts`: published商品と主要静的ページのsitemap
- `app/robots.ts`: robots.txt

`NEXT_PUBLIC_SITE_URL` がcanonical、OGP、sitemap、robotsの基準URLになります。
