import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminProductEditor } from "@/components/AdminProductEditor";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: null,
  twitter: null,
};

export default function AdminPage() {
  if (process.env.MACARONI_ADMIN_ENABLED !== "1") {
    notFound();
  }

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
          商品データを軽く編集するための画面です。新規商品テンプレ、draft分離、slug・gallery確認を使って
          `data/products.json` をローカルで更新します。
        </p>
        <AdminProductEditor products={products} />
      </section>
    </main>
  );
}
