# Demo Flow

## Demo Sequence

### 1. User Login

- Sign in as `ops@mercurylite.com`
- Land on `/dashboard`
- Highlight KPI cards and recent shipment visibility

### 2. Create Order

- Open `/customers` and confirm a customer exists
- Open `/orders`
- Create a new order with lane, mode, weight, and dates
- Show the order in the order queue

### 3. Create Shipment

- Open `/shipments`
- Convert the order into a shipment
- Explain that a basic route suggestion is generated from the lane

### 4. Assign Carrier

- Use the carrier assignment form
- Show that the shipment status changes to `in_transit`
- Mention that the rate is calculated from the active rate card

### 5. Track Shipment

- Open `/tracking`
- Add `picked_up`, `in_transit`, and `delivered` events
- Show the realtime timeline updating

### 6. Upload Documents

- Return to `/shipments`
- Upload a BOL or POD file
- Explain the split between Storage file object and Postgres metadata

### 7. Delivery Completed

- Go to `/reports` and show delivered status counts
- Switch to a customer user and open `/customer-portal`
- Show customer-scoped visibility for orders, shipments, and documents
