import Link from "next/link";

const adminLinks = [
  {
    href: "/admin/products",
    title: "商品管理",
    description: "data/products.json の商品LP、一覧、関連商品向けデータを編集します。",
  },
  {
    href: "/admin/free-poses",
    title: "対応キャラ別無料ポーズ管理",
    description: "data/free-poses.json の対応キャラ、サムネイル、downloadUrl、公開状態、noindexを編集します。",
  },
  {
    href: "/admin/top-cards",
    title: "Topページ表示カード管理",
    description: "data/top-cards.json の商品リンクカード、おすすめカード、スライドカード、商品導線カードを編集します。",
  },
];

export default function AdminPage() {
  return (
    <main className="admin-page">
      <section className="section admin-shell" aria-labelledby="admin-title">
        <div className="admin-heading">
          <div>
            <p>Local Admin</p>
            <h1 id="admin-title">管理メニュー</h1>
          </div>
          <span>ローカル運用向け</span>
        </div>
        <p className="admin-lead">
          商品管理、対応キャラ別無料ポーズ、Topページ表示カードを分けて編集します。保存はローカルJSONのみで、productionでは無効です。
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
