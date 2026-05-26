import Link from "next/link";
import { AdminTopCardEditor } from "@/components/AdminTopCardEditor";
import { getAllTopCards } from "@/lib/top-cards";

export default function AdminTopCardsPage() {
  const topCards = getAllTopCards();

  return (
    <main className="admin-page">
      <section className="section admin-shell" aria-labelledby="admin-top-cards-title">
        <div className="admin-heading">
          <div>
            <p>Local Admin</p>
            <h1 id="admin-top-cards-title">top-cards.json 編集</h1>
          </div>
          <Link className="button compact" href="/admin">
            管理メニューへ
          </Link>
        </div>
        <p className="admin-lead">
          Topページの商品リンクカード、おすすめカード、スライドカード、商品導線カードを管理します。URL先の取得や解析は行いません。
        </p>
        <AdminTopCardEditor topCards={topCards} />
      </section>
    </main>
  );
}
