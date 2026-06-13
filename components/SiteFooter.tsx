export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="footer-brand" href="/" aria-label="トップへ">
        <img src="/images/macaroni-logo.webp" alt="MACARONI" width="720" height="209" loading="lazy" />
        <span>R18 3Dポーズ素材無料配布サイト</span>
      </a>
      <div className="footer-links" aria-label="外部リンク">
        <a className="footer-pill" href="https://macaronin.booth.pm/" target="_blank" rel="noopener noreferrer">
          <span className="footer-pill-icon" aria-hidden="true">
            <img src="/images/link-icons/Booth_logo_footer.webp" alt="" width="38" height="38" loading="lazy" decoding="async" />
          </span>
          <span>BOOTH</span>
        </a>
        <a className="footer-pill" href="https://x.com/macaroniSoft" target="_blank" rel="noopener noreferrer">
          <span className="footer-pill-icon" aria-hidden="true">
            <img src="/images/link-icons/x_logo-white_footer.webp" alt="" width="38" height="38" loading="lazy" decoding="async" />
          </span>
          <span>X</span>
        </a>
        <a className="footer-pill" href="/links">
          <span className="footer-pill-icon" aria-hidden="true">
            L
          </span>
          <span>Links</span>
        </a>
      </div>
    </footer>
  );
}
