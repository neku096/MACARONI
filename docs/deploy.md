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
