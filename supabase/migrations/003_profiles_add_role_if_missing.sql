-- Když `public.profiles` vznikla ze Supabase šablony (nebo starší verze) bez sloupce `role`,
-- INSERT s (id, role, full_name) spadne na: column "role" does not exist.
-- Spusť v Supabase SQL Editoru jednorázově (idempotentní).

alter table public.profiles add column if not exists role text;
alter table public.profiles add column if not exists full_name text;

update public.profiles
set role = coalesce(nullif(trim(role), ''), 'editor')
where role is null or trim(role) = '';

alter table public.profiles alter column role set default 'editor';
alter table public.profiles alter column role set not null;

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('admin', 'editor'));
