-- VIP sazby hypoték/úvěrů — manuální přepsání tržních sazeb pro přihlášené editory/admins.
-- Sazba nižší než kurzy.cz se v kalkulačce označí VIP badge.

create table public.mortgage_vip_rates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_type text not null check (product_type in ('mortgage', 'loan')),
  provider_id text not null,
  nominal_rate numeric(5, 2) not null check (nominal_rate > 0 and nominal_rate <= 30),
  apr numeric(5, 2) check (apr is null or (apr > 0 and apr <= 30)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_type, provider_id)
);

create index mortgage_vip_rates_user_product_idx
  on public.mortgage_vip_rates (user_id, product_type);

alter table public.mortgage_vip_rates enable row level security;

create policy "Staff read own vip rates"
  on public.mortgage_vip_rates for select
  using (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'editor')
    )
  );

create policy "Staff insert own vip rates"
  on public.mortgage_vip_rates for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'editor')
    )
  );

create policy "Staff update own vip rates"
  on public.mortgage_vip_rates for update
  using (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'editor')
    )
  );

create policy "Staff delete own vip rates"
  on public.mortgage_vip_rates for delete
  using (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'editor')
    )
  );

create trigger mortgage_vip_rates_updated_at
  before update on public.mortgage_vip_rates
  for each row execute function public.set_updated_at();
