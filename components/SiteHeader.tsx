"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShareButton } from "@/components/ShareButton";

export function SiteHeader() {
  const pathname = usePathname();
  const isProductsPage = pathname === "/products" || pathname.startsWith("/products/");
  const productSlug = pathname.startsWith("/products/") ? pathname.slice("/products/".length) : "";
  const japaneseHref = productSlug ? `/products/${productSlug}` : isProductsPage ? "/products" : "/";
  const englishHref = productSlug ? `/en/product-${productSlug}.html` : isProductsPage ? "/en/booth.html" : "/en/index.html";

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="トップへ">
        <img
          className="brand-logo"
          src="/images/macaroni-logo.webp"
          alt="マカロニ"
          width="720"
          height="209"
          decoding="async"
        />
        <span className="brand-subtitle">R18 ３Dポーズ素材無料配布サイト</span>
      </Link>
      <nav className="nav" aria-label="メインナビゲーション">
        <Link href="/characters.html">対応キャラ</Link>
        <Link href="/products" aria-current={isProductsPage ? "page" : undefined} aria-label="BOOTH">
          BOOTH作品
        </Link>
        <Link href="/tips.html">使い方</Link>
        <Link href="/terms.html">利用規約</Link>
      </nav>
      <div className="header-actions">
        <div className="language-switch" role="group" aria-label="Language">
          <Link className="language-option" href={japaneseHref} aria-pressed="true">
            JP
          </Link>
          <Link className="language-option" href={englishHref} aria-pressed="false">
            EN
          </Link>
        </div>
        <ShareButton />
      </div>
    </header>
  );
}
