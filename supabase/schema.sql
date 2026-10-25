-- Kelcee Beauty Co. — Supabase schema
-- Run this in the Supabase SQL Editor after creating your project.

-- Storage buckets (public read for marketing site)
insert into storage.buckets (id, name, public)
values
  ('gallery', 'gallery', true),
  ('gallery-dev', 'gallery-dev', true)
on conflict (id) do update set public = excluded.public;

-- Gallery images metadata table
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  bucket_id text not null default 'gallery',
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table gallery_images
  add column if not exists bucket_id text not null default 'gallery';

-- Enable Row Level Security
alter table gallery_images enable row level security;

-- Admin email allowlist — keep in sync with NEXT_PUBLIC_ADMIN_EMAILS in .env.local
create or replace function public.is_gallery_admin()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = any (
    array[
      'kitchelsoftware@gmail.com',
      'kelcee05@icloud.com',
      'mkenzie2000@hotmail.com'
    ]::text[]
  );
$$;

create or replace function public.is_gallery_bucket(bucket text)
returns boolean
language sql
stable
as $$
  select bucket = any (array['gallery', 'gallery-dev']::text[]);
$$;

-- Public read access for the marketing site
create policy "Public can view gallery images"
  on gallery_images
  for select
  to anon, authenticated
  using (true);

-- Admins can manage gallery images
create policy "Admin can insert gallery images"
  on gallery_images
  for insert
  to authenticated
  with check (
    public.is_gallery_admin()
    and public.is_gallery_bucket(bucket_id)
  );

create policy "Admin can update gallery images"
  on gallery_images
  for update
  to authenticated
  using (public.is_gallery_admin() and public.is_gallery_bucket(bucket_id));

create policy "Admin can delete gallery images"
  on gallery_images
  for delete
  to authenticated
  using (public.is_gallery_admin() and public.is_gallery_bucket(bucket_id));

create policy "Public can view gallery files"
  on storage.objects
  for select
  to anon, authenticated
  using (public.is_gallery_bucket(bucket_id));

create policy "Admin can upload gallery files"
  on storage.objects
  for insert
  to authenticated
  with check (public.is_gallery_bucket(bucket_id) and public.is_gallery_admin());

create policy "Admin can update gallery files"
  on storage.objects
  for update
  to authenticated
  using (public.is_gallery_bucket(bucket_id) and public.is_gallery_admin());

create policy "Admin can delete gallery files"
  on storage.objects
  for delete
  to authenticated
  using (public.is_gallery_bucket(bucket_id) and public.is_gallery_admin());

-- Business hours (editable in /admin/dashboard)
create table if not exists business_hours (
  day_key text primary key check (
    day_key = any (
      array[
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      ]::text[]
    )
  ),
  label text not null,
  hours_text text not null,
  sort_order int not null,
  updated_at timestamptz default now()
);

alter table business_hours enable row level security;

insert into business_hours (day_key, label, hours_text, sort_order)
values
  ('monday', 'Monday', '3:30pm – 9pm', 1),
  ('tuesday', 'Tuesday', '3:30pm – 9pm', 2),
  ('wednesday', 'Wednesday', '3:30pm – 9pm', 3),
  ('thursday', 'Thursday', '9:00am – 9pm', 4),
  ('friday', 'Friday', '9:00am – 9pm', 5),
  ('saturday', 'Saturday', '9:00am – 9pm', 6),
  ('sunday', 'Sunday', 'Closed', 7)
on conflict (day_key) do nothing;

create policy "Public can view business hours"
  on business_hours
  for select
  to anon, authenticated
  using (true);

create policy "Admin can insert business hours"
  on business_hours
  for insert
  to authenticated
  with check (public.is_gallery_admin());

create policy "Admin can update business hours"
  on business_hours
  for update
  to authenticated
  using (public.is_gallery_admin());

create policy "Admin can delete business hours"
  on business_hours
  for delete
  to authenticated
  using (public.is_gallery_admin());
