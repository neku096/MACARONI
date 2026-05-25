# Scripts

このディレクトリはNext.jsのruntimeではなく、移行・検証用の補助scriptを置く場所です。

## extract-legacy-products.mjs

旧HTMLの商品LPと `booth.html` から、`data/products.json` へ移行済みの商品詳細、タグ、関連商品、一覧カード情報を抽出するmigration helperです。

現在はroot直下の旧HTMLを参照します。旧HTMLを `legacy/` へ移動する場合は、このscriptの参照パスも同時に変更してください。

実行前に確認すること:

- `data/products.json` に対象商品の `legacyPath` が残っていること
- root直下の `product-*.html` と `booth.html` が移行元として存在すること
- 実行後に `git diff data/products.json` を確認すること
