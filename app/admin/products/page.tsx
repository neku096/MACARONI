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
            <p>ローカル管理</p>
            <h1 id="admin-products-title">商品管理</h1>
          </div>
          <Link className="button compact" href="/admin">
            管理メニューへ
          </Link>
        </div>
        <p className="admin-lead">
          商品データを軽く編集するための画面です。新規商品テンプレ、下書き分離、URL識別子・ギャラリー確認を使って
          data/products.json をローカルで更新します。
        </p>
        <AdminProductEditor products={products} />
      </section>
    </main>
  );
}
