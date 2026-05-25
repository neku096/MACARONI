# Legacy

旧HTML資産の移動先として用意した分類ディレクトリです。

現時点では、動いているURLやmigration scriptを壊さないため、実ファイルの大移動はまだ行っていません。移動する場合は `docs/repository-inventory.md` を確認し、対象ファイルの参照元を先に更新してください。

推奨分類:

- `legacy/html/`: root旧HTML
- `legacy/css/`: runtimeから外れた旧CSS
- `legacy/js/`: runtimeから外れた旧JS
- `legacy/reference/`: 比較用メモ、旧sitemap、旧robots、検証用ファイル

移動前に確認すること:

- `public/` 配下ではないこと
- `app/layout.tsx` やNext.js componentから参照されていないこと
- `scripts/extract-legacy-products.mjs` の参照パスを更新したこと
- `npm run build` と主要URL確認が通ること
