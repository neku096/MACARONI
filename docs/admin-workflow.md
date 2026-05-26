# Admin Workflow

`/admin` はローカルで管理用JSONを編集するための軽量ツールです。DB、認証、本番admin運用は前提にしていません。

管理画面:

- `/admin/products`: `data/products.json` の商品LP管理
- `/admin/free-poses`: `data/free-poses.json` の対応キャラ別無料ポーズ管理
- `/admin/top-cards`: `data/top-cards.json` のTopページ表示カード管理

## 起動

```bash
MACARONI_ADMIN_ENABLED=1 npm run dev
```

本番環境では `MACARONI_ADMIN_ENABLED` を設定しないでください。保存APIは production では常に `403` を返します。

### Windows bat

ローカル運用では、プロジェクト直下の `.bat` を使えます。いずれも `D:\Codex\MACARONI` 前提です。

- `start-local.bat`: `MACARONI_ADMIN_ENABLED=1` を設定して `npm run dev` を起動します。`/admin`、`/admin/products`、`/admin/free-poses`、`/admin/top-cards` を編集する時に使います。
- `start-prod-preview.bat`: `npm run build` 後に `npm run start` を起動します。production preview 用なので、adminは無効で `/admin` は404になります。
- `stop-node.bat`: 3000〜3999番で待ち受けている Node.js process を表示し、確認後に停止します。停止対象を見てから `y` を入力してください。

## 新商品追加フロー

1. BOOTH商品ページから、商品名、価格、対応アバター、同梱内容、注意事項を確認します。
2. `public/products/<slug>/` に商品画像を配置します。
3. gallery画像は以下の命名を基本にします。

```text
public/products/<slug>/<galleryPrefix>-01.webp
public/products/<slug>/<galleryPrefix>-01-600.webp
public/products/<slug>/<galleryPrefix>-02.webp
public/products/<slug>/<galleryPrefix>-02-600.webp
```

4. `/admin` で「新規商品作成」を押します。
5. `slug` を決めます。英小文字、数字、ハイフンのみを使います。
6. 「slugから一括生成」で `galleryPrefix` と gallery path を揃えます。
7. 必要に応じて「coverをgallery[0]に同期」を押します。
8. title、shortTitle、description、category、tags、avatars、price を入力します。
9. 商品詳細、導入方法、同梱内容、FAQ、注意事項をテンプレから整えます。
10. `relatedIds` を必要な分だけ設定します。未確定なら空欄で問題ありません。
11. draft状態では `published:false`、`noindex:true` を維持します。
12. 保存して `data/products.json` の差分を確認します。
13. `npm run validate:products` を実行します。
14. `npm run build` を実行します。
15. 公開する直前に `published:true` へ変更し、検索対象にする場合だけ `noindex` を外します。
16. commit / push 後、Vercelの反映を確認します。

## 既存商品から複製する場合

似た商品を追加する場合は、商品一覧の「複製」ボタンを使います。

複製時に自動変更される項目:

- `id`
- `slug`
- `legacyPath`
- `title` / `shortTitle` の「コピー」追加
- `published:false`
- `noindex:true`
- `coverImage` / `ogImage` の候補
- `galleryPrefix`
- catalog cardの画像候補

複製時に引き継がれる項目:

- gallery枚数
- FAQ / 商品詳細HTML
- tags
- relatedIds
- avatars
- specs
- salesLinks

複製後は draft 一覧へ移動します。保存前に `slug`、画像パス、BOOTHリンク、商品詳細本文、catalog card内容を必ず確認してください。

## slug運用

- slugは商品URL `/products/<slug>` と画像フォルダの基準になります。
- 公開済み商品のslugを変更した場合、旧URLから新URLへのredirectを検討してください。
- adminでは重複slugを警告し、重複中は保存ボタンを無効化します。
- 使用済みslugは基本情報カード内の「使用済みslugを表示」から確認できます。

## draft / noindex

- 新規商品は draft として作成されます。
- draft商品は `published:false`、`noindex:true` が初期値です。
- `published:false` の商品は商品LPの静的生成対象から外れ、直接URLでも404になります。
- 公開前の商品を誤ってsitemapへ出さないため、公開直前まで draft のままにします。

## validate

```bash
npm run validate:products
npm run validate:free-poses
npm run validate:top-cards
npm run validate
```

チェック対象:

- slug重複
- missing image
- relatedIds不整合
- title / description / category 不足
- FAQ空
- gallery空
- OGP不足候補
- draft商品のnoindex状態
- 対応キャラ別無料ポーズのローカルthumbnail / downloadUrl / noindex
- Topページ表示カードのURL形式とローカルthumbnail

エラーが出た場合は公開前に修正してください。warningは内容を確認し、意図した状態なら許容できます。

## 画像配置メモ

- `coverImage` と `ogImage` は public root から始まるパスにします。
- galleryは通常画像と `-600.webp` のサムネイルをセットで置きます。
- adminのgallery previewに表示される `src` と `thumb` が実ファイルと一致するか確認します。

## 将来CMS化する場合

- 保存APIに認証・認可を追加します。
- products.json 以外の保存先を使う場合は、sitemap、metadata、商品一覧、商品LP生成の読み込み口を統一します。
- 画像アップロード、BOOTH URL取り込み、slug redirect生成は次の自動化候補です。
