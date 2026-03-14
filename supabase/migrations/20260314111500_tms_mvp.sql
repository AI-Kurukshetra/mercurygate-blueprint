create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'ops', 'customer');
  end if;
end $$;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  account_code text not null unique,
  contact_name text,
  contact_email text,
  contact_phone text,
  billing_terms text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role public.app_role not null default 'customer',
  customer_id uuid references public.customers(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.current_role()
returns public.app_role
language sql
stable
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'customer'::public.app_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.current_role() = 'admin'::public.app_role;
$$;

create or replace function public.is_ops()
returns boolean
language sql
stable
as $$
  select public.current_role() in ('admin'::public.app_role, 'ops'::public.app_role);
$$;

create table if not exists public.carriers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scac_code text unique,
  service_area text,
  contact_name text,
  contact_email text,
  contact_phone text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid not null references public.carriers(id) on delete cascade,
  full_name text not null,
  phone text,
  license_number text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid not null references public.carriers(id) on delete cascade,
  vehicle_number text not null,
  vehicle_type text,
  capacity_lb numeric(12,2),
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  order_number text not null unique,
  mode text not null,
  commodity text not null,
  weight_lb numeric(12,2) not null,
  origin_city text not null,
  origin_state text not null,
  destination_city text not null,
  destination_state text not null,
  pickup_date date not null,
  delivery_date date,
  status text not null default 'draft',
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  lane text not null,
  origin_city text not null,
  origin_state text not null,
  destination_city text not null,
  destination_state text not null,
  estimated_miles numeric(12,2) not null,
  estimated_transit_days integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.rates (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid not null references public.carriers(id) on delete cascade,
  mode text not null,
  origin_region text not null,
  destination_region text not null,
  base_rate numeric(12,2) not null default 0,
  rate_per_mile numeric(12,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  shipment_number text not null unique,
  status text not null default 'planned',
  carrier_id uuid references public.carriers(id) on delete set null,
  driver_id uuid references public.drivers(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  route_id uuid references public.routes(id) on delete set null,
  rate_amount numeric(12,2),
  distance_miles numeric(12,2),
  transit_days integer,
  pickup_eta timestamptz,
  delivery_eta timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  event_type text not null,
  description text,
  location text,
  event_time timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  shipment_id uuid references public.shipments(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_type text,
  uploaded_by uuid references public.profiles(id) on delete set null default auth.uid(),
  uploaded_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  shipment_id uuid references public.shipments(id) on delete set null,
  invoice_number text not null unique,
  amount numeric(12,2) not null,
  status text not null default 'draft',
  due_date date,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_customer_id on public.profiles(customer_id);
create index if not exists idx_orders_customer_status on public.orders(customer_id, status);
create index if not exists idx_orders_pickup_date on public.orders(pickup_date);
create index if not exists idx_shipments_customer_status on public.shipments(customer_id, status);
create index if not exists idx_shipments_carrier_id on public.shipments(carrier_id);
create index if not exists idx_tracking_events_shipment_time on public.tracking_events(shipment_id, event_time desc);
create index if not exists idx_documents_customer_shipment on public.documents(customer_id, shipment_id);
create index if not exists idx_rates_carrier_mode_active on public.rates(carrier_id, mode, is_active);
create index if not exists idx_routes_customer_lane on public.routes(customer_id, lane);
create index if not exists idx_invoices_customer_status on public.invoices(customer_id, status);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.shipments enable row level security;
alter table public.carriers enable row level security;
alter table public.rates enable row level security;
alter table public.routes enable row level security;
alter table public.drivers enable row level security;
alter table public.vehicles enable row level security;
alter table public.documents enable row level security;
alter table public.tracking_events enable row level security;
alter table public.invoices enable row level security;

create policy "Profiles read own or ops"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_ops());

create policy "Profiles update own or admin"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "Customers read allowed"
on public.customers
for select
to authenticated
using (
  public.is_ops()
  or id = (select customer_id from public.profiles where id = auth.uid())
);

create policy "Customers manage ops"
on public.customers
for all
to authenticated
using (public.is_ops())
with check (public.is_ops());

create policy "Orders read allowed"
on public.orders
for select
to authenticated
using (
  public.is_ops()
  or customer_id = (select customer_id from public.profiles where id = auth.uid())
);

create policy "Orders manage ops"
on public.orders
for all
to authenticated
using (public.is_ops())
with check (public.is_ops());

create policy "Shipments read allowed"
on public.shipments
for select
to authenticated
using (
  public.is_ops()
  or customer_id = (select customer_id from public.profiles where id = auth.uid())
);

create policy "Shipments manage ops"
on public.shipments
for all
to authenticated
using (public.is_ops())
with check (public.is_ops());

create policy "Carriers read all authenticated"
on public.carriers
for select
to authenticated
using (true);

create policy "Carriers manage ops"
on public.carriers
for all
to authenticated
using (public.is_ops())
with check (public.is_ops());

create policy "Rates read all authenticated"
on public.rates
for select
to authenticated
using (true);

create policy "Rates manage ops"
on public.rates
for all
to authenticated
using (public.is_ops())
with check (public.is_ops());

create policy "Routes read allowed"
on public.routes
for select
to authenticated
using (
  public.is_ops()
  or customer_id = (select customer_id from public.profiles where id = auth.uid())
);

create policy "Routes manage ops"
on public.routes
for all
to authenticated
using (public.is_ops())
with check (public.is_ops());

create policy "Drivers read all authenticated"
on public.drivers
for select
to authenticated
using (true);

create policy "Drivers manage ops"
on public.drivers
for all
to authenticated
using (public.is_ops())
with check (public.is_ops());

create policy "Vehicles read all authenticated"
on public.vehicles
for select
to authenticated
using (true);

create policy "Vehicles manage ops"
on public.vehicles
for all
to authenticated
using (public.is_ops())
with check (public.is_ops());

create policy "Documents read allowed"
on public.documents
for select
to authenticated
using (
  public.is_ops()
  or customer_id = (select customer_id from public.profiles where id = auth.uid())
);

create policy "Documents manage ops"
on public.documents
for all
to authenticated
using (public.is_ops())
with check (public.is_ops());

create policy "Tracking read allowed"
on public.tracking_events
for select
to authenticated
using (
  public.is_ops()
  or exists (
    select 1
    from public.shipments s
    where s.id = tracking_events.shipment_id
      and s.customer_id = (select customer_id from public.profiles where id = auth.uid())
  )
);

create policy "Tracking manage ops"
on public.tracking_events
for all
to authenticated
using (public.is_ops())
with check (public.is_ops());

create policy "Invoices read allowed"
on public.invoices
for select
to authenticated
using (
  public.is_ops()
  or customer_id = (select customer_id from public.profiles where id = auth.uid())
);

create policy "Invoices manage ops"
on public.invoices
for all
to authenticated
using (public.is_ops())
with check (public.is_ops());

insert into storage.buckets (id, name, public)
values ('shipment-documents', 'shipment-documents', false)
on conflict (id) do nothing;

create policy "Ops manage shipment documents bucket"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'shipment-documents'
  and public.is_ops()
)
with check (
  bucket_id = 'shipment-documents'
  and public.is_ops()
);

create policy "Customers read own shipment documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'shipment-documents'
  and split_part(name, '/', 1) = coalesce(
    (select customer_id::text from public.profiles where id = auth.uid()),
    ''
  )
);

alter publication supabase_realtime add table public.tracking_events;
alter publication supabase_realtime add table public.shipments;
