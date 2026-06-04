# MACARONI Next.js Site

マカロニのBOOTH作品・無料素材ページをNext.js App Routerで管理するサイトです。

## セットアップ

```bash
npm install
npm run dev
```

ローカル確認は `http://127.0.0.1:3000` を使います。

## Windows ローカル起動

プロジェクト直下の `.bat` は `D:\Codex\MACARONI` 前提で動きます。

- `start-local.bat`: `MACARONI_ADMIN_ENABLED=1` を設定して `npm run dev` を起動します。ローカル管理画面 `/admin` を使う時はこちらを使います。
- `start-prod-preview.bat`: `npm run build` の後に `npm run start` を起動します。production preview 用なので `/admin` は無効です。
- `stop-node.bat`: 3000〜3999番で待ち受けている Node.js process を表示し、確認後に停止します。dev server や preview server を止めたい時に使います。

## コマンド

- `npm run dev`: 開発サーバーを起動
- `npm run lint`: lintを実行
- `npm run typecheck`: TypeScriptの型チェックを実行
- `npm run build`: 本番ビルドを作成
- `npm run build:cloudflare`: OpenNext用にWebpackでNext.js本番ビルドを作成
- `npm run start`: ビルド済みアプリを起動
- `npm run preview`: OpenNextでCloudflare Workers用ビルドを作成し、Wranglerのローカルpreviewを起動
- `npm run deploy`: OpenNextでCloudflare Workersへデプロイ
- `npm run upload`: OpenNextでCloudflare Workersへ新しいversionをupload
- `npm run cf-typegen`: Cloudflare binding用の型定義を生成

## 本番公開方針

Next.js版の本番公開は引き続き **Vercel推奨** です。`/products` と `/products/[slug]` を本番URLとして動かす前提のため、GitHub Pages旧HTML公開とはURL仕様が異なります。

GitHub Pagesは旧HTML公開用として残せますが、Next.js版の本番URLとしては扱いません。GitHub PagesでNext.js版を公開する場合は、`basePath` / `assetPrefix` / static export などの追加設計が必要です。現時点では追加していません。

Cloudflare Workers + OpenNext は Preview 検証用の構成を追加しています。すぐに本番DNSを切り替える前提ではなく、公開ページ、商品ページ、sitemap、robots、旧URL redirect、FreePose ZIP配布がWorkers runtimeで同じように動くことを確認してから切り替えます。

## 環境変数

Vercel Productionに必ず以下を設定してください。

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
```

`NEXT_PUBLIC_SITE_URL` は canonical、OGP URL、sitemap、robots の基準URLになります。Cloudflare WorkersでPreview/Productionを確認する場合も必ず設定してください。

Cloudflare Workers Buildsを使う場合は、Cloudflare Dashboardで以下の両方に同じURLを設定します。

- Build variables and secrets
- Runtime environment variables

ローカルの `npm run preview` では、必要に応じて `.env.production` などのNext.js `.env` ファイルで `NEXT_PUBLIC_SITE_URL` を設定します。`.env` / `.dev.vars` はコミットしません。

未設定時は Vercel の `VERCEL_URL`、それも無い場合は `https://macaroni-wheat.vercel.app` を使います。Cloudflare検証時はこのfallbackに頼らず、Preview URLまたは切替予定ドメインを明示してください。

## Cloudflare Workers Preview

このブランチではOpenNextの最小構成を追加しています。

- `open-next.config.ts`: `defineCloudflareConfig()` を使用し、OpenNext用buildは `npm run build:cloudflare` を指定
- `wrangler.jsonc`: `.open-next/worker.js` と `.open-next/assets` を指定
- `.open-next/`: build生成物のためgit管理外

通常の `npm run build` はVercel継続用として残します。WindowsのWrangler previewではOpenNext + Turbopack buildのchunk解決が不安定だったため、Cloudflare用のNext buildだけWebpackへ分けています。

admin APIはローカル専用のままです。Cloudflare本番上でJSONを永続編集する対応はしていません。`/api/admin/*` はproductionでは403になり、公開運用で `MACARONI_ADMIN_ENABLED` を設定しない前提です。

Preview前の基本チェック:

```bash
npm run validate
npm run typecheck
npm run build
npm run preview
```

`npm run preview` はOpenNext用ビルドも実行し、WranglerでローカルのWorkers runtimeを起動します。表示されたlocalhost URLで以下を確認してください。

```text
/
/products
/products?subtag=character-chocolat
/products?category=motion
/products/sexy-pose-kumaly
/product-sexy-pose-kumaly.html
/ja/product-sexy-pose-kumaly.html
/en/product-sexy-pose-kumaly.html
/blog.html
/sitemap.xml
/robots.txt
/character-ichigo.html
/FreePose/ICHIGO_FreePose_10.zip
/api/admin/products
/api/admin/free-poses
/api/admin/top-cards
```

確認ポイント:

- `/`, `/products`, `/products/[slug]` が200で表示される
- 旧HTML URLが意図したURLへredirectする
- `sitemap.xml` と `robots.txt` のURLが `NEXT_PUBLIC_SITE_URL` 基準になる
- FreePose ZIPが200で取得できる
- production相当では `/api/admin/*` が403のまま
- ブラウザconsoleに公開ページ由来のerrorが出ない

## 本番切替前チェックリスト

- Vercel本番を残したままCloudflare Preview URLで表示比較する
- CloudflareのBuild variables and secretsに `NEXT_PUBLIC_SITE_URL` を設定する
- CloudflareのRuntime environment variablesにも `NEXT_PUBLIC_SITE_URL` を設定する
- `npm run validate` / `npm run typecheck` / `npm run build` / `npm run preview` が通る
- 公開トップ、商品一覧、商品詳細、静的HTML、sitemap、robots、旧URL redirect、FreePose ZIPを確認する
- admin APIはCloudflare本番ではローカル専用扱いのまま閉じる
- Cloudflare側のPreview URLでcanonical/OGP/sitemapが切替予定ドメインまたはPreview用URLを指すことを確認する

## 本番DNS切替してよい条件

- Preview URLで主要公開ページと旧URL redirectがVercel本番と同等に動く
- `NEXT_PUBLIC_SITE_URL` を本番ドメインに設定したCloudflare buildでsitemap/robots/canonical/OGPが正しい
- FreePose ZIP配布がCloudflare Assets経由で成功する
- `/api/admin/*` がCloudflare本番相当で403になり、JSON永続書き込みを公開していない
- Vercelへ戻せるDNS rollback手順を用意している
- Cloudflareの独自ドメイン、SSL/TLS、cache、redirect挙動を確認済み

## データ管理

商品データは `data/products.json` を中心に管理します。`published:false` の商品は `/products/[slug]` の静的生成対象から外れ、商品ページでは `notFound()` になります。`noindex:true` を使う場合は、metadata側で検索対象外にする前提です。

## 旧HTML互換

`next.config.ts` の redirects で旧URLをNext.js版へ転送します。

- `booth.html` -> `/products`
- `product-*.html` -> `/products/[slug]`
- `/ja/terms.html` -> `/terms.html`
- `/ja/characters.html` -> `/characters.html`
- `/blog.html` -> `/tips.html`

これらのredirectはVercel/Next.js上で動作します。GitHub Pagesで静的HTMLとして配信している場合は、Next.jsのredirectは実行されません。

## デプロイ

詳細は [docs/deploy.md](docs/deploy.md) を参照してください。
