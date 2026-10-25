-- Business hours (editable in /admin/dashboard)
create table if not exists public.business_hours (
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

alter table public.business_hours enable row level security;

insert into public.business_hours (day_key, label, hours_text, sort_order)
values
  ('monday', 'Monday', '3:30pm – 9pm', 1),
  ('tuesday', 'Tuesday', '3:30pm – 9pm', 2),
  ('wednesday', 'Wednesday', '3:30pm – 9pm', 3),
  ('thursday', 'Thursday', '9:00am – 9pm', 4),
  ('friday', 'Friday', '9:00am – 9pm', 5),
  ('saturday', 'Saturday', '9:00am – 9pm', 6),
  ('sunday', 'Sunday', 'Closed', 7)
on conflict (day_key) do nothing;

drop policy if exists "Public can view business hours" on public.business_hours;
create policy "Public can view business hours"
  on public.business_hours
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin can insert business hours" on public.business_hours;
create policy "Admin can insert business hours"
  on public.business_hours
  for insert
  to authenticated
  with check (public.is_gallery_admin());

drop policy if exists "Admin can update business hours" on public.business_hours;
create policy "Admin can update business hours"
  on public.business_hours
  for update
  to authenticated
  using (public.is_gallery_admin());

drop policy if exists "Admin can delete business hours" on public.business_hours;
create policy "Admin can delete business hours"
  on public.business_hours
  for delete
  to authenticated
  using (public.is_gallery_admin());
