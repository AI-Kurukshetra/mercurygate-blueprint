# Transportation Management System MVP PRD

## Problem Statement

Small and mid-sized logistics teams need a single cloud platform to manage customers, orders, shipments, carrier assignment, rates, documents, and delivery tracking. Many teams still coordinate these steps across spreadsheets, email, and separate carrier portals, which slows execution and reduces shipment visibility.

This MVP provides a lightweight Transportation Management System inspired by MercuryGate focused on shipment lifecycle management.

## Target Users

- TMS administrators who configure users, carriers, rates, and reporting access
- Operations coordinators who create orders, build shipments, assign carriers, and track delivery progress
- Customer service teams who need shipment status and document visibility
- Customer portal users who need read-only access to their orders, shipments, and proof-of-delivery documents

## User Stories

- As an authenticated user, I can sign in and access only the modules allowed for my role.
- As an operations coordinator, I can create a customer order with origin, destination, dates, and cargo details.
- As an operations coordinator, I can convert an order into a shipment and assign a carrier.
- As an operations coordinator, I can see a basic recommended route and estimated distance.
- As an operations coordinator, I can calculate a shipment rate from stored carrier rates.
- As an operations coordinator, I can update shipment statuses and tracking milestones.
- As a user, I can upload shipment-related documents such as BOL, POD, and invoice attachments.
- As a manager, I can see dashboard KPIs for active shipments, delayed loads, and carrier utilization.
- As a customer, I can log into a portal and view only my own orders, shipments, tracking events, and documents.

## MVP Scope

### In Scope

- Supabase Auth based login
- Role-based access control for `admin`, `ops`, `customer`
- Customer management CRUD
- Order management CRUD
- Shipment creation from orders
- Carrier management CRUD
- Rate card management
- Basic route optimization based on origin, destination, and estimated miles
- Shipment tracking timeline with realtime updates
- Document upload to Supabase Storage
- Reporting dashboard with operational KPIs
- Customer portal with customer-scoped visibility

### Out of Scope

- AI-powered optimization
- Dynamic external map APIs
- EDI integrations
- Billing automation beyond basic invoice records
- Complex tendering workflows
- Multi-stop optimization

## Functional Requirements

### Authentication and Access           

1. Users must sign in with email and password.
2. Every authenticated user must have a role stored in the application database.
3. RBAC must restrict reads and writes through Supabase RLS.

### Customer Management

1. Admin and ops users can create and manage customers.
2. Customer records include account code, contacts, billing terms, and service status.

### Order Management

1. Users can create orders with customer, shipment mode, commodity, origin, destination, weights, and dates.
2. Orders can be in `draft`, `planned`, `shipped`, `delivered`, or `cancelled` status.

### Shipment Management

1. Users can create shipments from orders.
2. Shipments store route summary, assigned carrier, rate, ETA, and delivery status.
3. Shipment statuses include `planned`, `in_transit`, `delivered`, `delayed`, `cancelled`.

### Carrier and Rate Management

1. Users can create carriers with service zones and contact details.
2. Rates can be defined by carrier, mode, origin region, destination region, and per-mile / flat amounts.
3. The system must calculate a shipment rate using the best matching active rate.

### Route Optimization

1. The system provides a basic route recommendation based on distance band and estimated transit days.
2. The route output should be stored against the shipment.

### Tracking

1. Users can record tracking events such as pickup, in transit, delayed, out for delivery, and delivered.
2. Shipment tracking should be visible on internal and customer pages.
3. Realtime updates should surface newly added tracking events.

### Documents

1. Users can upload shipment or order documents.
2. Metadata is stored in Postgres while the file is stored in Supabase Storage.
3. Customers can only see documents associated with their own customer account.

### Reporting Dashboard

1. Dashboard shows counts for active shipments, delivered shipments, delayed shipments, revenue, and top carriers.
2. Reports page lists operational summaries by status and customer.

## Success Criteria

- A demo user can sign in and navigate all core modules.
- An order can be created and converted to a shipment.
- A carrier can be assigned and rate calculated.
- Tracking events can be added and seen in realtime-enabled queries.
- Documents can be uploaded and linked to a shipment.
- Customer users can see only their own records.
