-- Answers from kariérní one-question wizard (JSON). Nullable for legacy řádky.
alter table public.job_applications
  add column if not exists wizard_answers jsonb;

comment on column public.job_applications.wizard_answers is 'Otázky a odpovědi z náborového wizardu (strukturovaný JSON).';
