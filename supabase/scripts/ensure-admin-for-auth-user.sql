-- =============================================================================
-- Přístup do CMS (/admin): propojení Auth uživatele s public.profiles
-- =============================================================================
-- Spusť v Supabase: SQL Editor → New query → Run.
-- Idempotní: při opakovaném spuštění jen doplní / upgraduje roli na admin.
--
-- Uživatel: malphas@email.cz (User UID z dashboardu Authentication)
-- =============================================================================

insert into public.profiles as p (id, role, full_name)
values (
  '0c4589ba-b827-4d7f-983e-521509528d39'::uuid,
  'admin',
  'Marek Příbramský'
)
on conflict (id) do update
set
  role = 'admin',
  full_name = coalesce(nullif(btrim(p.full_name), ''), excluded.full_name);
