import Link from "next/link";
import { ShareButton } from "@/components/ShareButton";

export function SiteHeader() {
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
        <Link href="/products">BOOTH作品</Link>
        <Link href="/tips.html">使い方</Link>
        <Link href="/terms.html">利用規約</Link>
      </nav>
      <div className="header-actions">
        <div className="language-switch" role="group" aria-label="Language">
          <Link className="language-option" href="/" aria-pressed="true">
            JP
          </Link>
          <Link className="language-option" href="/en/index.html" aria-pressed="false">
            EN
          </Link>
        </div>
        <ShareButton />
      </div>
    </header>
  );
}
