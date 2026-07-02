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

---

## Security (full codebase)

**No CRITICAL issues** in diff. Existing baseline is solid:

- Service role server-only; RLS blocks anon inserts on leads/subscribers
- Admin routes protected by middleware + `requireEditor()`
- Public API: Zod validation, honeypot, timing, rate limits, generic prod errors
- Plausible consent-gated; Sentry scrubs cookies/user PII
- `safeInternalPath` on login redirect

### Open — HIGH

| Issue | Location | Recommendation |
|-------|----------|----------------|
| In-memory rate limits not global on serverless | `rateLimitInMemory.ts` | Upstash Redis at scale |
| Export API uses weaker session helper vs admin pages | `get-editor-session.ts` | Align with `requireEditor()` service-role fallback |

### Open — MEDIUM

| Issue | Recommendation |
|-------|----------------|
| Recruitment Resend errors hinted config details | Generic messages (partially fixed) |
| DB insert succeeds, email fails → orphan lead | Outbox/retry or transactional UX |
| Subscriber insert fails silently with `ok: true` | Fail or surface `subscriberId: null` |
| Attribution in sessionStorage before analytics consent | Gate on consent or document as essential |
| Sentry loads without cookie consent | Legal review (common for error monitoring) |

---

## Bugs & quality

### Open — HIGH

| Issue | Location |
|-------|----------|
| Missing `<h1>` on life calculator page | `LifeCalculatorPage.tsx` |
| Zero/thin unit tests for pension/investment engines | `packages/calculators-core` |

### Open — MEDIUM

| Issue | Location |
|-------|----------|
| `CustomDropdown` missing keyboard ARIA | `CustomDropdown.tsx` |
| Mobile nav no focus trap | `SiteHeader.tsx` |
| FAQ tabs incomplete WAI-ARIA | `HomeTailSections.tsx`, `HomeVanillaInit.tsx` |
| Life chart values hover-only | `LifeRiskChart.tsx` |
| Tykání on `/kariera` vs vykání elsewhere | `RecruitmentWizard.tsx` |
| Contact form missing `too_fast` handling | `ContactPageForm.tsx` |

### Open — LOW

| Issue | Location |
|-------|----------|
| Dead code: `FooterLeadForm`, `CalculatorHero`, unused calculator shell components | various |
| Legacy `partials/*.html`, `assets/js/main.js` | not used by Next |
| Admin lead export missing `consent` column | `app/api/admin/leads/export` |

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
| No default OG/Twitter images on marketing pages | Add to `pageOg()` or root metadata |
| Sitemap `lastModified: new Date()` always | Use real dates for blog posts |
| `NEXT_PUBLIC_SITE_URL` fallback localhost in sitemap | Fail CI if unset in production |

---

## E2E coverage gaps

Current: smoke, pension lead, blog, admin redirect (desktop only).

**Not covered:** hash navigation, mortgage/life/investment calculators, contact form, recruitment wizard, mobile viewport, calculator mobile dock.

---

## Test coverage added

- `packages/calculators-core/src/life/__tests__/life.engine.test.ts`
- `calculatorLeadSchema.test.ts` — consent enforcement

---

## PR consolidation

This branch merges:
- **PR #2** — Mortgage calculator fixes (LTV, rates, mobile UI, nav scroll, loader session)
- **PR #3** — Homepage performance optimizations
- **This audit pass** — Critical/high fixes from multi-agent review
