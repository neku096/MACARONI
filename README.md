# R18 BOOTH Promotion Site

Next.js App Routerへ段階移行中のR18 BOOTHプロモーションサイトです。既存の静的HTMLページも互換用に残しつつ、商品LPは `data/products.json` から生成できる構成にしています。

## ローカルプレビュー

Windowsでは、プロジェクト直下の `preview-next.bat` をダブルクリックするとNext.jsの開発サーバーを起動できます。

- 既定ポートは `3100`
- `3100` が使用中なら `3101`, `3102`, `3103`... の順に空きポートを探します
- 空きポートで `npm run dev -- -p <port>` を起動します
- 起動後に `http://localhost:<port>` と `http://localhost:<port>/products` をブラウザで開きます
- 同じbatをもう一度起動した場合も、先に起動済みのポートを避けて別ポートを使います

初回などで `node_modules` が無い場合は、bat内で `npm install` の実行を促します。手動で準備する場合は、先に以下を実行してください。

```bat
npm install
```

`.next` が壊れている、または開発サーバーの挙動がおかしい場合は、Next.jsの生成キャッシュを削除してから再起動してください。

```bat
rmdir /s /q .next
npm run dev
```

## 差し替える場所

- `data/products.json` に商品データを追加・編集
- 商品画像は `public/products/` 配下に配置
- `index.html` など既存静的ページの `href="#"` をBOOTHショップ、商品ページ、X、問い合わせ先に変更
- `character-kumaly.html` の `download` リンクを無料配布ファイルのURLまたはファイルパスに変更
- `マカロニ` を活動名またはブランド名に合わせて変更
- 商品名、利用条件、説明文を実際の素材内容に合わせて変更

## 公開前チェック

- BOOTH側の商品はR-18設定にする
- 無料配布素材にも利用規約を同梱する
- 未成年、無修正、違法アップロード、権利侵害を想起させる素材や説明を置かない
- 年齢確認は簡易ゲートです。法的・決済的な年齢確認が必要な場合は、サーバー側や外部サービスで追加対応してください
