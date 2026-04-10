# Finální parity audit vs. legacy HTML

Porovnání cílového Next.js projektu s původním statickým webem (reference `index.html`, podsložky `blog/`, `kontakt/`, kalkulačky, patička).

## Plně pokryto nebo lepší

| Oblast | Stav |
|--------|------|
| Úvod — hero, služby (accordion), reference, blog náhled, CTA | Next přebírá strukturu a rozšiřuje o moderní UI (PersonaSwitcher, grafy). |
| Navigace + nástroje (dropdown kalkulaček) | `SiteHeader` + `config/site.ts`; mobilní drawer. |
| Kalkulačky (4 typy) | Portál s dynamickým načtením chunků, lead modaly, disclaimer. |
| Lead flow | `POST /api/leads` + Resend; honeypot, rate limit. |
| Kontakt + kariéra | Formuláře, telefon, e-mail. |
| Blog — listing + článek | Supabase `posts`, Markdown, cover; legacy statické články nahraditelné obsahem v CMS. |
| Patička — kontakt, pobočky, sociální sítě, právní blok, rychlá zpráva | `SiteFooter` + `site_settings` pro tagline. |
| Právní / cookies / GDPR stránky | `/cookies`, `/gdpr` + odkazy v patičce (včetně interního `/gdpr` a partnera BEplan). |

## Pokryto jinak, ale dostatečně

| Oblast | Poznámka |
|--------|----------|
| Mikroanimace úvodu | GSAP loader + hero místo čistého vanilla z legacy — vyšší náklad, ale `prefers-reduced-motion` u loaderu. |
| Statické HTML články v `/blog/*.html` | Nahrazeno DB + jednotné routy `/blog/[slug]`. |
| FormSubmit endpoint | Nový JSON/multipart API; legacy helper může zůstat pro postupný ořez. |

## Mezery / odchylky

| Co | Riziko | Poznámka |
|----|--------|----------|
| Obsah konkrétních článků | Nízké | Musí být znovu publikován v CMS nebo importován — není automatický import z HTML. |
| Stoprocentní vizuální pixel-parity | Nízké | Záměrně modernější typografie a spacing — ne cíl 1:1 pixel. |

## Opraveno v tomto běhu

- SEO základ (metadata, OG, canonical, sitemap, robots), strukturovaná data u článku.
- A11y: skip link, focus-visible na hlavní navigaci, role u lead modalu, lepší prázdné stavy blogu.
- 404 s hlavičkou/patičkou a cílem pro skip link.
- Důvěryhodnost: patička GDPR rozšířena, text cookies méně „placeholder“.
- Výkon: veřejný blog bez zbytečného `react-markdown` v klientském bundlu (server `BlogMarkdown`, admin zvlášť `MarkdownPreview`).

## Vědomě odloženo

- Plná migrace textů ze všech legacy podstránek do CMS.
- Pokročilá analytika / cookie consent banner (jen informativní stránka).
- E2E testy v prohlížeči v CI.
