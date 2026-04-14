-- Oprava nasazení, kde už běžela stará verze 004: politika četla znovu z profiles
-- uvnitř RLS na profiles → "infinite recursion detected in policy for relation profiles".

create or replace function public.current_user_is_cms_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'editor')
  );
$$;

revoke all on function public.current_user_is_cms_staff() from public;
grant execute on function public.current_user_is_cms_staff() to authenticated;
grant execute on function public.current_user_is_cms_staff() to service_role;

drop policy if exists "Staff read all profiles" on public.profiles;

create policy "Staff read all profiles"
  on public.profiles for select
  using (public.current_user_is_cms_staff());
