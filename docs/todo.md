# TODO

## 安全に進める整理

- `public/*.html` のうちNext.jsページへ完全移行できるものを洗い出す
- root旧HTMLを `legacy/html/` へ移動する場合のscript影響を検証する
- root `script.js` と `public/script.js` の差分を確認し、どちらを正とするか決める
- root `images/` と `public/images/` の重複を確認する
- root `Macaroni_Samune/` と `public/Macaroni_Samune/` の重複を確認する

## 削除候補

削除はまだしないでください。別タスクで参照確認、build、主要URL確認、Vercel確認を通してから実施します。

- `.next-dev-3100/`
- `.next-dev-3101/`
- `tsconfig.preview-3100.json`
- `tsconfig.preview-3101.json`
- root旧HTML一式
- root `script.js`
- root `age-gate-boot.js`
- root `characters.js`
- root `sitemap.xml`
- root `robots.txt`
- root `site.webmanifest`
- root `favicon.ico`

## 旧HTML仕様の完全継承

- 商品詳細構造の完全data化
- FAQ/data化
- 旧HTMLとの差分の継続監査
- ライトボックスとスライダー挙動の回帰確認

## SEO改善候補

- 商品JSON-LDの価格情報追加
- 短いdescriptionの見直し
- sitemap対象ページの再確認
- `published:false` / `noindex:true` 運用ルールの明文化

## 画像最適化

- 一覧初期表示画像の読み込み枚数確認
- 重複画像ディレクトリの整理
- WebPサムネイルの存在チェックをscript化

## 将来の多言語対応

- EN静的HTMLをNext.js側に統合するか判断
- JP/EN切替のURL設計を決める
- hreflang/canonical方針を決める
