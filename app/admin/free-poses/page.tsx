import Link from "next/link";
import { AdminFreePoseEditor } from "@/components/AdminFreePoseEditor";
import { getAllFreePoses } from "@/lib/free-poses";

export default function AdminFreePosesPage() {
  const freePoses = getAllFreePoses();

  return (
    <main className="admin-page">
      <section className="section admin-shell" aria-labelledby="admin-free-poses-title">
        <div className="admin-heading">
          <div>
            <p>Local Admin</p>
            <h1 id="admin-free-poses-title">free-poses.json 編集</h1>
          </div>
          <Link className="button compact" href="/admin">
            管理メニューへ
          </Link>
        </div>
        <p className="admin-lead">
          対応キャラ別の無料配布ポーズを管理します。character、サムネイル、downloadUrl、公開状態、noindexを編集できます。外部取得は行いません。
        </p>
        <AdminFreePoseEditor freePoses={freePoses} />
      </section>
    </main>
  );
}
