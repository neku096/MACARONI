# Legacy HTML Parity Audit

旧HTML版を正として、Next.js版へ継承した仕様と残差分を整理する。

| 対象 | 旧HTML仕様 | Next.js移行直後の差分 | 今回の状態 | 優先度 |
| --- | --- | --- | --- | --- |
| トップ商品スライダー | `product-slider` + `data-slider` で自動スライド、ドラッグ、スワイプ、ドット表示 | 静的な商品グリッドに置き換わっていた | 旧クラス/旧data属性のスライダー構造へ復元。リンク先は内部 `/products/[slug]` を維持 | P1 |
| トップ無料素材スライダー | `material-slider` で対応キャラカードを2段スライド表示 | セクション自体が落ちていた | 旧クラス/旧data属性で復元 | P1 |
| 商品一覧フィルター | `booth-filter-panel`、`booth-subtag-panel`、検索、並び替え、12件ページング | 独自のカテゴリ/タグ/対応キャラUIになっていた | 旧HTMLのフィルター構造へ復元。`tag` / `subtag` / `category` 互換も維持 | P1 |
| 商品一覧カード | `booth-list-thumb` の画像サムネイルのみ表示。プラム・ショコラは別カード | 汎用 `ProductCard` 表示になっていた | 旧HTMLから抽出した `catalogCards` を使い、旧表示密度へ復元 | P1 |
| 商品詳細ギャラリー | サムネイル切替、横ドラッグ、ライトボックス、左右移動、Esc/背景クリック閉じ | 別タブ画像リンクになっていた | 旧 `script.js` の対象data属性を復元し、旧ライトボックスを使用 | P1 |
| 商品詳細本文 | 旧HTMLの商品別「商品詳細 / 導入方法 / 同梱内容 / FAQ」 | 汎用文になっていた | 旧 `product-*.html` から `detailArticles` として抽出し表示 | P1 |
| 関連商品 | 旧HTMLに明示された関連カード | relatedIds + 自動補完で並びが変わる可能性あり | 旧HTMLの関連リンクを `relatedIds` に反映し、最大4件表示 | P1 |
| 商品タグ/サブタグ | 商品下部に通常タグ/サブタグを表示 | Next詳細では落ちていた | 旧HTMLから抽出し、内部 `/products?...` リンクで復元 | P1 |
| 共有モーダル | `data-share-button` から旧モーダルを生成、X/LINE/URLコピー、Esc閉じ | `navigator.share` / clipboardのみ | 旧 `script.js` の共有モーダルに戻すため `data-share-button` を復元 | P1 |
| 年齢確認 | localStorage key は `ageConfirmed`、`age-gate-boot.js` で初期非表示 | `macaroni-age-confirmed` を使っていた | `ageConfirmed` に統一し、boot scriptを読み込み | P1 |
| JP/EN切替 | 旧HTMLはJP/EN導線、旧JSには `data-lang-button` 翻訳機構あり | ENリンクが実質JPへ戻っていた | `data-lang-button` を付け、旧JS翻訳機構を使用 | P2 |
| 旧HTML URL | `product-*.html` / `booth.html` から遷移 | 一部のみredirect | 商品LPと主要 `/ja/*` ページredirectを維持/追加 | P1 |
| 1920幅密度 | 旧CSSの横幅/カード密度 | Next独自グリッドで密度差 | 旧CSSクラスへ戻し、Playwrightで確認予定 | P1 |

## 意図的に維持した差分

- BOOTH直リンクではなく、商品カードの遷移先は内部 `/products/[slug]` を維持する。
- Next.jsの `data/products.json`、`/products/[slug]`、SEO/OGP生成、旧HTMLリダイレクトは維持する。

## 残確認

- Playwrightで `1920x1080` / `1440x900` / `390x844` のトップ、一覧、商品詳細を確認する。
- `/products/shark-summon` と `/products/whale-summon` はこのプロジェクトの `data/products.json` に存在するか確認し、存在しない場合は残差分として報告する。
