import Link from "next/link";
import { AdminProductEditor } from "@/components/AdminProductEditor";
import { getAllProducts } from "@/lib/products";

export default function AdminProductsPage() {
  const products = getAllProducts();

  return (
    <main className="admin-page">
      <section className="section admin-shell" aria-labelledby="admin-products-title">
        <div className="admin-heading">
          <div>
            <p>Local Admin</p>
            <h1 id="admin-products-title">products.json 編集</h1>
          </div>
          <Link className="button compact" href="/admin">
            管理メニューへ
          </Link>
        </div>
        <p className="admin-lead">
          商品データを軽く編集するための画面です。新規商品テンプレ、draft分離、slug・gallery確認を使って
          `data/products.json` をローカルで更新します。
        </p>
        <AdminProductEditor products={products} />
      </section>
    </main>
  );
}
