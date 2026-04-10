# Release readiness — praktický checklist

Před nasazením na produkci projděte ručně nebo ve stagingu.

## Konfigurace a env

- [ ] `NEXT_PUBLIC_SITE_URL` = kanonická HTTPS doména (bez lomítka na konci).
- [ ] `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` nastavené.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` jen na serveru (Vercel / hosting), ne v klientovi.
- [ ] Resend: `RESEND_API_KEY`, `LEAD_EMAIL_TO`, případně `RESEND_FROM` s ověřenou doménou.
- [ ] Supabase: migrace `001` + `002`, profily admin/editor, bucket `blog-covers`, URL redirecty pro auth.

## Homepage

- [ ] Hero, služby, CTA, blog sekce — bez rozbitého layoutu na 375 / 768 / 1280 px.
- [ ] Loader respektuje reduced motion (rychlý průchod).

## Kalkulačky

- [ ] Všechny čtyři typy: vstupy, výsledky, disclaimer viditelný.
- [ ] Lead modal: odeslání, chybové hlášky (vypnout Resend a ověřit user-facing text).
- [ ] API rates: při testu nechat rozumný interval mezi pokusy.

## Lead modaly a formuláře

- [ ] Footer lead, kontaktní stránka, kariéra — odeslání a validace.
- [ ] Životní kalkulačka + příloha (pokud používáte).

## Auth a admin

- [ ] `/login` — přihlášení, redirect do `/admin`.
- [ ] Editor nemá `/admin/settings`; admin ano.
- [ ] Blog v CMS: draft / publish, cover upload.

## Blog (veřejný)

- [ ] `/blog` prázdný stav OK.
- [ ] Článek: OG náhled (meta), canonical, 404 u neexistujícího slugu.

## Responsive

- [ ] Header, mobilní menu, patička, kalkulačky — žádný horizontální scroll kromě záměrného.

## SEO

- [ ] `/sitemap.xml` a `/robots.txt` dostupné na produkční doméně.
- [ ] Výběr stránek ve Search Console / ruční kontrola title/description.

## Accessibility (smoke)

- [ ] Tab: skip link „Přeskočit na obsah“ → fokus v obsahu.
- [ ] Modal kalkulačky: Escape zavře, focus trap chová se rozumně.

## Performance (rychlý check)

- [ ] Lighthouse nebo Web Vitals na úvod + jedna kalkulačka + článek (LCP, CLS rozumné).

## Produkční smoke

- [ ] HTTP→HTTPS redirect.
- [ ] 404 stránka zobrazuje navigaci.
- [ ] Žádné konzolové chyby na hlavních trasách.
