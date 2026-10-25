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

-- Services catalog (editable in /admin/dashboard)
create table if not exists catalog_services (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  price_text text not null,
  duration text not null default '',
  category text not null,
  sort_order int not null,
  is_on_sale boolean not null default false,
  sale_price_text text,
  updated_at timestamptz default now()
);

alter table catalog_services enable row level security;

insert into catalog_services (
  name,
  description,
  price_text,
  duration,
  category,
  sort_order
)
values
  ('Women''s Haircut', 'Shampoo, cut, and blow-dry style.', '$25', '1 hr', 'Cuts & Styling', 1),
  ('Women''s Dry Cut', 'Precision cut without a wash.', '$18', '30 min', 'Cuts & Styling', 2),
  ('Men''s Cut', 'Men''s haircut and style.', '$20', '30 min', 'Cuts & Styling', 3),
  ('Kid''s Cut', 'Haircut for children.', '$15', '40 min', 'Cuts & Styling', 4),
  ('Bang Trim', 'Quick fringe touch-up.', '$5', '15 min', 'Cuts & Styling', 5),
  ('Wash & Style', 'Shampoo and styled finish.', '$20', '1 hr 30 min', 'Cuts & Styling', 6),
  ('Style (curls only)', 'Heat styling — curls only, no cut or color.', '$10', '10 min', 'Cuts & Styling', 7),
  ('Hair Updo', 'Formal or special-event updo styling.', '$50', '1 hr', 'Cuts & Styling', 8),
  ('Balayage', 'Hand-painted highlights for a natural, blended look.', '$115', '3 hr', 'Color', 9),
  ('Full Highlight', 'Full-head highlight service.', '$100', '3 hr', 'Color', 10),
  ('Partial Highlight', 'Partial-head highlight service.', '$80', '3 hr', 'Color', 11),
  ('All-Over Color', 'Single-process color from roots to ends.', '$90', '2 hr 30 min', 'Color', 12),
  ('Root Touch-Up', 'Color refresh at the roots.', '$65', '2 hr', 'Color', 13),
  ('Mini Foil (10–15 foils)', 'Partial foil highlights — 10 to 15 foils.', '$50', '1 hr 30 min', 'Color', 14),
  ('Money Piece', 'Face-framing highlight around the front.', '$40', '1 hr', 'Color', 15),
  ('Glaze', 'Semi-permanent color gloss for shine and tone.', '$30', '1 hr', 'Color', 16),
  ('Conditioning Treatment', 'Deep conditioning to restore moisture and strength.', '$25', '1 hr', 'Treatments', 17),
  ('Malibu Treatment', 'Clarifying treatment to remove buildup and hard-water minerals.', '$30', '1 hr', 'Treatments', 18),
  ('Hair Extensions', 'Extension installation — consult recommended for custom pricing.', '$150', '2 hr', 'Extensions', 19),
  ('Hair Extensions Move-Up (per row)', 'Maintenance move-up for existing extension rows.', '$40', '1 hr', 'Extensions', 20),
  ('Lash Lift & Tint', 'Lift and tint for fuller-looking lashes.', '$50', '1 hr', 'Lashes & Brows', 21),
  ('Brow Wax & Tint', 'Brow shaping with wax and tint.', '$18', '15 min', 'Lashes & Brows', 22),
  ('Tinsel (per bead)', 'Hair tinsel applied per bead.', '$2', '30 min', 'Add-ons', 23)
on conflict (name) do nothing;

create policy "Public can view catalog services"
  on catalog_services
  for select
  to anon, authenticated
  using (true);

create policy "Admin can insert catalog services"
  on catalog_services
  for insert
  to authenticated
  with check (public.is_gallery_admin());

create policy "Admin can update catalog services"
  on catalog_services
  for update
  to authenticated
  using (public.is_gallery_admin());

create policy "Admin can delete catalog services"
  on catalog_services
  for delete
  to authenticated
  using (public.is_gallery_admin());

-- Development/staging tables (local + preview when gallery bucket is gallery-dev)
-- App selects *_dev vs production tables via NEXT_PUBLIC_SUPABASE_GALLERY_BUCKET.

create table if not exists gallery_images_dev (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  bucket_id text not null default 'gallery-dev',
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table gallery_images_dev enable row level security;

create policy "Public can view gallery images dev"
  on gallery_images_dev
  for select
  to anon, authenticated
  using (true);

create policy "Admin can insert gallery images dev"
  on gallery_images_dev
  for insert
  to authenticated
  with check (
    public.is_gallery_admin()
    and public.is_gallery_bucket(bucket_id)
  );

create policy "Admin can update gallery images dev"
  on gallery_images_dev
  for update
  to authenticated
  using (public.is_gallery_admin() and public.is_gallery_bucket(bucket_id));

create policy "Admin can delete gallery images dev"
  on gallery_images_dev
  for delete
  to authenticated
  using (public.is_gallery_admin() and public.is_gallery_bucket(bucket_id));

create table if not exists business_hours_dev (
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

alter table business_hours_dev enable row level security;

insert into business_hours_dev (day_key, label, hours_text, sort_order)
values
  ('monday', 'Monday', '3:30pm – 9pm', 1),
  ('tuesday', 'Tuesday', '3:30pm – 9pm', 2),
  ('wednesday', 'Wednesday', '3:30pm – 9pm', 3),
  ('thursday', 'Thursday', '9:00am – 9pm', 4),
  ('friday', 'Friday', '9:00am – 9pm', 5),
  ('saturday', 'Saturday', '9:00am – 9pm', 6),
  ('sunday', 'Sunday', 'Closed', 7)
on conflict (day_key) do nothing;

create policy "Public can view business hours dev"
  on business_hours_dev
  for select
  to anon, authenticated
  using (true);

create policy "Admin can insert business hours dev"
  on business_hours_dev
  for insert
  to authenticated
  with check (public.is_gallery_admin());

create policy "Admin can update business hours dev"
  on business_hours_dev
  for update
  to authenticated
  using (public.is_gallery_admin());

create policy "Admin can delete business hours dev"
  on business_hours_dev
  for delete
  to authenticated
  using (public.is_gallery_admin());

create table if not exists catalog_services_dev (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  price_text text not null,
  duration text not null default '',
  category text not null,
  sort_order int not null,
  is_on_sale boolean not null default false,
  sale_price_text text,
  updated_at timestamptz default now()
);

alter table catalog_services_dev enable row level security;

insert into catalog_services_dev (
  name,
  description,
  price_text,
  duration,
  category,
  sort_order
)
values
  ('Women''s Haircut', 'Shampoo, cut, and blow-dry style.', '$25', '1 hr', 'Cuts & Styling', 1),
  ('Women''s Dry Cut', 'Precision cut without a wash.', '$18', '30 min', 'Cuts & Styling', 2),
  ('Men''s Cut', 'Men''s haircut and style.', '$20', '30 min', 'Cuts & Styling', 3),
  ('Kid''s Cut', 'Haircut for children.', '$15', '40 min', 'Cuts & Styling', 4),
  ('Bang Trim', 'Quick fringe touch-up.', '$5', '15 min', 'Cuts & Styling', 5),
  ('Wash & Style', 'Shampoo and styled finish.', '$20', '1 hr 30 min', 'Cuts & Styling', 6),
  ('Style (curls only)', 'Heat styling — curls only, no cut or color.', '$10', '10 min', 'Cuts & Styling', 7),
  ('Hair Updo', 'Formal or special-event updo styling.', '$50', '1 hr', 'Cuts & Styling', 8),
  ('Balayage', 'Hand-painted highlights for a natural, blended look.', '$115', '3 hr', 'Color', 9),
  ('Full Highlight', 'Full-head highlight service.', '$100', '3 hr', 'Color', 10),
  ('Partial Highlight', 'Partial-head highlight service.', '$80', '3 hr', 'Color', 11),
  ('All-Over Color', 'Single-process color from roots to ends.', '$90', '2 hr 30 min', 'Color', 12),
  ('Root Touch-Up', 'Color refresh at the roots.', '$65', '2 hr', 'Color', 13),
  ('Mini Foil (10–15 foils)', 'Partial foil highlights — 10 to 15 foils.', '$50', '1 hr 30 min', 'Color', 14),
  ('Money Piece', 'Face-framing highlight around the front.', '$40', '1 hr', 'Color', 15),
  ('Glaze', 'Semi-permanent color gloss for shine and tone.', '$30', '1 hr', 'Color', 16),
  ('Conditioning Treatment', 'Deep conditioning to restore moisture and strength.', '$25', '1 hr', 'Treatments', 17),
  ('Malibu Treatment', 'Clarifying treatment to remove buildup and hard-water minerals.', '$30', '1 hr', 'Treatments', 18),
  ('Hair Extensions', 'Extension installation — consult recommended for custom pricing.', '$150', '2 hr', 'Extensions', 19),
  ('Hair Extensions Move-Up (per row)', 'Maintenance move-up for existing extension rows.', '$40', '1 hr', 'Extensions', 20),
  ('Lash Lift & Tint', 'Lift and tint for fuller-looking lashes.', '$50', '1 hr', 'Lashes & Brows', 21),
  ('Brow Wax & Tint', 'Brow shaping with wax and tint.', '$18', '15 min', 'Lashes & Brows', 22),
  ('Tinsel (per bead)', 'Hair tinsel applied per bead.', '$2', '30 min', 'Add-ons', 23)
on conflict (name) do nothing;

create policy "Public can view catalog services dev"
  on catalog_services_dev
  for select
  to anon, authenticated
  using (true);

create policy "Admin can insert catalog services dev"
  on catalog_services_dev
  for insert
  to authenticated
  with check (public.is_gallery_admin());

create policy "Admin can update catalog services dev"
  on catalog_services_dev
  for update
  to authenticated
  using (public.is_gallery_admin());

create policy "Admin can delete catalog services dev"
  on catalog_services_dev
  for delete
  to authenticated
  using (public.is_gallery_admin());
