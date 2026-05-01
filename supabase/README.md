# Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy `URL` and `anon` / `service_role` keys.
3. Add them to `.env.local` (see root `.env.example`).
4. Open **SQL Editor**, paste and run migrations **in order** (včetně `003_*` … `008_*` podle repa). Pokud administrace hlásí u leadů `infinite recursion … profiles`, spusť `migrations/007_fix_profiles_staff_policy_recursion.sql`. Pro zdroje **kariéra** a **odběr** v tabulce `leads` je potřeba `008_leads_source_newsletter_career.sql`.
5. Optionally run `seed.sql` for default `site_settings` rows and three sample blog posts.
6. **Authentication → Providers**: enable Email (password or magic link as you prefer). Veřejná registrace není potřeba.
7. Vytvořte uživatele v **Authentication → Users → Add user** (e-mail + heslo).
8. Pro každého interního uživatele vložte řádek do `public.profiles` (role `admin` nebo `editor`). Připravený příkaz pro hlavní admin účet: `scripts/ensure-admin-for-auth-user.sql` (spustit v SQL Editoru).

```sql
-- vlastník / správce
insert into public.profiles (id, role, full_name)
values ('PASTE-USER-UUID', 'admin', 'Jméno');

-- asistentka — jen obsah, bez stránky „Nastavení webu“
insert into public.profiles (id, role, full_name)
values ('PASTE-USER-UUID', 'editor', 'Jméno');
```

Bez řádku v `profiles` uživatel nemůže spravovat obsah (RLS + aplikační guard).

9. **Authentication → URL configuration**: set **Site URL** to your production domain (and add `http://localhost:3002` for local dev with default `pnpm dev`, or `http://localhost:3000` if you use `pnpm dev:3000`).

Podrobnosti: [docs/admin-setup.md](../docs/admin-setup.md).
