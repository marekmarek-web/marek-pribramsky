# Marek Příbramský – Premium Brokers

Osobní web finančního poradce. Statický HTML/CSS/JS s Tailwind, GSAP a Chart.js.

## Struktura

- `index.html` – hlavní stránka
- `assets/css/` – styly
- `assets/js/` – skripty (main.js, anim.js, interactive-path.js, moje-cesta-timeline.js)
- `assets/img/` – obrázky ve složkách:
  - `logos/` – loga (pb-logo-no-bg.png, pb-logo-grey.png, …)
  - `hero/` – hero fotky (sitting2.png, …)
  - `blog/` – náhledy blogů (blog-1.jpg, …)
  - `content/` – obsahové obrázky (graph.jpg, schuzka.jpg, …)
- `gdpr/`, `cookies/`, `kontakt/`, `spoluprace/`, `blog/`, `kalkulacky/` – podsložky stránek

## Funkce

- Hero s scroll-driven path animací (GSAP MotionPathPlugin)
- Timeline „Moje cesta“ s GSAP ScrollTrigger
- Investiční projekce (Chart.js)
- Formuláře pro lead / kontakt
- Responzivní layout

## Lokální spuštění

Stačí otevřít `index.html` v prohlížeči nebo použít např. Live Server.

## Build pro produkci (Tailwind CSS)

Pro ostrý web se používá zkompilované CSS místo CDN (rychlejší načítání, žádné FOUC).

1. Nainstalujte závislosti: `npm install`
2. Zkompilujte CSS: `npm run build` (vytvoří `assets/css/tailwind.css`)
3. Před nasazením vždy spusťte `npm run build`, aby byl `tailwind.css` aktuální.
