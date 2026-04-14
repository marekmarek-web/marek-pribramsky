-- Rozšíření CRM zdrojů: kariéra a odběr novinek (vedle stávajících typů).

alter table public.leads drop constraint if exists leads_source_type_check;

alter table public.leads
  add constraint leads_source_type_check check (
    source_type in (
      'homepage',
      'footer',
      'contact',
      'calculator',
      'article',
      'service_page',
      'career',
      'newsletter'
    )
  );
