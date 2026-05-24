import Link from "next/link";

export default function NotFound() {
  return (
    <main className="text-page">
      <section className="section text-section" aria-labelledby="not-found-title">
        <div className="text-panel">
          <p className="eyebrow">404</p>
          <h1 id="not-found-title">ページが見つかりません</h1>
          <p>商品が非公開、またはURLが変更された可能性があります。</p>
          <Link className="button primary" href="/products">
            商品一覧へ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
