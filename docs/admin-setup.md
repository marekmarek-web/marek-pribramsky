# Administrace blogu — nastavení Supabase

## 1. Proměnné prostředí

Zkopírujte `.env.example` do `.env.local` a doplňte:

| Proměnná | Účel |
|----------|------|
| `NEXT_PUBLIC_SITE_URL` | Kanonická URL webu (metadata, OG, fallback kanonického odkazu u článků). |
| `NEXT_PUBLIC_SUPABASE_URL` | URL projektu (Settings → API). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon public klíč (klient v prohlížeči a serverové RLS volání). |
| `SUPABASE_SERVICE_ROLE_KEY` | Pouze server, např. náborové formuláře — **nikdy do klienta**. |

## 2. Migrace databáze

V Supabase **SQL Editor** (nebo `supabase db push`) spusťte v pořadí:

1. `supabase/migrations/001_initial.sql`
2. `supabase/migrations/002_cms_roles_posts_rls.sql`

Volitelně: `supabase/seed.sql` pro ukázkové články a prázdné `site_settings`.

## 3. Úložiště (Storage)

Migrace vytváří veřejný bucket `blog-covers`. Pokud bucket zakládáte ručně, nastavte ho jako **public** a držte politiky z migrace (čtení veřejně, zápis jen staff).

## 4. První uživatelé (bez veřejné registrace)

1. **Authentication → Users → Add user** — vytvořte e-mail + heslo (nebo pozvěte magic linkem).
2. V tabulce `auth.users` zkopírujte **UUID** uživatele.
3. Vložte řádek do `public.profiles`:

```sql
insert into public.profiles (id, role, full_name)
values ('UUID-UZIVATELE', 'admin', 'Marek Příbramský');
```

Pro **asistentku (editor)**:

```sql
insert into public.profiles (id, role, full_name)
values ('UUID-ASISTENTKY', 'editor', 'Jméno Asistentky');
```

Bez řádku v `profiles` uživatel projde přihlášením, ale **nemá přístup do CMS** (RLS + guard).

## 5. Role

| Role | Přístup |
|------|--------|
| **admin** | Články, úložiště obrázků, **nastavení webu** (`site_settings`). |
| **editor** | Články a obrázky náhledů — **bez** stránky Nastavení webu. |

Kontrola probíhá v **RLS** (Supabase) a v **serverových guard** (`lib/admin/require-editor.ts`).

## 6. URL pro auth (Supabase Dashboard)

**Authentication → URL configuration**

- **Site URL**: produkční doména; pro vývoj přidejte `http://localhost:3000` do redirect URL.
- Povolený redirect např. na `/auth/callback` (viz implementace magic linku v `LoginForm`).

## 7. Workflow článku

1. **Nový článek** — vyplnit slug, titulek, Markdown, případně cover (URL nebo nahrání).
2. **Uložit koncept** — uloží `published = false`.
3. **Publikovat** — nastaví `published = true` a doplní `published_at`, pokud chybí.
4. **Uložit** — respektuje přepínač „Publikovat na webu“.
5. Úprava publikovaného článku — uložit znovu; pro stažení z webu zrušte přepínač a uložte (koncept).

Varování při **zavření záložky** s neuloženými změnami: základní `beforeunload` v editoru (neřeší client-side navigaci uvnitř Next).

## 8. Kompromisy

- **Autor** u článku se při každém uložení aktualizuje podle aktuálního uživatele a `profiles.full_name` (jednoduchý interní model).
- Kategorie zůstává textovým polem (bez tabulky `categories`) — připraveno na rozšíření migrací.
