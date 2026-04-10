# Performance pass — co bylo nalezeno a změněno

## Nalezeno

- **Blog detail** tahal `react-markdown` v klientském bundlu (`BlogMarkdown` jako client kvůli admin náhledu) — zbytečné pro veřejné čtenáře.
- Kalkulačky už používají `next/dynamic` s lehkým loading stavem — OK.
- Obrázky blogu: doplněny `loading` / `priority` u coveru na detailu (LCP).
- `sitemap` volá Supabase pro slugy — při absenci env vrací jen statické URL (build nepadá).

## Optimalizováno

| Změna | Účel |
|-------|------|
| `BlogMarkdown` bez `"use client"` — čistý serverový render | Menší JS na `/blog/[slug]` (build ~ −30 kB First Load JS oproti předchozímu stavu). |
| `components/admin/MarkdownPreview.tsx` (client) jen pro admin editor | Zachován náhled v CMS bez zatěžování veřejného blogu. |
| `BlogCoverImage`: lazy default, `priority` na detailu článku | Rychlejší LCP / méně eager obrázků v listingu. |
| Font Inter už přes `next/font` s `variable` | Žádné další měření nutné — standard Next. |

## Kompromisy

- Úvodní stránka stále používá GSAP + `PageLoader` — přijatelné pro prémiový feel; uživatelé s `prefers-reduced-motion` loader přeskočí.
- Kalkulačky zůstávají těžší kvůli chartům — záměr; lazy import stránky kalkulačky zůstává.

## Další hlubší optimalizace (mimo tento běh)

- `next/image` remotePatterns pro další CDN, pokud přibudou obrázky mimo Supabase.
- Route-level `loading.tsx` u pomalých segmentů.
- Bundle analýza (`@next/bundle-analyzer`) při přidání nových knihoven.
