# Finální stabilizační běh — changelog

## Opraveno / doplněno

- **Parity a důvěra**: audit v `docs/final-parity-audit.md`; patička rozšířena o odkaz na `/gdpr`; text na stránce Cookies srozumitelnější.
- **UX/UI**: konzistentnější focus-visible na hlavní navigaci, focus ring u karet na `/kalkulacky` a u odkazů na blogu, vylepšený prázdný stav blogu, 404 s hlavičkou/patičkou a `id="site-main"` pro skip link.
- **A11y**: skip link v `(site)/layout`, `role="alert"` / `role="status"` u lead modalu, `viewport` v root layoutu.
- **SEO**: `lib/seo/page-meta.ts` (canonical + OG), doplněné metadata napříč hlavními stránkami, `app/sitemap.ts` (statické URL + blog slugy z DB), `app/robots.ts`, JSON-LD Article na detailu článku, Twitter card u článku.
- **Výkon**: serverový `BlogMarkdown`, admin `MarkdownPreview`; optimalizace obrázků blogu — viz `docs/performance-pass.md`.
- **Technické**: `app/not-found.tsx` integrovaný do stejného chrome jako veřejný web.

## Odstraněno / nahrazeno

- Klientský `BlogMarkdown` na veřejném blogu — nahrazen serverovou verzí; náhled v adminu přes `MarkdownPreview`.

## Known issues / budoucí vylepšení

- Cookie consent banner (jen stránka /cookies + noindex).
- Hlubší bundle analýza kalkulaček při dalším rozšíření.
- Automatické E2E testy nejsou v repu součástí tohoto běhu.

## Dokumentace

- `docs/final-parity-audit.md`, `docs/performance-pass.md`, `docs/release-readiness-checklist.md`, tento soubor.
- README doplněno o SEO a release odkazy.
