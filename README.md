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
- `npm run start`: ビルド済みアプリを起動

## 本番公開方針

Next.js版の本番公開は **Vercel推奨** です。`/products` と `/products/[slug]` を本番URLとして動かす前提のため、GitHub Pages旧HTML公開とはURL仕様が異なります。

GitHub Pagesは旧HTML公開用として残せますが、Next.js版の本番URLとしては扱いません。GitHub PagesでNext.js版を公開する場合は、`basePath` / `assetPrefix` / static export などの追加設計が必要です。現時点では追加していません。

## 環境変数

Vercel Productionに必ず以下を設定してください。

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
```

`NEXT_PUBLIC_SITE_URL` は canonical、OGP URL、sitemap、robots の基準URLになります。未設定時は Vercel の `VERCEL_URL`、それも無い場合は `http://localhost:3000` を使います。

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
