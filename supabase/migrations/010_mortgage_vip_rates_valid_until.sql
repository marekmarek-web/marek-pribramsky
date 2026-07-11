-- Datum platnosti VIP sazby (včetně daného dne). NULL = bez expirace.

alter table public.mortgage_vip_rates
  add column valid_until date;

comment on column public.mortgage_vip_rates.valid_until is
  'Den platnosti VIP sazby včetně; NULL = platí do ruční změny nebo smazání.';
