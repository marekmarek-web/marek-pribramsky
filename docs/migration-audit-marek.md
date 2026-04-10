# Homepage audit — legacy HTML vs Next.js (target)

**Reference:** `marekmarek-web/marek-pribramsky` (`index.html` + `assets/js`)  
**Target:** tento repozitář (`app/page.tsx`, `components/home/**`)

## Co v legacy bylo a v TS chybělo / bylo ochuzené

| Oblast | Legacy | Target (před opravou) |
|--------|--------|------------------------|
| **Služby** | Klik na kartu otevřel/zavřel detail + CTA (`sluzby-acc-*`, JS na `DOMContentLoaded`) | Markup připravený jako accordion, ale **handler v `HomeVanillaInit` cílil na překlep `.sluzhy-acc-trigger`** → kliky nic nedělaly |
| **Pro koho** | Přepínání panelů + klávesnice (v TS částečně přes vanilla po loaderu) | Funkčně šlo o „statický“ vzhled: tři panely, slabší hierarchie, **bez rozšířeného obsahu** (benefity, scénáře) |
| **Hero** | Fotka jako hlavní kompoziční prvek, čitelný text | `object-cover` + jednotné `object-position` + silný overlay → **useknutí postavy / špatný crop** na některých šířkách |
| **Moje cesta** | Stejné obrázky, v CSS per-foto výjimky (např. 2015) | Jednotná výška + cover bez dostatečných **per-roku cropů** → portréty useknuté |
| **Footer** | Jednodušší patička | **7sloupcový grid** + právní blok = vizuální šum, slabá hierarchie |

## Co bylo v TS jen statické, ale v legacy interaktivní

- **Služby:** viz výše — UI vypadalo jako accordion, chování chybělo (bug + závislost na loaderu).
- **Pro koho:** legacy i TS měly panely; v TS byl přepínač navázaný na `HomeVanillaInit` až po loaderu (bez SSR konzistence UX).

## Co bylo vizuálně rozbité / rizikové

- Hero: crop, příliš plochý overlay (`bg-black/50`), text bez jasné „safe zóny“ vůči fotce.
- Timeline: fixní `h-[600px]` + jednotný `object-fit` u portrétů.
- Footer: konkurence nadpisů a formuláře.

## Co opravujeme v tomto běhu

1. Hero — výška/crop/`object-position` podle breakpointů, jemnější gradient overlay, typografie a mezery.
2. Pro koho — **React segmented tabs** s plným obsahem (headline, popis, benefity, doporučené scénáře, CTA), a11y.
3. Moje služby — **React accordion** (jedna otevřená položka), `aria-*`, animace šipky, klávesnice.
4. Moje cesta — per-obrázek crop třídy + čistší timeline layout (scrollbox).
5. Footer — přehlednější IA, oddělené bloky, odlehčený právní text.
6. Globální doladění CTA/focus na homepage (v rámci dotčených souborů).

## Co záměrně necháváme na další fázi

- Kalkulačky, Resend, Supabase, admin, blog pipeline.
- Hluboký SEO pass (mimo nezbytné drobnosti u upravených komponent).
- Úpravy `main-with-header` / globálního paddingu u všech stránek (může být samostatné rozhodnutí).

## Poznámka k nevyužitému kódu

- Ve `HomeVanillaInit` zůstává FAQ + postup spotlight; **persona a služby** přesunuty do Reactu — vanilla větev pro ně odstraněna, aby nebyla duplicita.
