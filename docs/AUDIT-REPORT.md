# Audit report — Premium Brokers web (2026-07-01)

Consolidated findings from security, bug/quality, performance, and data-flow audits.  
**Status:** Critical/high items below were fixed in this PR unless marked *open*.

---

## Fixed in this PR

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | CRITICAL | Life D3 pension cliff at 80k/100k income | `life.engine.ts` — continuous brackets + unit tests |
| 2 | HIGH | Broken `#newsletter-footer` link | → `/blog#novinky` |
| 3 | HIGH | Server didn't enforce GDPR consent on inquiry leads | `calculatorLeadSchema.ts` |
| 4 | HIGH | Hash nav sections hidden under fixed header | `scroll-mt-28` on homepage sections |
| 5 | HIGH | Nav „Spolupráce" → section „Můj postup" | Nav label → „Můj postup" |
| 6 | HIGH | Recruitment without rate limit / honeypot | `recruitment.ts` + wizard |
| 7 | HIGH | Middleware `getUser()` on every public page | Matcher limited to `/admin`, `/login`, `/auth` |
| 8 | HIGH | Hero blank on SSR / slow LCP | Hero renders immediately; transparent loader |
| 9 | — | Mortgage LTV/rates/mobile UI | See prior commits on this branch |
| 10 | — | Performance lazy-load bundle | GSAP, tail components, Sentry defer |
| 11 | HIGH | In-memory rate limits not global on serverless | `rateLimit.ts` + optional Upstash Redis |
| 12 | HIGH | Export API weaker session helper | `get-editor-session.ts` service-role fallback |
| 13 | MEDIUM | DB insert ok, email fail → user error | `processPublicLead.ts` — lead saved, `emailSent: false` |
| 14 | MEDIUM | Subscriber insert fails silently | `persist_failed` when DB configured |
| 15 | MEDIUM | Contact form missing `too_fast` / `rate_limit` UX | `ContactPageForm.tsx` |
| 16 | MEDIUM | Attribution before cookie consent | `AttributionCapture` gated on consent |
| 17 | HIGH | Missing `<h1>` on life calculator | `LifeCalculatorPage.tsx` |
| 18 | — | No default OG images | `page-meta.ts`, root `layout.tsx` |
| 19 | — | Sitemap always `new Date()` | Real blog dates; static fixed date |
| 20 | LOW | Admin export missing `consent` | CSV export column added |
| 21 | MEDIUM | Mobile nav no focus trap | `SiteHeader.tsx` |
| 22 | — | Shared spam checks duplicated | `publicFormSpam.ts` |

---

## Security (full codebase)

**No CRITICAL issues** in diff. Existing baseline is solid:

- Service role server-only; RLS blocks anon inserts on leads/subscribers
- Admin routes protected by middleware + `requireEditor()`
- Public API: Zod validation, honeypot, timing, rate limits, generic prod errors
- Plausible consent-gated; Sentry scrubs cookies/user PII
- `safeInternalPath` on login redirect

### Open — MEDIUM

| Issue | Recommendation |
|-------|----------------|
| Sentry loads without cookie consent | Legal review (common for error monitoring) |

---

## Bugs & quality

### Open — HIGH

| Issue | Location |
|-------|----------|
| Zero/thin unit tests for pension/investment engines | `packages/calculators-core` |

### Open — MEDIUM

| Issue | Location |
|-------|----------|
| `CustomDropdown` missing keyboard ARIA | `CustomDropdown.tsx` |
| FAQ tabs incomplete WAI-ARIA | `HomeTailSections.tsx`, `HomeVanillaInit.tsx` |
| Life chart values hover-only | `LifeRiskChart.tsx` |
| Tykání on `/kariera` vs vykání elsewhere | `RecruitmentWizard.tsx` |

### Open — LOW

| Issue | Location |
|-------|----------|
| Dead code: `FooterLeadForm`, `CalculatorHero`, unused calculator shell components | various |
| Legacy `partials/*.html`, `assets/js/main.js` | not used by Next |

---

## Performance

### Fixed

- Hero SSR, lazy GSAP, lazy tail client islands, deferred Sentry
- Homepage ISR `revalidate = 60`, `optimizePackageImports`
- Removed Dancing Script `@import`, persona bg duplicate image
- Middleware scoped to auth routes only

### Open — next phase

| Priority | Item |
|----------|------|
| 1 | Split global `styles.css` (~2400 lines) — route-scope homepage CSS |
| 2 | Reduce shared client JS baseline (~560 KB) — split `SiteHeader` |
| 3 | `dynamic()` on `/kariera` sections |
| 4 | Unify Chart.js + ApexCharts on investment calculator |
| 5 | `React.cache` for Supabase site settings (footer + blog intro) |
| 6 | `withSentryConfig` + Speed Insights |
| 7 | Hero responsive `sizes`, WebP/AVIF for branch photos |
| 8 | `app/admin/error.tsx` |

---

## SEO

### Open

| Issue | Fix |
|-------|-----|
| `NEXT_PUBLIC_SITE_URL` fallback localhost in sitemap | Warn in production; set env in Vercel |

---

## E2E coverage gaps

Current: smoke, pension lead, blog, admin redirect (desktop only).

**Not covered:** hash navigation, mortgage/life/investment calculators, contact form, recruitment wizard, mobile viewport, calculator mobile dock.

---

## Test coverage added

- `packages/calculators-core/src/life/__tests__/life.engine.test.ts`
- `calculatorLeadSchema.test.ts` — consent enforcement
- `publicFormSpam.test.ts` — honeypot + timing

---

## PR consolidation

This branch merges:
- **PR #2** — Mortgage calculator fixes (LTV, rates, mobile UI, nav scroll, loader session)
- **PR #3** — Homepage performance optimizations
- **This audit pass** — Critical/high fixes from multi-agent review + anti-spam hardening
