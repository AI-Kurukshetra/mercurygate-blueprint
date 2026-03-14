export type UserRole = "admin" | "ops" | "customer";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  customer_id: string | null;
  created_at: string;
};

export type Customer = {
  id: string;
  name: string;
  account_code: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  billing_terms: string | null;
  status: string;
  created_at: string;
};

export type Order = {
  id: string;
  customer_id: string;
  order_number: string;
  mode: string;
  commodity: string;
  weight_lb: number;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  pickup_date: string;
  delivery_date: string | null;
  status: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
};

export type Carrier = {
  id: string;
  name: string;
  scac_code: string | null;
  service_area: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  status: string;
  created_at: string;
};

export type Rate = {
  id: string;
  carrier_id: string;
  mode: string;
  origin_region: string;
  destination_region: string;
  base_rate: number;
  rate_per_mile: number;
  is_active: boolean;
  created_at: string;
};

export type Shipment = {
  id: string;
  order_id: string;
  customer_id: string;
  shipment_number: string;
  status: string;
  carrier_id: string | null;
  driver_id: string | null;
  vehicle_id: string | null;
  route_id: string | null;
  rate_amount: number | null;
  distance_miles: number | null;
  transit_days: number | null;
  pickup_eta: string | null;
  delivery_eta: string | null;
  delivered_at: string | null;
  created_at: string;
};

export type TrackingEvent = {
  id: string;
  shipment_id: string;
  event_type: string;
  description: string | null;
  location: string | null;
  event_time: string;
  created_at: string;
};

export type DocumentRecord = {
  id: string;
  customer_id: string;
  shipment_id: string | null;
  order_id: string | null;
  file_name: string;
  file_path: string;
  file_type: string | null;
  uploaded_at: string;
};
