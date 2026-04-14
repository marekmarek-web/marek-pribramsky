-- =============================================================================
-- Přístup do CMS (/admin): propojení Auth uživatele s public.profiles
-- =============================================================================
-- Spusť v Supabase: SQL Editor → New query → Run.
-- Idempotní: při opakovaném spuštění jen doplní / upgraduje roli na admin.
--
-- Pozor: Stejný Supabase projekt jako NEXT_PUBLIC_SUPABASE_URL (Vercel / .env).
-- Chyba 23503 (id není v auth.users): nejdřív spusť:
--   select id, email from auth.users order by created_at desc;
-- UUID musí přesně odpovídat Authentication → Users → User UID (pozor na překlepy).
-- =============================================================================

insert into public.profiles as p (id, role, full_name)
values (
  '0c4589ba-b027-4d7f-903e-521509528d39'::uuid,
  'admin',
  'Marek Příbramský'
)
on conflict (id) do update
set
  role = 'admin',
  full_name = coalesce(nullif(btrim(p.full_name), ''), excluded.full_name);
