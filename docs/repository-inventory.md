# Repository Inventory

Next.js移行後の事故防止用分類です。現時点では、動作中URLを壊さないため削除・大移動は行いません。

## 現役

Next.js runtimeで直接使います。

- `app/`
- `components/`
- `data/products.json`
- `lib/`
- `public/`
- `styles.css`
- `next.config.ts`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next-env.d.ts`
- `.env.example`

## 互換用

直接配信またはredirect互換のため、移動前に確認が必要です。

- `public/*.html`
- `public/script.js`
- `public/age-gate-boot.js`
- `public/characters.js`
- `public/site.webmanifest`
- `public/favicon.ico`
- `public/images/`
- `public/products/`
- `public/Macaroni_Samune/`
- `next.config.ts` の旧HTML redirect

## Legacy参照

Next.js runtimeからは直接参照しませんが、移行確認・抽出・比較に使います。

- root `index.html`
- root `booth.html`
- root `booth-faq.html`
- root `product-*.html`
- root `character-*.html`
- root `characters.html`
- root `tips*.html`
- root `terms.html`
- root `links.html`
- root `script.js`
- root `age-gate-boot.js`
- root `characters.js`
- `ja/`
- `en/`
- root `images/`
- root `FreePose/`
- root `Macaroni_Samune/`

## 削除候補

削除は別タスクで行います。特に `.next-dev-*` は現在追跡済みのため、削除する場合は専用commitで慎重に扱ってください。

- `.next-dev-3100/`
- `.next-dev-3101/`
- `tsconfig.preview-3100.json`
- `tsconfig.preview-3101.json`
- `tsconfig.tsbuildinfo`

## 注意

- `scripts/extract-legacy-products.mjs` はroot `booth.html` とroot `product-*.html` を読むため、旧HTMLを移動すると壊れます。
- `styles.css` はrootにありますが現役です。legacy扱いにしないでください。
- `public/script.js` は旧HTML由来ですが現役runtimeです。root `script.js` と混同しないでください。
- `public/*.html` はVercelで直接配信されるため、Next.jsページへ置き換えるまで移動しないでください。
