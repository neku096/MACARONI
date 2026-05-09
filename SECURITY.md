# Security Notes

This is a static site. Keep production uploads limited to public HTML, CSS, JS, images, and intended download assets.

## Before Publishing

- Do not upload `.env`, `config.toml`, private keys, source PSD/CLIP files, or unpublished archive files.
- Keep downloadable files under fixed local paths. Do not build download URLs from user input.
- Keep external links on HTTPS and use `target="_blank"` only with `rel="noopener noreferrer"`.
- Test downloads from `https://` or `http://localhost`; browser save dialogs are restricted on `file://`.

## Server Headers To Add Later

Use these after the domain and hosting provider are decided. Prefer HTTP headers over HTML meta tags in production.

```txt
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self'; frame-src 'none'; form-action 'none'
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

After HTTPS is active, add:

```txt
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```
