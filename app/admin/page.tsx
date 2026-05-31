import Link from "next/link";

const adminLinks = [
  {
    href: "/admin/products",
    title: "商品管理",
    description: "data/products.json の商品LP、一覧、関連商品向けデータを編集します。",
  },
  {
    href: "/admin/free-poses",
    title: "無料ポーズ管理",
    description: "data/free-poses.json の対応キャラ、サムネイル画像、ダウンロードURL、公開状態、検索除外を編集します。",
  },
  {
    href: "/admin/top-cards",
    title: "トップカード管理",
    description: "data/top-cards.json の商品リンクカード、おすすめカード、スライドカード、商品導線カードを編集します。",
  },
];

export default function AdminPage() {
  return (
    <main className="admin-page">
      <section className="section admin-shell" aria-labelledby="admin-title">
        <div className="admin-heading">
          <div>
            <p>ローカル管理</p>
            <h1 id="admin-title">管理メニュー</h1>
          </div>
          <span>ローカル運用向け</span>
        </div>
        <p className="admin-lead">
          商品管理、無料ポーズ管理、トップカード管理を分けて編集します。保存はローカルJSONのみで、本番環境では無効です。
        </p>
        <div className="admin-menu-grid">
          {adminLinks.map((link) => (
            <Link className="admin-menu-card" href={link.href} key={link.href}>
              <strong>{link.title}</strong>
              <span>{link.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
