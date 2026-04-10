# Kalkulačky & lead flow — audit (akční)

## Kalkulačky v Next (`app/(site)/*`)


| Route                   | Komponenta                 | Stav                                                                                 |
| ----------------------- | -------------------------- | ------------------------------------------------------------------------------------ |
| `/penzijnikalkulacka`   | `PensionCalculatorPage`    | Hero + wizard; CTA → `PensionContactModal` → `POST /api/leads`                       |
| `/zivotnikalkulacka`    | `LifeCalculatorPage`       | Hero (bez přetékání watermarku); CTA → `LifeContactModal` (proposal/check + příloha) |
| `/hypotecnikalkulacka`  | `MortgageCalculatorPage`   | CTA nabídka banky + konzultace → `MortgageContactModal`                              |
| `/investicnikalkulacka` | `InvestmentCalculatorPage` | CTA výsledky → `InvestmentContactModal`                                              |


Sdílené: `CalculatorLeadModal` + `AppModal` (ESC, backdrop, focus trap), `lib/forms/postLeadApi.ts`, validace `lib/validation/calculatorLeadSchema.ts`, e-mail `lib/email/sendLeadEmail.ts`.

## Co bylo špatně / nedotažené

- Starý pattern: přímé volání FormSubmit z klienta u některých formulářů.
- Modaly bez jednotného chování a server-side odeslání.
- Penzijní: nesoulad hero vs. sekce pod hero (pozadí, border).
- Životní: logo/watermark, headline s osamocenou pomlčkou.

## Co je opraveno v tomto běhu

- Jednotný **CTA → modal → `POST /api/leads`** pro všechny čtyři kalkulačky + kontext (`calculatorType`, `resultSummary`, `metadata`, `sourcePath`).
- **Resend** přes server route; honeypot + rate limit + „too fast“; bez klíčů na klientu.
- **Footer** (`FooterLeadForm`) a **homepage konzultace** (`LeadConsultationForm`) přes `/api/leads` (`footer_quick`, `homepage_consultation`).
- Penzijní: sjednocený přechod hero → wizard (gradient, border).
- Životní: hero layout, headline na dvě řádky bez divné pomlčky.

## Co zůstává na další fázi

- `**ContactPageForm`**: stále může používat `submitToFormSubmit` — sjednotit na `/api/leads` se `source: "contact_page"`.
- **Supabase ukládání leadů** — připraveno rozšířením API; zatím jen e-mail.
- **SEO / obsah** kalkulaček — mimo scope.
- **Produkční Resend**: ověřená doména odesílatele (`RESEND_FROM`).

## Env (viz README)

- `RESEND_API_KEY`, `LEAD_EMAIL_TO`, volitelně `RESEND_FROM`
- Bez `RESEND_API_KEY` API vrací `503` + `email_not_configured` — UI má fallback hlášku.

