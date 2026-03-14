# System Architecture

## High-Level Architecture

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                             Next.js Frontend                            │
│  App Router pages, Tailwind UI, React Hook Form, Supabase JS client     │
└───────────────┬───────────────────────────────┬──────────────────────────┘
                │                               │
                │ SSR / Server Actions          │ Browser Auth + Realtime
                │                               │
┌───────────────▼──────────────────────────────────────────────────────────┐
│                           Supabase Platform                              │
│                                                                          │
│  Auth        PostgreSQL        Realtime       Storage      Edge Functions │
│  - email     - operational     - tracking     - BOL/POD    - createOrder  │
│  - roles     - RLS policies    - live events  - invoices   - createShip.  │
│  - sessions  - reporting views - status feed  - docs       - assignCarrier │
│                                                             - calcRate     │
│                                                             - trackShip.   │
│                                                             - uploadDoc    │
└──────────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### Frontend

- `app/(auth)/login` handles user sign-in with Supabase Auth
- `app/(dashboard)` provides the protected operations console
- Feature pages call server actions for core create/update flows
- Realtime shipment tracking subscribes to `tracking_events`

### Backend

- Supabase Auth stores the identity and session
- `profiles` maps auth users to roles and optional customer accounts
- PostgreSQL stores customers, orders, shipments, carriers, rates, routes, and documents
- Storage stores uploaded logistics files
- Edge Functions support external or service-to-service API calls

## Request Flow

1. User signs in with Supabase Auth.
2. Middleware refreshes the session and App Router loads protected pages.
3. Server components read RLS-protected data through the Supabase server client.
4. Server actions or Edge Functions perform validated writes.
5. Realtime pushes tracking updates to the UI.

## Security Model

- Roles: `admin`, `ops`, `customer`
- Access control is enforced primarily with Postgres RLS
- Customer users are scoped to `profiles.customer_id`
- Document bucket access is restricted by bucket policies and customer folder paths

