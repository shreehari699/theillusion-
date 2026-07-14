-- ═══════════════════════════════════════════════════════════════════
-- THE ILLUSION — Database Schema
-- Paste this ENTIRE file into Supabase → SQL Editor → New Query → Run.
-- Safe to run once. Creates the orders table, storage, and security rules.
-- ═══════════════════════════════════════════════════════════════════

-- 1. ORDERS TABLE ---------------------------------------------------
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  order_code    text unique not null,          -- friendly code e.g. ORD-7641
  user_id       uuid references auth.users(id) on delete set null,

  -- customer details
  full_name     text not null,
  email         text not null,
  phone         text not null,
  address       text,
  city          text,
  state         text,
  pincode       text,

  -- order details
  quantity      int  not null default 1,
  unit_price    int  not null,                 -- rupees, whole numbers
  total_price   int  not null,
  payment_method text not null check (payment_method in ('UPI','PICKUP')),

  -- payment proof (UPI screenshot lives in Storage; we keep its path)
  payment_screenshot_path text,

  -- lifecycle
  status text not null default 'PENDING_VERIFICATION'
    check (status in (
      'PENDING_VERIFICATION','PAID','RESERVED',
      'PACKED','SHIPPED','DELIVERED','CANCELLED'
    )),
  printed boolean not null default false,       -- for print management

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists orders_user_idx   on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_idx on public.orders(created_at desc);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

-- 2. ADMIN ALLOWLIST ------------------------------------------------
-- Only emails in this table can see all orders / act as admin.
create table if not exists public.admins (
  email text primary key
);
-- >>> IMPORTANT: replace with YOUR login email after you sign up <<<
-- insert into public.admins (email) values ('you@example.com');

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.admins a
    where a.email = (auth.jwt() ->> 'email')
  );
$$;

-- 3. ROW LEVEL SECURITY --------------------------------------------
-- The core protection: customers see only THEIR orders; admins see all.
alter table public.orders enable row level security;

-- customers can create their own orders
drop policy if exists orders_insert_own on public.orders;
create policy orders_insert_own on public.orders
  for insert to authenticated
  with check ( user_id = auth.uid() );

-- customers read their own; admins read all
drop policy if exists orders_select_own_or_admin on public.orders;
create policy orders_select_own_or_admin on public.orders
  for select to authenticated
  using ( user_id = auth.uid() or public.is_admin() );

-- only admins update (change status, mark printed)
drop policy if exists orders_update_admin on public.orders;
create policy orders_update_admin on public.orders
  for update to authenticated
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- 4. STORAGE for payment screenshots -------------------------------
insert into storage.buckets (id, name, public)
values ('payment-proofs','payment-proofs', false)
on conflict (id) do nothing;

-- authenticated users can upload their own proof
drop policy if exists proofs_upload on storage.objects;
create policy proofs_upload on storage.objects
  for insert to authenticated
  with check ( bucket_id = 'payment-proofs' );

-- owner or admin can read a proof
drop policy if exists proofs_read on storage.objects;
create policy proofs_read on storage.objects
  for select to authenticated
  using ( bucket_id = 'payment-proofs' and ( owner = auth.uid() or public.is_admin() ) );

-- ═══════════════════════════════════════════════════════════════════
-- DONE. After running: sign up on the site with your email, then run:
--   insert into public.admins (email) values ('your-login-email');
-- to make yourself the admin.
-- ═══════════════════════════════════════════════════════════════════
