# Grandmaster sniper — changelog (implementace)

## Upravené / nové soubory

| Oblast | Soubory |
|--------|---------|
| Audit | `docs/grandmaster-sniper-audit.md`, tento changelog |
| Služby (řádky) | `components/home/ServicesAccordion.tsx`, `ServiceCard.tsx`, `HomeTailSections.tsx` (SluzbySection) |
| Reference | `HomeTailSections.tsx` (ReferenceSection), `assets/css/styles.css` (full-bleed marquee) |
| Header | `components/layout/SiteHeader.tsx`, `config/site.ts` (`headerRevealScrollPx`) |
| Footer | `components/layout/SiteFooter.tsx` (bez formulářů, trust blok, právní odstavce) |
| Timeline | `components/home/home-data.ts`, `HomeTailSections.tsx` (scrollbox) |
| Graf | `components/home/WealthProjectionChart.tsx`, `assets/css/styles.css` (tooltip, milestone) |
| Právní | `config/legal.ts`, `app/(site)/gdpr/page.tsx`, `app/(site)/spoluprace/page.tsx` |
| Kariéra | `app/(site)/kariera/page.tsx`, `components/recruitment/*`, `components/forms/RecruitmentPageForm.tsx` (re-export), `app/actions/recruitment.ts`, `supabase/migrations/006_job_applications_wizard.sql` |
| Asset | `public/img/FormularFoto.jpg` (placeholder zkopírován z `hero3.jpg` do doby nahrazení finální fotkou) |

## Co se změnilo (stručně)

- **Moje služby:** Dva řádky karet (3+3), jeden sdílený detail pod řádkem; silnější aktivní stav; čitelnější hero nad fotkou.
- **Reference:** Marquee na plnou šířku viewportu (`reference-marquee-fullbleed`), bez bílého boxu; delší, plynulejší animace.
- **Header:** Větší pill, logo, CTA, min. výšky tap targetů; reveal na home až po ~220px scrollu.
- **Footer:** Odstraněny `FooterLeadForm` a `SubscribeInlineForm`; odkaz na `/kontakt` a stručný trust blok; právní text po odstavcích.
- **Moje cesta:** Jemnější `object-position` u vybraných roků; mírně nižší scrollbox.
- **Projekce majetku:** Tooltip s časem, oběma hodnotami a rozdílem; 3 milestone částky u křivky.
- **Právní:** Jasné rozlišení PB s.r.o. vs Ing. Příbramský jako VZ BEplan; patička, GDPR, spolupráce.
- **Kariéra:** Split hero, benefity, jednotlivé kroky wizardu, odeslání včetně `wizard_answers` (jsonb po migraci).

## Mimo tento scope (beze změny)

- Velký admin/blog refactor, SEO moduly, analytics, statické legacy `*.html` kalkulaček (stále starý text v patičce).
- Oprava předexistujícího `tsc` v `packages/calculators-core` (nesouvisející s tímto během).

## Nasazení DB

Po pulli spustit migraci `006_job_applications_wizard.sql` v Supabase (nebo `supabase db push`), jinak insert s `wizard_answers` selže.

## Další doporučený prompt

- Nahradit `FormularFoto.jpg` finálním výřezem z Gemini Canvas (stejná cesta).
- Sjednotit právní odstavec ve statických HTML kalkulačkách s `legalConfig` nebo je odkázat na Next.
- Admin: zobrazení `wizard_answers` u přihlášek v přehledu.
