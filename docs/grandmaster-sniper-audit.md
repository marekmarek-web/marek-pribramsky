# Grandmaster sniper audit — tento běh

## Co se upravuje (fáze 1–9)

1. **Moje služby** — accordion po řádcích (horní 3 / dolní 3), detail pod řádkem; čitelnější nadpis přes fotku.
2. **Reference** — full-bleed marquee, fade na okrajích, bez úzkého bílého boxu pro track.
3. **Header** — větší pill/CTA, pozdější reveal na homepage po scrollu.
4. **Footer** — odstranění formulářů (lead + newsletter), čistší informační vrstva.
5. **Moje cesta** — jemnější `object-position` u 2015, 2019, 2021, 2024; případně klidnější scrollbox.
6. **Projekce majetku** — tooltip s hodnotami a rozdílem; omezené milestone labely.
7. **Právní text** — jednoznačné oddělení Premium Brokers s.r.o. vs vázaný zástupce (osoba / BEplan).
8. **Kariéra** — landing + jedna otázka ↔ wizard, submit včetně odpovědí (DB sloupec `wizard_answers`).
9. **Bug pass** — zjevné UX glitche na veřejném webu v rámci zásahu.

## Soubory (hlavní)

- `components/home/HomeTailSections.tsx`, `ServicesAccordion.tsx`, `ServiceCard.tsx`, `ReviewsMarquee.tsx`, `home-data.ts`, `WealthProjectionChart.tsx`
- `components/layout/SiteHeader.tsx`, `SiteFooter.tsx`
- `config/legal.ts`, `config/site.ts` (header volitelně)
- `app/(site)/kariera/page.tsx`, `components/forms/RecruitmentPageForm.tsx` → `components/recruitment/*`
- `app/actions/recruitment.ts`, `supabase/migrations/00x_wizard_answers.sql`
- `app/globals.css` nebo `assets/css/styles.css` pro marquee/reference

## Záměrně mimo scope

- Velký admin / blog / CMS refactor, deploy (Vercel), Sentry, nové SEO moduly, analytics, orchestrace leadů mimo nábor.

## Rizika

| Změna | Riziko |
|--------|--------|
| Služby řádkový grid | Rozbití layoutu na md/sm — testovat dva řádky + jeden panel |
| Marquee full-bleed | Horizontální overflow — `overflow-x` na sekci / mask |
| Migrace `wizard_answers` | Nutný `supabase db push` nebo SQL u klienta; staré řádky NULL |
| Právní texty | Neměnit význam mimo zadané body (IČO, role PB vs osoba) |
