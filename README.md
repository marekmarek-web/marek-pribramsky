# Marek Příbramský – Premium Brokers

Osobní web finančního poradce. **Hlavní vývoj probíhá v Next.js (App Router, TypeScript).** Původní statické HTML v repozitáři zůstává jako reference během migrace.

## Next.js (doporučeno)

```bash
pnpm install
cp .env.example .env.local   # doplňte proměnné níže
pnpm dev                      # http://localhost:3000
pnpm build && pnpm start
pnpm test                     # Vitest – golden testy kalkulaček
```

- Aplikace: `app/`, sdílené komponenty: `components/`, konfigurace navigace: `config/site.ts`, výpočty: `lib/calculators/`, obrázky: `public/img/`.
- **Blog a CMS (Supabase):** migrace `supabase/migrations/`, návod [docs/admin-setup.md](docs/admin-setup.md).
- **SEO:** metadata a OG přes `lib/seo/page-meta.ts`, veřejné `/sitemap.xml` a `/robots.txt`. Před go-live: [docs/release-readiness-checklist.md](docs/release-readiness-checklist.md).
- **Finální audit / výkon:** [docs/final-parity-audit.md](docs/final-parity-audit.md), [docs/performance-pass.md](docs/performance-pass.md), shrnutí změn [docs/FINAL-launch-changelog.md](docs/FINAL-launch-changelog.md).
- **Leady (kalkulačky, footer, úvodní konzultace):** `POST /api/leads` → Resend (`lib/email/sendLeadEmail.ts`). Legacy helper `lib/forms/leadSubmit.ts` zůstává pro postupnou migraci (např. kontaktní stránka).

### Resend a lead e-maily

| Proměnná | Popis |
|----------|--------|
| `RESEND_API_KEY` | API klíč z [Resend](https://resend.com). Bez něj endpoint vrátí `503` a `error: email_not_configured`. |
| `LEAD_EMAIL_TO` | Cílová schránka (kam přijde text leadu). |
| `RESEND_FROM` | Volitelné; výchozí např. `Premium Brokers <onboarding@resend.dev>` jen pro vývoj. V produkci nastavte ověřenou doménu. |

`NEXT_PUBLIC_SITE_URL` — kanonická URL pro odkazy v e-mailech / metadatech, pokud ji kód používá.

Podrobnější stav kalkulaček: `docs/calculators-leadflow-audit.md`.

## Legacy statický web (HTML)

- `index.html`, podsložky `blog/`, `kontakt/`, kalkulačky atd., `assets/`
- CSS pro legacy: `npm run build:legacy-css` (config `tailwind.legacy.config.js`)

## Struktura (legacy)

- `assets/js/` – main.js, anim.js, …
- `assets/img/` – kopie také v `public/img/` pro Next

## Git a nasazení

- Pro Next doporučeno **Vercel** nebo jiný Node hosting; pro čistý statický export lze později zvolit `output: 'export'`.
- GitHub Pages dříve servírovaly root HTML – po přechodu na Next změňte zdroj nasazení.
