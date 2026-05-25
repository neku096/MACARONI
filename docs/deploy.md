# Vercel Deployment

このプロジェクトのNext.js版は、Vercelで本番公開する方針です。

## 方針

- 本番URLは Vercel Production または独自ドメイン直下を正とします。
- GitHub Pagesの `https://neku096.github.io/MACARONI` は旧HTML公開用として扱い、Next.js版のcanonical基準にはしません。
- `basePath` / `assetPrefix` / `output: "export"` は追加していません。

## Vercelで設定する環境変数

Production環境に以下を設定してください。

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
```

例:

```bash
NEXT_PUBLIC_SITE_URL=https://macaroni.example.com
```

このURLは以下に使われます。

- canonical
- OGP URL
- OGP image
- sitemap.xml
- robots.txt の sitemap URL
- 商品JSON-LDの画像URL

## ローカルadmin

`/admin` は `data/products.json` を編集するためのローカル運用向け画面です。本格CMSではなく、DBや認証は導入していません。

公開運用では、Production環境に `MACARONI_ADMIN_ENABLED` を設定しないでください。`MACARONI_ADMIN_ENABLED=1` の時だけ `/admin` を表示し、それ以外は404になります。

保存APIの `/api/admin/products` は、本番環境では常に `403` を返します。ローカル開発時のみ、localhostからのPUTで `data/products.json` を更新できます。

ローカルでadminを使う場合:

```bash
MACARONI_ADMIN_ENABLED=1 npm run dev
```

認証なしでadminを公開運用することは非推奨です。将来CMS化する場合は、保存API側にも必ず認証・認可を追加してください。

## 公開前チェック

1. Vercel ProjectをGitHubリポジトリに接続します。
2. Production環境に `NEXT_PUBLIC_SITE_URL` を設定します。
3. Build Commandは `npm run build` を使います。
4. Output DirectoryはNext.js標準のままにします。
5. デプロイ後、以下を確認します。

```text
/
/products
/products?subtag=character-chocolat
/products?category=motion
/products/sexy-pose-kumaly
/blog.html
/sitemap.xml
/robots.txt
```

## 本番公開後チェック

2026-05-25時点の確認結果です。

- 本番URL: `https://macaroni-wheat.vercel.app`
- `NEXT_PUBLIC_SITE_URL` は `https://macaroni-wheat.vercel.app` で設定済みです。
- `/`、`/products`、`/products/sexy-pose-kumaly` は `200 OK` です。
- `/blog.html` は `/tips.html` へredirectします。
- `sitemap.xml` と `robots.txt` は本番URL基準です。
- Playwright確認でconsole warning/errorはありません。
- Vercel MCPではproject取得が未完了ですが、実サイト確認はOKです。
- Vercel Analytics Draft PRは旧HTML向けのため、Next.js移行作業にはマージしない方針です。

## GitHub Pagesについて

GitHub Pagesは旧HTMLを公開し続ける場合だけ利用します。Next.js版の `/products` や `/products/[slug]` は、GitHub Pagesの静的HTML配信ではそのまま動きません。

GitHub PagesへNext.js版を移す場合は、別途以下の設計が必要です。

- `basePath`
- `assetPrefix`
- static export
- 旧HTML redirectの代替

現時点では、これらは未対応です。
