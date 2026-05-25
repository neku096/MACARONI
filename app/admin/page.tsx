import type { Metadata } from "next";
import { AdminProductEditor } from "@/components/AdminProductEditor";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  const products = getAllProducts();

  return (
    <main className="admin-page">
      <section className="section admin-shell" aria-labelledby="admin-title">
        <div className="admin-heading">
          <div>
            <p>Local Admin</p>
            <h1 id="admin-title">products.json 編集</h1>
          </div>
          <span>ローカル運用向け</span>
        </div>
        <p className="admin-lead">
          商品データを軽く編集するための画面です。保存APIはlocalhostからのアクセス時だけ `data/products.json`
          を更新します。
        </p>
        <AdminProductEditor products={products} />
      </section>
    </main>
  );
}
