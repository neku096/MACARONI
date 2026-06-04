"use client";

import { usePathname } from "next/navigation";
import { ShareButton } from "@/components/ShareButton";

export function SiteHeader() {
  const pathname = usePathname();
  const isProducts = pathname === "/products" || pathname.startsWith("/products/");

  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="トップへ">
        <img
          className="brand-logo"
          src="/images/macaroni-logo.webp"
          alt="MACARONI"
          width="720"
          height="209"
          decoding="async"
        />
        <span className="brand-subtitle">R18 ３Dポーズ素材無料配布サイト</span>
      </a>
      <nav className="nav" aria-label="メインナビゲーション">
        <a href="/characters.html">対応キャラ</a>
        <a href="/products" aria-current={isProducts ? "page" : undefined}>
          BOOTH作品
        </a>
        <a href="/tips.html">使い方</a>
        <a href="/terms.html">利用規約</a>
      </nav>
      <div className="header-actions">
        <div className="language-switch" role="group" aria-label="Language">
          <button className="language-option" type="button" data-lang-button="ja" aria-pressed="true">
            JP
          </button>
          <button className="language-option" type="button" data-lang-button="en" aria-pressed="false">
            EN
          </button>
        </div>
        <ShareButton />
      </div>
    </header>
  );
}
