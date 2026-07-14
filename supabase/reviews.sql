-- ═══════════════════════════════════════════════════════════════════
-- THE ILLUSION — Reviews table
-- Run this in Supabase → SQL Editor → New Query → Run.
-- Adds live customer reviews (real, not fake).
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  name        text not null,
  rating      int  not null check (rating between 1 and 5),
  review_text text not null,
  approved    boolean not null default true,   -- you can hide a review by setting false
  created_at  timestamptz not null default now()
);

create index if not exists reviews_created_idx on public.reviews(created_at desc);

alter table public.reviews enable row level security;

-- anyone (even logged out) can READ approved reviews
drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews
  for select
  using ( approved = true );

-- only logged-in users can WRITE a review, tied to their own id
drop policy if exists reviews_insert_own on public.reviews;
create policy reviews_insert_own on public.reviews
  for insert to authenticated
  with check ( user_id = auth.uid() );

-- only admins can update/hide reviews
drop policy if exists reviews_update_admin on public.reviews;
create policy reviews_update_admin on public.reviews
  for update to authenticated
  using ( public.is_admin() )
  with check ( public.is_admin() );
