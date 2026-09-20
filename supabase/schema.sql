-- Kelcee Beauty Co. — Supabase schema
-- Run this in the Supabase SQL Editor after creating your project.

-- Gallery images metadata table
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table gallery_images enable row level security;

-- Public read access for the marketing site
create policy "Public can view gallery images"
  on gallery_images
  for select
  to anon, authenticated
  using (true);

-- Authenticated users (Kelcee) can manage gallery images
create policy "Authenticated users can insert gallery images"
  on gallery_images
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update gallery images"
  on gallery_images
  for update
  to authenticated
  using (true);

create policy "Authenticated users can delete gallery images"
  on gallery_images
  for delete
  to authenticated
  using (true);

-- Storage bucket setup (also create "gallery" bucket in Storage UI as public)
-- Then run these policies:

create policy "Public can view gallery files"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'gallery');

create policy "Authenticated users can upload gallery files"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'gallery');

create policy "Authenticated users can update gallery files"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'gallery');

create policy "Authenticated users can delete gallery files"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'gallery');
