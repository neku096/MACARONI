# 旧HTML商品LP差分表

P2対応は、新仕様追加ではなく「旧HTML仕様をNext.jsへそのまま継承する」方針で整理します。

## 商品LP仕様

| 旧HTMLにあった仕様 | Next.jsでの状態 | メモ |
| --- | --- | --- |
| 商品画像ギャラリー | 継承済み | `galleryImages` を `data/products.json` に移行し、旧 `product-gallery-data` 相当の画像パスを使います。 |
| メイン画像クリック拡大 | 継承済み | `ProductGallery` でライトボックス表示に戻しました。 |
| ライトボックスの閉じるボタン | 継承済み | 閉じるボタン、背景クリック、Escで閉じます。 |
| ライトボックスの前後移動 | 継承済み | 矢印ボタン、キーボード左右キー、スマホ横スワイプに対応しています。 |
| サムネイルクリックで画像切り替え | 継承済み | インラインサムネイルとライトボックス内サムネイルを同期します。 |
| 商品概要タグ | 継承済み | 旧HTMLの `product-summary-tags` を `summaryTags` として移行しました。 |
| 購入前注意文 | 継承済み | 旧HTMLの `product-note` を `purchaseNote` として移行しました。 |
| 商品詳細 / 導入方法 / 同梱内容 / FAQ | 継承済み | 旧HTMLの `product-detail-block booth-description` を `detailSections` として移行し、同じHTML構造で表示します。 |
| 対応アバターの長い一覧 | 継承済み | 旧HTMLと同じ `product-avatar-list` 構造で表示します。 |
| 対応アバター一覧の折り畳み | 継承済み | 旧 `script.js` の行数判定に近いDOM計測で、3行超過時に折り畳みます。 |
| スマホ版パンくず折り畳み | 継承済み | 旧 `script.js` と同じく640px以下で2行超過時に折り畳みます。 |
| 下部の通常タグ / サブタグ | 継承済み | 旧HTML同様、マテリアル商品以外に表示します。 |
| 下部サブタグの折り畳み | 継承済み | 旧 `script.js` と同じく3行超過時に折り畳みます。 |
| 関連商品 | 継承済み | 旧HTMLから抽出した `relatedIds` を優先し、勝手な自動補完をしません。 |
| 関連商品見出し横のBOOTH一覧ボタン | 継承済み | `section-heading` と `button secondary` を使います。 |
| パンくずリンク | 継承済み | 旧 `booth.html?...` はNext側で効く `/products?...` に置き換えています。 |
| CTA | 継承済み | 旧HTMLと同じ購入リンク、ボタン文言を `salesLinks` から表示します。 |
| SEO / OGP | 一部継承 | headを丸ごと移植せず、Next.jsの `metadata` と `productJsonLd()` で生成しています。 |
| JSON-LD | 一部継承 | `products.json` 由来の構造化データを生成します。旧HTMLと完全一致するかは商品別確認が必要です。 |

## 意図的に変えた箇所

| 箇所 | 変更内容 | 理由 |
| --- | --- | --- |
| 旧 `booth.html` リンク | `/products` に変更 | Next.js App Router側の商品一覧で絞り込みを実際に効かせるためです。 |
| 旧 `product-*.html` リンク | `/products/[slug]` に変更 | 商品LP自動生成と旧URLリダイレクトを維持するためです。 |
| SEO / OGP | Next.js metadata生成 | 旧HTMLのhead直貼りではなく、Next.js側のSEO生成を維持するためです。 |

## 未継承または手動確認が必要な箇所

| 項目 | 状態 | 次の確認 |
| --- | --- | --- |
| 商品別SEO文言の完全一致 | 要確認 | 旧HTMLのtitle / description / OGP / JSON-LDとNext生成結果を商品別に比較します。 |
| ライトボックスの細かなドラッグ挙動 | 一部簡略 | クリック、背景クリック、Esc、左右移動、スワイプは継承済み。旧HTMLのドラッグ細部は必要に応じて再現します。 |
| 英語商品LP | 未継承 | 現在は日本語Next LP中心です。英語静的ページのApp Router化は別タスクです。 |
| 商品別文言の目視 | 要確認 | `product-*.html` 全20商品から抽出済みですが、BOOTH購入導線前に主要商品を目視確認します。 |
