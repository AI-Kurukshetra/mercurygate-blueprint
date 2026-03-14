# Database Design

## Entity Relationship Summary

```text
auth.users -> profiles -> customers
customers -> orders -> shipments -> tracking_events
customers -> shipments -> documents
carriers -> rates
carriers -> drivers
carriers -> vehicles
customers -> routes
customers -> invoices
shipments -> invoices
```

## Tables

### `profiles`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, FK to `auth.users.id` |
| `email` | `text` | user email |
| `full_name` | `text` | optional |
| `role` | `app_role` | `admin`, `ops`, `customer` |
| `customer_id` | `uuid` | FK to `customers.id`, nullable |
| `created_at` | `timestamptz` | default `now()` |

### `customers`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `name` | `text` | customer name |
| `account_code` | `text` | unique business key |
| `contact_name` | `text` | primary contact |
| `contact_email` | `text` | primary contact email |
| `contact_phone` | `text` | primary contact phone |
| `billing_terms` | `text` | ex: Net 30 |
| `status` | `text` | active / inactive |
| `created_at` | `timestamptz` | default `now()` |

### `orders`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `customer_id` | `uuid` | FK to `customers.id` |
| `order_number` | `text` | unique |
| `mode` | `text` | FTL, LTL, Parcel, Intermodal |
| `commodity` | `text` | goods description |
| `weight_lb` | `numeric` | cargo weight |
| `origin_city` | `text` | lane origin |
| `origin_state` | `text` | lane origin state |
| `destination_city` | `text` | lane destination |
| `destination_state` | `text` | lane destination state |
| `pickup_date` | `date` | planned pickup |
| `delivery_date` | `date` | planned delivery |
| `status` | `text` | workflow status |
| `notes` | `text` | optional notes |
| `created_by` | `uuid` | FK to `profiles.id` |
| `created_at` | `timestamptz` | default `now()` |

### `shipments`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `order_id` | `uuid` | FK to `orders.id` |
| `customer_id` | `uuid` | FK to `customers.id` |
| `shipment_number` | `text` | unique |
| `status` | `text` | planned, in_transit, delivered, delayed |
| `carrier_id` | `uuid` | FK to `carriers.id` |
| `driver_id` | `uuid` | FK to `drivers.id` |
| `vehicle_id` | `uuid` | FK to `vehicles.id` |
| `route_id` | `uuid` | FK to `routes.id` |
| `rate_amount` | `numeric` | calculated total rate |
| `distance_miles` | `numeric` | estimated miles |
| `transit_days` | `integer` | estimated transit days |
| `pickup_eta` | `timestamptz` | expected pickup |
| `delivery_eta` | `timestamptz` | expected delivery |
| `delivered_at` | `timestamptz` | delivery completion |
| `created_at` | `timestamptz` | default `now()` |

### `carriers`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `name` | `text` | carrier name |
| `scac_code` | `text` | unique, nullable |
| `service_area` | `text` | supported zones |
| `contact_name` | `text` | primary carrier contact |
| `contact_email` | `text` | primary carrier email |
| `contact_phone` | `text` | primary carrier phone |
| `status` | `text` | active / inactive |
| `created_at` | `timestamptz` | default `now()` |

### `rates`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `carrier_id` | `uuid` | FK to `carriers.id` |
| `mode` | `text` | transportation mode |
| `origin_region` | `text` | state or region code |
| `destination_region` | `text` | state or region code |
| `base_rate` | `numeric` | fixed amount |
| `rate_per_mile` | `numeric` | mileage rate |
| `is_active` | `boolean` | active rate flag |
| `created_at` | `timestamptz` | default `now()` |

### `routes`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `customer_id` | `uuid` | FK to `customers.id` |
| `lane` | `text` | origin -> destination summary |
| `origin_city` | `text` | route origin city |
| `origin_state` | `text` | route origin state |
| `destination_city` | `text` | route destination city |
| `destination_state` | `text` | route destination state |
| `estimated_miles` | `numeric` | optimization output |
| `estimated_transit_days` | `integer` | optimization output |
| `created_at` | `timestamptz` | default `now()` |

### `drivers`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `carrier_id` | `uuid` | FK to `carriers.id` |
| `full_name` | `text` | driver name |
| `phone` | `text` | optional |
| `license_number` | `text` | optional |
| `status` | `text` | active / inactive |
| `created_at` | `timestamptz` | default `now()` |

### `vehicles`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `carrier_id` | `uuid` | FK to `carriers.id` |
| `vehicle_number` | `text` | unit identifier |
| `vehicle_type` | `text` | trailer / truck type |
| `capacity_lb` | `numeric` | capacity |
| `status` | `text` | active / inactive |
| `created_at` | `timestamptz` | default `now()` |

### `documents`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `customer_id` | `uuid` | FK to `customers.id` |
| `shipment_id` | `uuid` | FK to `shipments.id` |
| `order_id` | `uuid` | FK to `orders.id` |
| `file_name` | `text` | original file name |
| `file_path` | `text` | storage object path |
| `file_type` | `text` | MIME type |
| `uploaded_by` | `uuid` | FK to `profiles.id` |
| `uploaded_at` | `timestamptz` | default `now()` |

### `tracking_events`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `shipment_id` | `uuid` | FK to `shipments.id` |
| `event_type` | `text` | created, picked_up, in_transit, delayed, delivered |
| `description` | `text` | event description |
| `location` | `text` | optional location |
| `event_time` | `timestamptz` | business event timestamp |
| `created_at` | `timestamptz` | insert timestamp |

### `invoices`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `customer_id` | `uuid` | FK to `customers.id` |
| `shipment_id` | `uuid` | FK to `shipments.id` |
| `invoice_number` | `text` | unique |
| `amount` | `numeric` | invoice total |
| `status` | `text` | draft, sent, paid |
| `due_date` | `date` | payment due date |
| `created_at` | `timestamptz` | default `now()` |

## Relationships

- One `customer` has many `orders`, `shipments`, `routes`, `documents`, and `invoices`
- One `order` can produce one or more `shipments`
- One `carrier` has many `rates`, `drivers`, and `vehicles`
- One `shipment` has many `tracking_events` and `documents`
- One `profile` optionally belongs to one `customer`

## Indexes

- `idx_profiles_customer_id`
- `idx_orders_customer_status`
- `idx_orders_pickup_date`
- `idx_shipments_customer_status`
- `idx_shipments_carrier_id`
- `idx_tracking_events_shipment_time`
- `idx_documents_customer_shipment`
- `idx_rates_carrier_mode_active`
- `idx_routes_customer_lane`
- `idx_invoices_customer_status`

## Row Level Security Summary

- `admin` and `ops` can read and mutate operational records
- `customer` can only read rows tied to `profiles.customer_id`
- Storage object access follows the same model using bucket folder prefixes

## Migration History

- `20260314111500_tms_mvp.sql` — initial TMS MVP schema, indexes, RLS, storage bucket, and realtime configuration
