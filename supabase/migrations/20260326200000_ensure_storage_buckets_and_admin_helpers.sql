-- Idempotent prod/staging prerequisites (also in schema.sql).
-- Safe to re-run if an older manual schema apply skipped storage or helpers.

insert into storage.buckets (id, name, public)
values
  ('gallery', 'gallery', true),
  ('gallery-dev', 'gallery-dev', true)
on conflict (id) do update set public = excluded.public;

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
