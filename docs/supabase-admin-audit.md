# Supabase + admin — audit (stav v repu)

## Co už existovalo

- **Supabase klienti**: `lib/supabase/client.ts`, `server.ts`, `admin.ts` (service role pro nábor), `env.ts`.
- **Middleware**: ochrana `/admin/*`, redirect nepřihlášených na `/login`, přihlášení na `/login` → redirect do `/admin` (nebo `next`).
- **Auth callback**: `app/auth/callback/route.ts` (PKCE / magic link).
- **Login UI**: `app/(site)/login/page.tsx`, `components/auth/LoginForm.tsx` (heslo + OTP; veřejná registrace není v kódu).
- **Admin segment**: `app/admin/*`, layout s navigací a odhlášením.
- **Role (původně jen editor)**: `profiles.role` + RLS; `requireEditor` původně povoloval výhradně `editor` → **blokoval admin účty**.
- **Blog DB**: `posts`, `site_settings`, bucket `blog-covers`, migrace `001_initial.sql`.
- **Veřejný blog**: `app/(site)/blog/*` + `lib/posts.ts`.

## Co bylo nedokončené / problematické

- Role **admin** nebyla v DB ani v guardu konzistentní (CHECK jen `editor`).
- **site_settings** byly editovatelné i „editorem“ — měly být oddělené jako citlivější část.
- Schéma článků postrádalo SEO / autora / typ obsahu v jedné vrstvě vhodné pro rozšíření.

## Co tento běh doplňuje / mění

- Migrace **`002_cms_roles_posts_rls.sql`**: `admin` + `editor`, rozšíření `posts`, RLS „staff“ pro články a storage, **site_settings jen pro admin**.
- **`requireAdmin`** vs **`requireEditor`** (CMS staff = admin + editor).
- **Admin dashboard** (počty, poslední úpravy), rozšířený **editor článku** (SEO, typ obsahu, koncept / publikace / uložit, náhled Markdown).
- **Veřejný článek**: metadata OG, kanonická URL, autor, čas čtení.
- Dokumentace: `docs/admin-setup.md`, tento audit, `docs/CHANGELOG-cms.md`.

## Co necháváme na další fázi

- Plný CMS pipeline, schvalování, komentáře, newsletter, multijazyk.
- Samoobslužná registrace uživatelů (stále uzavřený interní model).
- Pokročilý DAM, workflow verzí, RBAC nad rámec admin/editor.
