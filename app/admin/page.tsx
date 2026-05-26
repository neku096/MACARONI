import Link from "next/link";

const adminLinks = [
  {
    href: "/admin/products",
    title: "商品管理",
    description: "data/products.json の商品LP、一覧、関連商品向けデータを編集します。",
  },
  {
    href: "/admin/free-poses",
    title: "無料配布ポーズ管理",
    description: "data/free-poses.json の無料配布anim、サムネイル、公開状態を編集します。",
  },
  {
    href: "/admin/slide-links",
    title: "スライドリンク集カード管理",
    description: "data/slide-links.json の外部リンクカード、カテゴリ、公開状態を編集します。",
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
          商品管理、無料配布ポーズ、リンク集カードを分けて編集します。保存はローカルJSONのみで、productionでは無効です。
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
