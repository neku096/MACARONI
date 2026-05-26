import Link from "next/link";
import { AdminSlideLinkEditor } from "@/components/AdminSlideLinkEditor";
import { getAllSlideLinks } from "@/lib/slide-links";

export default function AdminSlideLinksPage() {
  const slideLinks = getAllSlideLinks();

  return (
    <main className="admin-page">
      <section className="section admin-shell" aria-labelledby="admin-slide-links-title">
        <div className="admin-heading">
          <div>
            <p>Local Admin</p>
            <h1 id="admin-slide-links-title">slide-links.json 編集</h1>
          </div>
          <Link className="button compact" href="/admin">
            管理メニューへ
          </Link>
        </div>
        <p className="admin-lead">
          リンク集カードのtitle、description、URL、サムネイル、カテゴリ、公開状態を管理します。URL先の取得や解析は行いません。
        </p>
        <AdminSlideLinkEditor slideLinks={slideLinks} />
      </section>
    </main>
  );
}
