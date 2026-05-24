# MACARONI Next.js Site

R18 BOOTHプロモーションサイトを、既存の静的HTML互換を残しながらNext.js App Routerへ移行しているプロジェクトです。トップページ、商品一覧、商品LPはNext.js側で表示し、商品データは `data/products.json` を中心に管理します。

## 現在の安定版メモ

この状態では、レビューで指摘されたP1項目を反映済みです。

- 年齢確認キーは旧HTMLと同じ `ageConfirmed` に統一済み
- Next.jsページと旧HTMLページで年齢確認状態を共有
- `/products?subtag=character-chocolat` のような旧BOOTH由来のキャラ絞り込みURLに対応
- `/products?category=motion` のような旧カテゴリURLをNext側の `universal` 表示へ互換変換
- 商品LPのカテゴリパンくずは、実際に絞り込みが効く `/products?category=...` へリンク
- `/ja/characters.html`、`/ja/terms.html` などの `/ja/*` 静的URLは既存ページへリダイレクト
- GitHub Pages向けの `basePath` / `assetPrefix` / `output: "export"` は未設定
- P2は新仕様追加ではなく、旧HTMLの商品LP仕様をNext.jsへ継承する方針で整理

未対応のP2項目は [docs/todo.md](docs/todo.md) に整理しています。
旧HTMLとの差分表は [docs/legacy-diff.md](docs/legacy-diff.md) に整理しています。

## セットアップ

初回は依存パッケージをインストールしてください。

```bat
npm install
```

Windowsでは、プロジェクト直下の `preview-next.bat` をダブルクリックするとNext.jsの開発サーバーを起動できます。

- 既定ポートは `3100`
- `3100` が使用中なら `3101`, `3102`, `3103`... の順に空きポートを探します
- 起動後に `http://localhost:<port>` と `http://localhost:<port>/products` を開きます
- batから起動したdevサーバーは、競合しにくいように `.next-dev-<port>` と `tsconfig.preview-<port>.json` を一時ファイルとして使います

## npm scripts

```bat
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

- `npm run dev`: 開発サーバーを起動
- `npm run build`: 本番ビルド
- `npm run start`: ビルド済みアプリを起動
- `npm run lint`: ESLint検証
- `npm run typecheck`: TypeScript検証

`.next` が壊れている、または開発サーバーの挙動がおかしい場合は、生成キャッシュを削除してから再起動してください。

```bat
rmdir /s /q .next
rmdir /s /q .next-dev-3100
rmdir /s /q .next-dev-3101
del tsconfig.preview-*.json
npm run dev
```

## products.json の構造

商品データは `data/products.json` に置きます。主な項目は以下です。

- `id`: 内部ID。関連商品や人気順のキーに使います
- `slug`: Next.jsの商品URL `/products/[slug]` に使います
- `legacyPath`: 旧HTMLの商品ページパス
- `published`: `true` の商品だけ一覧、LP生成、sitemap、関連商品に出します
- `title` / `shortTitle` / `description`: LP、SEO、カード表示に使う文言
- `category` / `categoryLabel`: `pose`、`motion`、`solo-motion`、`material` の分類
- `tags`: 商品キーワード
- `avatars`: 対応キャラの一覧
- `price`: 表示用価格
- `coverImage` / `ogImage`: カード画像とOGP画像
- `galleryPrefix` / `galleryCount` / `galleryNumbers`: 商品ギャラリー画像生成
- `summaryTags`: 旧HTMLの商品概要タグ
- `purchaseNote`: 旧HTMLの購入前注意文
- `galleryImages`: 旧HTMLの `product-gallery-data` から移行した画像一覧
- `detailSections`: 旧HTMLの商品詳細、導入方法、同梱内容、FAQのHTML断片
- `specs`: 商品概要の表形式データ
- `salesLinks`: BOOTHなどの購入リンク
- `relatedIds`: 旧HTMLの関連商品表示順として優先表示する商品ID

商品画像は `public/products/` 配下、商品カバーは `public/products/covers/` 配下に配置します。

## 年齢確認仕様

年齢確認は簡易ゲートです。旧HTMLとNext.jsで同じ `localStorage` キーを使います。

- 保存キー: `ageConfirmed`
- 値: `"true"`
- 旧HTML側: `public/age-gate-boot.js` と `public/script.js`
- Next.js側: `app/layout.tsx` と `components/AgeGate.tsx`
- 確認済みの場合、`html.age-confirmed .age-gate` により初期表示のチラつきを抑えます

法的・決済的な年齢確認が必要な場合は、サーバー側や外部サービスで追加対応してください。

## URLクエリ絞り込み仕様

商品一覧 `/products` は旧 `booth.html` 由来のURLをできるだけ受けます。

- `/products?subtag=character-chocolat`: ショコラ対応商品で初期絞り込み
- `/products?avatar=ショコラ`: キャラ名で初期絞り込み
- `/products?category=pose`: ポーズ
- `/products?category=motion`: 汎用モーション
- `/products?category=universal`: 汎用モーション
- `/products?category=solo`: 一人用
- `/products?category=solo-motion`: 一人用
- `/products?category=material`: マテリアル

UI上の種類は `すべて`、`ポーズ`、`汎用`、`一人用`、`マテリアル` です。

## noindex / published:false 仕様

`published: false` の商品は公開対象から外します。

- `getPublishedProducts()` から除外
- `/products` の一覧から除外
- `/products/[slug]` の静的生成対象から除外
- `sitemap.xml` から除外
- 関連商品候補から除外
- 直接アクセス時は `notFound()` 扱いになり、メタデータ側も `index: false` を返します

公開前の商品は `published: false` にしておく運用です。

## 旧HTML互換リダイレクト

`next.config.ts` で旧URLをNext.js URLへ寄せています。

- `/booth.html` → `/products`
- `/ja/booth.html` → `/products`
- `/index.html` → `/`
- `/ja/index.html` → `/`
- `/product-<slug>.html` → `/products/<slug>`
- `/ja/product-<slug>.html` → `/products/<slug>`
- `/ja/:path*` → `/:path*`

`/products/dark-voice-material` は現行データに同名商品が無いため、互換入口として `/products/dosukebe-material` へ一時リダイレクトしています。

## Vercel公開時の設定

現時点のNext.js設定は、Vercelまたは独自ドメイン直下での公開を前提にしています。

- Build Command: `npm run build`
- Output Directory: Next.js標準のまま
- 必要に応じて `NEXT_PUBLIC_SITE_URL` に本番URLを設定
- `basePath`、`assetPrefix`、`output: "export"` は設定しません

`siteUrl` は `NEXT_PUBLIC_SITE_URL` がある場合はそれを使い、無い場合は既定値を使います。sitemap、OGP、canonicalの確認時は本番URLに合わせてください。

## GitHub Pagesについて

GitHub Pagesは現時点では未対応です。サブパス公開を行う場合は、`basePath`、`assetPrefix`、`output: "export"` などの追加設定と、画像パス・内部リンク・リダイレクト代替の再確認が必要です。

## 公開前チェック

- BOOTH側の商品はR-18設定にする
- 無料配布素材にも利用規約を同梱する
- 未成年、無修正、違法アップロード、権利侵害を想起させる素材や説明を置かない
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `/`, `/products`, 主要な `/products/[slug]`、旧HTMLリダイレクト、`/ja/*` リダイレクトを確認
