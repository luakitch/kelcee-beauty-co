-- Services catalog (editable in /admin/dashboard)
create table if not exists public.catalog_services (
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

alter table public.catalog_services enable row level security;

insert into public.catalog_services (
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

drop policy if exists "Public can view catalog services" on public.catalog_services;
create policy "Public can view catalog services"
  on public.catalog_services
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin can insert catalog services" on public.catalog_services;
create policy "Admin can insert catalog services"
  on public.catalog_services
  for insert
  to authenticated
  with check (public.is_gallery_admin());

drop policy if exists "Admin can update catalog services" on public.catalog_services;
create policy "Admin can update catalog services"
  on public.catalog_services
  for update
  to authenticated
  using (public.is_gallery_admin());

drop policy if exists "Admin can delete catalog services" on public.catalog_services;
create policy "Admin can delete catalog services"
  on public.catalog_services
  for delete
  to authenticated
  using (public.is_gallery_admin());
