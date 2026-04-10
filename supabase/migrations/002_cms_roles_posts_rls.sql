-- CMS: admin + editor roles, extended posts, site_settings admin-only writes
-- Apply after 001_initial.sql (existing projects: run in SQL Editor or `supabase db push`)

-- 1) Profiles: allow admin role + display name for bylines
alter table public.profiles drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check check (role in ('admin', 'editor'));

alter table public.profiles
  alter column role set default 'editor';

alter table public.profiles
  add column if not exists full_name text;

-- 2) Posts: SEO, author snapshot, editorial metadata
alter table public.posts add column if not exists seo_title text;
alter table public.posts add column if not exists seo_description text;
alter table public.posts add column if not exists canonical_url text;
alter table public.posts add column if not exists author_id uuid references public.profiles (id) on delete set null;
alter table public.posts add column if not exists author_name text;
alter table public.posts add column if not exists reading_time smallint;
alter table public.posts add column if not exists featured boolean not null default false;
alter table public.posts add column if not exists og_image_url text;
alter table public.posts add column if not exists content_type text not null default 'blog';

alter table public.posts drop constraint if exists posts_content_type_check;
alter table public.posts
  add constraint posts_content_type_check check (content_type in ('blog', 'article', 'insight'));

create index if not exists posts_featured_published_at_idx on public.posts (featured, published_at desc nulls last);

-- 3) Replace post policies: staff = admin OR editor
drop policy if exists "Editors read all posts" on public.posts;
drop policy if exists "Editors insert posts" on public.posts;
drop policy if exists "Editors update posts" on public.posts;
drop policy if exists "Editors delete posts" on public.posts;

create policy "Staff read all posts"
  on public.posts for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'editor')
    )
  );

create policy "Staff insert posts"
  on public.posts for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'editor')
    )
  );

create policy "Staff update posts"
  on public.posts for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'editor')
    )
  );

create policy "Staff delete posts"
  on public.posts for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'editor')
    )
  );

-- 4) Site settings: only admins may read/write non-public keys; public still reads public_readable
drop policy if exists "Editors read all site settings" on public.site_settings;
drop policy if exists "Editors insert site settings" on public.site_settings;
drop policy if exists "Editors update site settings" on public.site_settings;
drop policy if exists "Editors delete site settings" on public.site_settings;

create policy "Admins read all site settings"
  on public.site_settings for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins insert site settings"
  on public.site_settings for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins update site settings"
  on public.site_settings for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins delete site settings"
  on public.site_settings for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- 5) Storage: staff (admin | editor) for blog covers
drop policy if exists "Editors upload blog covers" on storage.objects;
drop policy if exists "Editors update blog covers" on storage.objects;
drop policy if exists "Editors delete blog covers" on storage.objects;

create policy "Staff upload blog covers"
  on storage.objects for insert
  with check (
    bucket_id = 'blog-covers'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'editor')
    )
  );

create policy "Staff update blog covers"
  on storage.objects for update
  using (
    bucket_id = 'blog-covers'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'editor')
    )
  );

create policy "Staff delete blog covers"
  on storage.objects for delete
  using (
    bucket_id = 'blog-covers'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'editor')
    )
  );
