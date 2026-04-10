# Changelog — Supabase CMS základ

## Shrnutí

- Dvojrole **admin / editor**, rozšířené **posts** schéma (SEO, autor, typ obsahu, featured, OG).
- **RLS**: články + storage pro admin i editor; **site_settings** jen **admin**.
- Admin **dashboard**, vylepšený editor s Markdown náhledem a akcemi koncept / publikovat / uložit.
- Veřejný blog čte z DB; metadata OG / canonical.
- Dokumentace: `docs/admin-setup.md`, `docs/supabase-admin-audit.md`.

## Nové / změněné soubory

- `supabase/migrations/002_cms_roles_posts_rls.sql`
- `lib/auth/roles.ts`
- `lib/admin/require-editor.ts` (přidán `requireAdmin`, role admin + editor)
- `lib/posts.ts` (typ a select pole)
- `app/admin/layout.tsx`, `app/admin/page.tsx`, `app/admin/posts/*`, `app/admin/settings/*`
- `app/admin/actions.ts` (odhlášení + ochrana bez Supabase)
- `components/admin/PostEditor.tsx`, `components/blog/BlogMarkdown.tsx` (`"use client"` kvůli náhledu v adminu)
- `app/(site)/blog/[slug]/page.tsx`
- `docs/admin-setup.md`, `docs/supabase-admin-audit.md`, `docs/CHANGELOG-cms.md`

## Env

- Povinné pro CMS: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (doporučeno).
- `SUPABASE_SERVICE_ROLE_KEY` zůstává pro existující serverové akce mimo běžné CMS.

## Další fáze

- Samostatné tabulky kategorií/tagů, historie verzí, plánované publikování.
- Lepší ochrana proti ztrátě dat při SPA navigaci (např. router blocker).
- Samostatná politika mazání článků jen pro admina (aktuálně i editor).

## Kompromisy

- `BlogMarkdown` je client komponenta kvůli náhledu v editoru — mírně větší JS na veřejných stránkách blogu.
- Migrace mění oprávnění k `site_settings`: editoři je v adminu nevidí (záměr).
