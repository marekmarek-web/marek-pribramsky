# Marek Příbramský – Premium Brokers

Osobní web finančního poradce. **Next.js (App Router, TypeScript).**

## Lokální vývoj

```bash
pnpm install
cp .env.example .env.local   # doplňte hodnoty
pnpm dev                      # http://localhost:3000
pnpm build && pnpm start
pnpm test                     # Vitest
```

- Aplikace: `app/`, komponenty: `components/`, navigace: `config/site.ts`, SEO: `lib/seo/`.
- **Blog / CMS:** Supabase — `docs/admin-setup.md`, migrace v `supabase/migrations/`.
- **Leady:** `POST /api/leads` → Resend (`lib/email/sendLeadEmail.ts`).

## Environment (produkce)

Kompletní seznam a význam proměnných je v **`.env.example`**. Shrnutí:

| Oblast | Proměnné |
|--------|-----------|
| Veřejné URL / SEO | `NEXT_PUBLIC_SITE_URL` |
| Supabase (web + admin) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (jen server) |
| Resend (e-maily leadů) | `RESEND_API_KEY`, `RESEND_FROM`, `LEAD_EMAIL_TO` |
| Chyby (Sentry) | `NEXT_PUBLIC_SENTRY_DSN` (volitelné) |
| Analytika (Plausible, po souhlasu) | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (volitelné) |

Validace při startu: `instrumentation.ts` + `lib/env/validate.ts` (varování do logu, neblokuje build).

## Nasazení (Vercel)

Postup: **`docs/deploy-playbook.md`**. Po nasazení: **`docs/post-deploy-smoke-tests.md`**.

### GitHub Pages (`*.github.io/.../marek-pribramsky/`)

GitHub Pages umí jen statické soubory — **nepouští Next.js**. Kořenové a staré `**/index.html` v repu proto přesměrovávají na produkční web (výchozí `https://www.marekpribramsky.cz`). Při změně domény spusťte `pnpm gh-pages:redirects` nebo `GH_PAGES_REDIRECT_BASE=https://vaše-domena.cz pnpm gh-pages:redirects`, pak commitněte vygenerované HTML.

## Observability & analytics

- **Sentry:** `sentry.*.config.ts`, runtime reporting pokud je `NEXT_PUBLIC_SENTRY_DSN`.
- **Plausible:** načte se až po souhlasu v cookie banneru (`components/consent/`).
- **Události:** `lib/analytics/track.ts`, názvy v `lib/analytics/events.ts`.

## Dokumentace

| Dokument | Obsah |
|----------|--------|
| `docs/deployment-readiness-audit.md` | Stav připravenosti na deploy |
| `docs/deploy-playbook.md` | Vercel, env, rollback |
| `docs/post-deploy-smoke-tests.md` | Checklist po deployi |
| `docs/operations-troubleshooting.md` | Časté závady a recovery |
| `docs/production-release-changelog.md` | Shrnutí ops běhu |
| `docs/calculators-leadflow-audit.md` | Kalkulačky a lead flow |

## Legacy HTML

Statické `index.html` a podsložky v repu slouží jako reference; produkční běh je Next.js.

## Git / repo

Cílový Next.js projekt odpovídá **`marekmarek-web/temp-marek`**; legacy reference **`marekmarek-web/marek-pribramsky`**.
