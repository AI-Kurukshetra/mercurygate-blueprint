-- Deterministic demo seed for TMS MVP.
-- Safe to run multiple times because inserts use upserts on primary keys.

insert into public.customers (
  id, name, account_code, contact_name, contact_email, contact_phone, billing_terms, status
)
values
  ('11111111-1111-1111-1111-111111111111', 'Acme Retail', 'ACME-HACK', 'Jordan Miles', 'ops@acme.com', '555-0101', 'Net 30', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'Northwind Foods', 'NWFD-HACK', 'Avery Stone', 'dispatch@northwind.com', '555-0202', 'Net 15', 'active'),
  ('99999999-9999-9999-9999-999999999999', 'Demo Customer', 'DEMO-HACK', 'Demo Contact', 'demo.customer@gmail.com', '555-0000', 'Net 30', 'active')
on conflict (id) do update
set
  name = excluded.name,
  account_code = excluded.account_code,
  contact_name = excluded.contact_name,
  contact_email = excluded.contact_email,
  contact_phone = excluded.contact_phone,
  billing_terms = excluded.billing_terms,
  status = excluded.status;

insert into public.carriers (
  id, name, scac_code, service_area, contact_name, contact_email, contact_phone, status
)
values
  ('33333333-3333-3333-3333-333333333333', 'BlueRoute Logistics', 'BLRT', 'West Coast + Texas', 'Priya Shah', 'carrier@blueroute.com', '555-0303', 'active'),
  ('44444444-4444-4444-4444-444444444444', 'Summit Freight', 'SMFT', 'Midwest + Southeast', 'Leo Carter', 'ops@summitfreight.com', '555-0404', 'active')
on conflict (id) do update
set
  name = excluded.name,
  scac_code = excluded.scac_code,
  service_area = excluded.service_area,
  contact_name = excluded.contact_name,
  contact_email = excluded.contact_email,
  contact_phone = excluded.contact_phone,
  status = excluded.status;

insert into public.drivers (id, carrier_id, full_name, phone, license_number, status)
values
  ('55555555-5555-5555-5555-555555555551', '33333333-3333-3333-3333-333333333333', 'Rafael Diaz', '555-2011', 'CA-DL-1001', 'active'),
  ('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444444', 'Nina Cole', '555-2012', 'IL-DL-1002', 'active')
on conflict (id) do update
set
  carrier_id = excluded.carrier_id,
  full_name = excluded.full_name,
  phone = excluded.phone,
  license_number = excluded.license_number,
  status = excluded.status;

insert into public.vehicles (id, carrier_id, vehicle_number, vehicle_type, capacity_lb, status)
values
  ('66666666-6666-6666-6666-666666666661', '33333333-3333-3333-3333-333333333333', 'BL-TRK-01', '53ft Dry Van', 44000, 'active'),
  ('66666666-6666-6666-6666-666666666662', '44444444-4444-4444-4444-444444444444', 'SF-TRK-08', 'Reefer', 42000, 'active')
on conflict (id) do update
set
  carrier_id = excluded.carrier_id,
  vehicle_number = excluded.vehicle_number,
  vehicle_type = excluded.vehicle_type,
  capacity_lb = excluded.capacity_lb,
  status = excluded.status;

insert into public.routes (
  id, customer_id, lane, origin_city, origin_state, destination_city, destination_state, estimated_miles, estimated_transit_days
)
values
  ('77777777-7777-7777-7777-777777777771', '11111111-1111-1111-1111-111111111111', 'Los Angeles, CA -> Dallas, TX', 'Los Angeles', 'CA', 'Dallas', 'TX', 1500, 3),
  ('77777777-7777-7777-7777-777777777772', '22222222-2222-2222-2222-222222222222', 'Chicago, IL -> Atlanta, GA', 'Chicago', 'IL', 'Atlanta', 'GA', 720, 2),
  ('77777777-7777-7777-7777-777777777773', '99999999-9999-9999-9999-999999999999', 'Seattle, WA -> San Diego, CA', 'Seattle', 'WA', 'San Diego', 'CA', 980, 2)
on conflict (id) do update
set
  customer_id = excluded.customer_id,
  lane = excluded.lane,
  origin_city = excluded.origin_city,
  origin_state = excluded.origin_state,
  destination_city = excluded.destination_city,
  destination_state = excluded.destination_state,
  estimated_miles = excluded.estimated_miles,
  estimated_transit_days = excluded.estimated_transit_days;

insert into public.rates (
  id, carrier_id, mode, origin_region, destination_region, base_rate, rate_per_mile, is_active
)
values
  ('88888888-8888-8888-8888-888888888881', '33333333-3333-3333-3333-333333333333', 'FTL', 'CA', 'TX', 450.00, 2.25, true),
  ('88888888-8888-8888-8888-888888888882', '44444444-4444-4444-4444-444444444444', 'LTL', 'IL', 'GA', 200.00, 1.35, true),
  ('88888888-8888-8888-8888-888888888883', '33333333-3333-3333-3333-333333333333', 'FTL', 'WA', 'CA', 320.00, 1.90, true)
on conflict (id) do update
set
  carrier_id = excluded.carrier_id,
  mode = excluded.mode,
  origin_region = excluded.origin_region,
  destination_region = excluded.destination_region,
  base_rate = excluded.base_rate,
  rate_per_mile = excluded.rate_per_mile,
  is_active = excluded.is_active;

insert into public.orders (
  id, customer_id, order_number, mode, commodity, weight_lb, origin_city, origin_state, destination_city, destination_state,
  pickup_date, delivery_date, status, notes
)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'ORD-HACK-1001', 'FTL', 'Consumer Electronics', 18000, 'Los Angeles', 'CA', 'Dallas', 'TX', current_date - 2, current_date + 1, 'shipped', 'Priority retail replenishment'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '22222222-2222-2222-2222-222222222222', 'ORD-HACK-1002', 'LTL', 'Chilled Produce', 9000, 'Chicago', 'IL', 'Atlanta', 'GA', current_date - 1, current_date + 1, 'shipped', 'Temperature sensitive cargo'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '99999999-9999-9999-9999-999999999999', 'ORD-HACK-1003', 'FTL', 'Furniture', 14000, 'Seattle', 'WA', 'San Diego', 'CA', current_date, current_date + 2, 'planned', 'Store launch inventory')
on conflict (id) do update
set
  customer_id = excluded.customer_id,
  order_number = excluded.order_number,
  mode = excluded.mode,
  commodity = excluded.commodity,
  weight_lb = excluded.weight_lb,
  origin_city = excluded.origin_city,
  origin_state = excluded.origin_state,
  destination_city = excluded.destination_city,
  destination_state = excluded.destination_state,
  pickup_date = excluded.pickup_date,
  delivery_date = excluded.delivery_date,
  status = excluded.status,
  notes = excluded.notes;

insert into public.shipments (
  id, order_id, customer_id, shipment_number, status, carrier_id, driver_id, vehicle_id, route_id,
  rate_amount, distance_miles, transit_days, pickup_eta, delivery_eta, delivered_at
)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'SHP-HACK-2001', 'in_transit', '33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555551', '66666666-6666-6666-6666-666666666661', '77777777-7777-7777-7777-777777777771', 3825.00, 1500, 3, now() - interval '1 day', now() + interval '1 day', null),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '22222222-2222-2222-2222-222222222222', 'SHP-HACK-2002', 'delivered', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555552', '66666666-6666-6666-6666-666666666662', '77777777-7777-7777-7777-777777777772', 1172.00, 720, 2, now() - interval '3 days', now() - interval '1 day', now() - interval '1 day'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '99999999-9999-9999-9999-999999999999', 'SHP-HACK-2003', 'planned', null, null, null, '77777777-7777-7777-7777-777777777773', 0, 980, 2, now() + interval '4 hours', now() + interval '2 days', null)
on conflict (id) do update
set
  order_id = excluded.order_id,
  customer_id = excluded.customer_id,
  shipment_number = excluded.shipment_number,
  status = excluded.status,
  carrier_id = excluded.carrier_id,
  driver_id = excluded.driver_id,
  vehicle_id = excluded.vehicle_id,
  route_id = excluded.route_id,
  rate_amount = excluded.rate_amount,
  distance_miles = excluded.distance_miles,
  transit_days = excluded.transit_days,
  pickup_eta = excluded.pickup_eta,
  delivery_eta = excluded.delivery_eta,
  delivered_at = excluded.delivered_at;

insert into public.tracking_events (
  id, shipment_id, event_type, description, location, event_time
)
values
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'picked_up', 'Pickup confirmed at origin warehouse', 'Los Angeles, CA', now() - interval '22 hours'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'in_transit', 'Shipment moving through regional hub', 'Albuquerque, NM', now() - interval '8 hours'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'delivered', 'Proof of delivery received', 'Atlanta, GA', now() - interval '24 hours')
on conflict (id) do update
set
  shipment_id = excluded.shipment_id,
  event_type = excluded.event_type,
  description = excluded.description,
  location = excluded.location,
  event_time = excluded.event_time;

insert into public.documents (
  id, customer_id, shipment_id, order_id, file_name, file_path, file_type
)
values
  ('dddddddd-dddd-dddd-dddd-ddddddddddd1', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'BOL-SHP-HACK-2001.pdf', '11111111-1111-1111-1111-111111111111/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1/bol-hack-2001.pdf', 'application/pdf'),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd2', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'POD-SHP-HACK-2002.pdf', '22222222-2222-2222-2222-222222222222/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2/pod-hack-2002.pdf', 'application/pdf')
on conflict (id) do update
set
  customer_id = excluded.customer_id,
  shipment_id = excluded.shipment_id,
  order_id = excluded.order_id,
  file_name = excluded.file_name,
  file_path = excluded.file_path,
  file_type = excluded.file_type;

insert into public.invoices (
  id, customer_id, shipment_id, invoice_number, amount, status, due_date
)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'INV-HACK-3001', 3825.00, 'sent', current_date + 10),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'INV-HACK-3002', 1172.00, 'paid', current_date - 2)
on conflict (id) do update
set
  customer_id = excluded.customer_id,
  shipment_id = excluded.shipment_id,
  invoice_number = excluded.invoice_number,
  amount = excluded.amount,
  status = excluded.status,
  due_date = excluded.due_date;
