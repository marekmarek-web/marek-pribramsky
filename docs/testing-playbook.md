# Testing playbook — premium-brokers

## Typy testů

| Typ | Nástroj | Účel |
|-----|---------|------|
| Unit / integration (logika) | Vitest | Validace schémat, mapování leadů, role, čistá business logika bez prohlížeče |
| E2E | Playwright | Kritické flow veřejného webu, formuláře s mockovaným API, redirecty auth |

## Instalace (jednorázově)

```bash
pnpm install
pnpm exec playwright install chromium
```

Pro CI stačí Chromium: `pnpm exec playwright install chromium --with-deps` (na Linuxu).

## Spuštění

```bash
# Unit / integration (Vitest)
pnpm test

# Sledování změn
pnpm test:watch

# Celá E2E sada (spustí dev server pokud neběží)
pnpm test:e2e

# Jen smoke scénáře (@smoke)
pnpm test:e2e:smoke

# Typická lokální kombinace před commitem
pnpm test && pnpm test:e2e:smoke
```

## E2E poznámky (stabilita)

- **Homepage**: po načtení běží fullscreen loader, poté se na `body` přidá třída `page-loaded`. Testy na úvodní stránku čekají na tuto fázi nebo na scroll (fixní header se na home zobrazí až po scrollu).
- **Duplicitní UI**: penzijní CTA a newsletter formulář jsou na stránce dvakrát (desktop + mobile / patička) — v testech se používá `.first()` nebo scope `#novinky`.

## Proměnné prostředí

- **`PLAYWRIGHT_BASE_URL`**: výchozí `http://127.0.0.1:3002` (stejný port jako `pnpm dev`). V CI nastavte na URL nasazené preview, pokud netestujete přes vestavěný `webServer`.
- **Supabase / Resend**: E2E lead a subscribe používají **`page.route`** mock na `/api/leads` a `/api/subscribers`, takže nepotřebují živý Resend ani DB pro happy path.
- **Blog článek**: test detailu článku přeskočí (`test.skip`), pokud server vrátí 404 (prázdná DB).

Volitelně do budoucna:

- `E2E_LOGIN_EMAIL`, `E2E_LOGIN_PASSWORD` — pro skutečné E2E login (zatím neimplementováno).

## Kde co leží

- Vitest konfigurace: `vitest.config.ts`
- Integrační / unit testy: `lib/**/*.test.ts`, `tests/**/*.test.ts`
- Sdílené fixtury: `tests/fixtures/`
- Playwright: `playwright.config.ts`, spec soubory v `e2e/`
- Stabilní selektory v UI: `data-testid` např. `calculator-lead-form`, `pension-calculator-cta`, `subscribe-inline-form`

## Jak psát nové testy

1. **Logika** → nejdřív Vitest u funkce/schématu v `lib/`, než přidáváte E2E.
2. **E2E** → preferujte `getByRole`, `getByTestId` (kam dáváme `data-testid` u interaktivních částí). Vyhněte se selektorům závislým na přesném textu dlouhých odstavců.
3. **API** v E2E → mockujte `**/api/...` pokud test nesmí záviset na e-mailu, DB nebo časovačích (`too_fast`).
4. Označte rychlé regresní testy tagem v názvu **`@smoke`** (`test('homepage @smoke', ...)`) pro `pnpm test:e2e:smoke`.

## Co je zatím mimo coverage

- Plné přihlášení Supabase a test rolí v prohlížeči.
- Admin UI (editor/blog) mimo ochranu vstupu na `/admin`.
- Load / stress testy a VRT snapshoty.

Podrobný audit a rozdíl „tento běh vs. později“: [test-strategy-audit.md](./test-strategy-audit.md).
