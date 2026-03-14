import fs from "node:fs";

function readEnv(path) {
  const out = {};
  const text = fs.readFileSync(path, "utf8");

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }

    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if (value.startsWith("\"") && value.endsWith("\"")) {
      value = value.slice(1, -1);
    }

    out[key] = value;
  }

  return out;
}

const env = readEnv(".env.local");
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
}

async function api(path, { method = "GET", body, headers = {} } = {}) {
  const response = await fetch(`${supabaseUrl}${path}`, {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status} ${path}`);
    error.details = data;
    throw error;
  }

  return data;
}

async function upsert(table, rows) {
  if (!rows.length) {
    return [];
  }

  return api(`/rest/v1/${table}`, {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: rows
  });
}

async function getProfilesByEmail() {
  const profiles = await api("/rest/v1/profiles?select=id,email,role,customer_id");
  return new Map(profiles.map((profile) => [String(profile.email || "").toLowerCase(), profile]));
}

async function main() {
  const customers = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Acme Retail",
      account_code: "ACME-HACK",
      contact_name: "Jordan Miles",
      contact_email: "ops@acme.com",
      contact_phone: "555-0101",
      billing_terms: "Net 30",
      status: "active"
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Northwind Foods",
      account_code: "NWFD-HACK",
      contact_name: "Avery Stone",
      contact_email: "dispatch@northwind.com",
      contact_phone: "555-0202",
      billing_terms: "Net 15",
      status: "active"
    },
    {
      id: "99999999-9999-9999-9999-999999999999",
      name: "Demo Customer",
      account_code: "DEMO-HACK",
      contact_name: "Demo Contact",
      contact_email: "demo.customer@gmail.com",
      contact_phone: "555-0000",
      billing_terms: "Net 30",
      status: "active"
    }
  ];

  const carriers = [
    {
      id: "33333333-3333-3333-3333-333333333333",
      name: "BlueRoute Logistics",
      scac_code: "BLRT",
      service_area: "West Coast + Texas",
      contact_name: "Priya Shah",
      contact_email: "carrier@blueroute.com",
      contact_phone: "555-0303",
      status: "active"
    },
    {
      id: "44444444-4444-4444-4444-444444444444",
      name: "Summit Freight",
      scac_code: "SMFT",
      service_area: "Midwest + Southeast",
      contact_name: "Leo Carter",
      contact_email: "ops@summitfreight.com",
      contact_phone: "555-0404",
      status: "active"
    }
  ];

  const drivers = [
    {
      id: "55555555-5555-5555-5555-555555555551",
      carrier_id: "33333333-3333-3333-3333-333333333333",
      full_name: "Rafael Diaz",
      phone: "555-2011",
      license_number: "CA-DL-1001",
      status: "active"
    },
    {
      id: "55555555-5555-5555-5555-555555555552",
      carrier_id: "44444444-4444-4444-4444-444444444444",
      full_name: "Nina Cole",
      phone: "555-2012",
      license_number: "IL-DL-1002",
      status: "active"
    }
  ];

  const vehicles = [
    {
      id: "66666666-6666-6666-6666-666666666661",
      carrier_id: "33333333-3333-3333-3333-333333333333",
      vehicle_number: "BL-TRK-01",
      vehicle_type: "53ft Dry Van",
      capacity_lb: 44000,
      status: "active"
    },
    {
      id: "66666666-6666-6666-6666-666666666662",
      carrier_id: "44444444-4444-4444-4444-444444444444",
      vehicle_number: "SF-TRK-08",
      vehicle_type: "Reefer",
      capacity_lb: 42000,
      status: "active"
    }
  ];

  const routes = [
    {
      id: "77777777-7777-7777-7777-777777777771",
      customer_id: "11111111-1111-1111-1111-111111111111",
      lane: "Los Angeles, CA -> Dallas, TX",
      origin_city: "Los Angeles",
      origin_state: "CA",
      destination_city: "Dallas",
      destination_state: "TX",
      estimated_miles: 1500,
      estimated_transit_days: 3
    },
    {
      id: "77777777-7777-7777-7777-777777777772",
      customer_id: "22222222-2222-2222-2222-222222222222",
      lane: "Chicago, IL -> Atlanta, GA",
      origin_city: "Chicago",
      origin_state: "IL",
      destination_city: "Atlanta",
      destination_state: "GA",
      estimated_miles: 720,
      estimated_transit_days: 2
    },
    {
      id: "77777777-7777-7777-7777-777777777773",
      customer_id: "99999999-9999-9999-9999-999999999999",
      lane: "Seattle, WA -> San Diego, CA",
      origin_city: "Seattle",
      origin_state: "WA",
      destination_city: "San Diego",
      destination_state: "CA",
      estimated_miles: 980,
      estimated_transit_days: 2
    }
  ];

  const rates = [
    {
      id: "88888888-8888-8888-8888-888888888881",
      carrier_id: "33333333-3333-3333-3333-333333333333",
      mode: "FTL",
      origin_region: "CA",
      destination_region: "TX",
      base_rate: 450,
      rate_per_mile: 2.25,
      is_active: true
    },
    {
      id: "88888888-8888-8888-8888-888888888882",
      carrier_id: "44444444-4444-4444-4444-444444444444",
      mode: "LTL",
      origin_region: "IL",
      destination_region: "GA",
      base_rate: 200,
      rate_per_mile: 1.35,
      is_active: true
    },
    {
      id: "88888888-8888-8888-8888-888888888883",
      carrier_id: "33333333-3333-3333-3333-333333333333",
      mode: "FTL",
      origin_region: "WA",
      destination_region: "CA",
      base_rate: 320,
      rate_per_mile: 1.9,
      is_active: true
    }
  ];

  const today = new Date();
  const plusDays = (days) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const plusHours = (hours) => new Date(today.getTime() + hours * 3600000).toISOString();

  const profilesByEmail = await getProfilesByEmail();
  const opsProfile =
    profilesByEmail.get("ops.demo.tms@gmail.com") || profilesByEmail.get("pranav.dodiya@bacancy.com");
  const customerProfile = profilesByEmail.get("customer.demo.tms@gmail.com");

  const baseOrders = [
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
      customer_id: "11111111-1111-1111-1111-111111111111",
      order_number: "ORD-HACK-1001",
      mode: "FTL",
      commodity: "Consumer Electronics",
      weight_lb: 18000,
      origin_city: "Los Angeles",
      origin_state: "CA",
      destination_city: "Dallas",
      destination_state: "TX",
      pickup_date: plusDays(-2),
      delivery_date: plusDays(1),
      status: "shipped",
      notes: "Priority retail replenishment",
      created_by: opsProfile?.id || null
    },
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
      customer_id: "22222222-2222-2222-2222-222222222222",
      order_number: "ORD-HACK-1002",
      mode: "LTL",
      commodity: "Chilled Produce",
      weight_lb: 9000,
      origin_city: "Chicago",
      origin_state: "IL",
      destination_city: "Atlanta",
      destination_state: "GA",
      pickup_date: plusDays(-1),
      delivery_date: plusDays(1),
      status: "shipped",
      notes: "Temperature sensitive cargo",
      created_by: opsProfile?.id || null
    },
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
      customer_id: "99999999-9999-9999-9999-999999999999",
      order_number: "ORD-HACK-1003",
      mode: "FTL",
      commodity: "Furniture",
      weight_lb: 14000,
      origin_city: "Seattle",
      origin_state: "WA",
      destination_city: "San Diego",
      destination_state: "CA",
      pickup_date: plusDays(0),
      delivery_date: plusDays(2),
      status: "planned",
      notes: "Store launch inventory",
      created_by: opsProfile?.id || null
    }
  ];

  const extraOrders = [
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4",
      customer_id: "11111111-1111-1111-1111-111111111111",
      order_number: "ORD-HACK-1004",
      mode: "FTL",
      commodity: "Home Appliances",
      weight_lb: 16000,
      origin_city: "San Jose",
      origin_state: "CA",
      destination_city: "Austin",
      destination_state: "TX",
      pickup_date: plusDays(-3),
      delivery_date: plusDays(-1),
      status: "delivered",
      notes: "Back-to-school replenishment",
      created_by: opsProfile?.id || null
    },
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5",
      customer_id: "22222222-2222-2222-2222-222222222222",
      order_number: "ORD-HACK-1005",
      mode: "LTL",
      commodity: "Frozen Goods",
      weight_lb: 7600,
      origin_city: "Milwaukee",
      origin_state: "WI",
      destination_city: "Nashville",
      destination_state: "TN",
      pickup_date: plusDays(-2),
      delivery_date: plusDays(0),
      status: "shipped",
      notes: "Cold-chain lane",
      created_by: opsProfile?.id || null
    },
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6",
      customer_id: "99999999-9999-9999-9999-999999999999",
      order_number: "ORD-HACK-1006",
      mode: "FTL",
      commodity: "Office Furniture",
      weight_lb: 11000,
      origin_city: "Tacoma",
      origin_state: "WA",
      destination_city: "Los Angeles",
      destination_state: "CA",
      pickup_date: plusDays(1),
      delivery_date: plusDays(3),
      status: "planned",
      notes: "New branch setup",
      created_by: opsProfile?.id || null
    },
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7",
      customer_id: "11111111-1111-1111-1111-111111111111",
      order_number: "ORD-HACK-1007",
      mode: "FTL",
      commodity: "Consumer Electronics",
      weight_lb: 15000,
      origin_city: "Ontario",
      origin_state: "CA",
      destination_city: "Houston",
      destination_state: "TX",
      pickup_date: plusDays(-1),
      delivery_date: plusDays(2),
      status: "shipped",
      notes: "High-value shipment",
      created_by: opsProfile?.id || null
    },
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8",
      customer_id: "22222222-2222-2222-2222-222222222222",
      order_number: "ORD-HACK-1008",
      mode: "LTL",
      commodity: "Packaged Foods",
      weight_lb: 6400,
      origin_city: "Columbus",
      origin_state: "OH",
      destination_city: "Charlotte",
      destination_state: "NC",
      pickup_date: plusDays(-4),
      delivery_date: plusDays(-2),
      status: "delivered",
      notes: "Regional DC transfer",
      created_by: opsProfile?.id || null
    },
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9",
      customer_id: "99999999-9999-9999-9999-999999999999",
      order_number: "ORD-HACK-1009",
      mode: "FTL",
      commodity: "Fitness Equipment",
      weight_lb: 13800,
      origin_city: "Portland",
      origin_state: "OR",
      destination_city: "Phoenix",
      destination_state: "AZ",
      pickup_date: plusDays(-1),
      delivery_date: plusDays(1),
      status: "shipped",
      notes: "Direct-to-store replenishment",
      created_by: opsProfile?.id || null
    },
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      customer_id: "11111111-1111-1111-1111-111111111111",
      order_number: "ORD-HACK-1010",
      mode: "FTL",
      commodity: "Home Decor",
      weight_lb: 9800,
      origin_city: "Fresno",
      origin_state: "CA",
      destination_city: "San Antonio",
      destination_state: "TX",
      pickup_date: plusDays(0),
      delivery_date: plusDays(2),
      status: "planned",
      notes: "Weekend launch shipment",
      created_by: opsProfile?.id || null
    },
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab",
      customer_id: "22222222-2222-2222-2222-222222222222",
      order_number: "ORD-HACK-1011",
      mode: "LTL",
      commodity: "Beverages",
      weight_lb: 8200,
      origin_city: "Detroit",
      origin_state: "MI",
      destination_city: "Orlando",
      destination_state: "FL",
      pickup_date: plusDays(-2),
      delivery_date: plusDays(1),
      status: "shipped",
      notes: "Promotional inventory",
      created_by: opsProfile?.id || null
    }
  ];

  const orders = [...baseOrders, ...extraOrders];

  const baseShipments = [
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
      customer_id: "11111111-1111-1111-1111-111111111111",
      shipment_number: "SHP-HACK-2001",
      status: "in_transit",
      carrier_id: "33333333-3333-3333-3333-333333333333",
      driver_id: "55555555-5555-5555-5555-555555555551",
      vehicle_id: "66666666-6666-6666-6666-666666666661",
      route_id: "77777777-7777-7777-7777-777777777771",
      rate_amount: 3825,
      distance_miles: 1500,
      transit_days: 3,
      pickup_eta: plusHours(-24),
      delivery_eta: plusHours(24),
      delivered_at: null
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
      customer_id: "22222222-2222-2222-2222-222222222222",
      shipment_number: "SHP-HACK-2002",
      status: "delivered",
      carrier_id: "44444444-4444-4444-4444-444444444444",
      driver_id: "55555555-5555-5555-5555-555555555552",
      vehicle_id: "66666666-6666-6666-6666-666666666662",
      rate_amount: 1172,
      distance_miles: 720,
      transit_days: 2,
      pickup_eta: plusHours(-72),
      delivery_eta: plusHours(-24),
      delivered_at: plusHours(-24)
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
      customer_id: "99999999-9999-9999-9999-999999999999",
      shipment_number: "SHP-HACK-2003",
      status: "planned",
      carrier_id: null,
      driver_id: null,
      vehicle_id: null,
      route_id: "77777777-7777-7777-7777-777777777773",
      rate_amount: 0,
      distance_miles: 980,
      transit_days: 2,
      pickup_eta: plusHours(4),
      delivery_eta: plusHours(48),
      delivered_at: null
    }
  ];

  const extraShipments = [
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4",
      customer_id: "11111111-1111-1111-1111-111111111111",
      shipment_number: "SHP-HACK-2004",
      status: "delivered",
      carrier_id: "33333333-3333-3333-3333-333333333333",
      driver_id: "55555555-5555-5555-5555-555555555551",
      vehicle_id: "66666666-6666-6666-6666-666666666661",
      route_id: "77777777-7777-7777-7777-777777777771",
      rate_amount: 3520,
      distance_miles: 1400,
      transit_days: 3,
      pickup_eta: plusHours(-96),
      delivery_eta: plusHours(-48),
      delivered_at: plusHours(-48)
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5",
      customer_id: "22222222-2222-2222-2222-222222222222",
      shipment_number: "SHP-HACK-2005",
      status: "in_transit",
      carrier_id: "44444444-4444-4444-4444-444444444444",
      driver_id: "55555555-5555-5555-5555-555555555552",
      vehicle_id: "66666666-6666-6666-6666-666666666662",
      route_id: "77777777-7777-7777-7777-777777777772",
      rate_amount: 1180,
      distance_miles: 730,
      transit_days: 2,
      pickup_eta: plusHours(-20),
      delivery_eta: plusHours(18),
      delivered_at: null
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6",
      customer_id: "99999999-9999-9999-9999-999999999999",
      shipment_number: "SHP-HACK-2006",
      status: "planned",
      carrier_id: null,
      driver_id: null,
      vehicle_id: null,
      route_id: "77777777-7777-7777-7777-777777777773",
      rate_amount: 0,
      distance_miles: 980,
      transit_days: 2,
      pickup_eta: plusHours(30),
      delivery_eta: plusHours(78),
      delivered_at: null
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb7",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7",
      customer_id: "11111111-1111-1111-1111-111111111111",
      shipment_number: "SHP-HACK-2007",
      status: "delayed",
      carrier_id: "33333333-3333-3333-3333-333333333333",
      driver_id: "55555555-5555-5555-5555-555555555551",
      vehicle_id: "66666666-6666-6666-6666-666666666661",
      route_id: "77777777-7777-7777-7777-777777777771",
      rate_amount: 3675,
      distance_miles: 1480,
      transit_days: 3,
      pickup_eta: plusHours(-26),
      delivery_eta: plusHours(10),
      delivered_at: null
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8",
      customer_id: "22222222-2222-2222-2222-222222222222",
      shipment_number: "SHP-HACK-2008",
      status: "delivered",
      carrier_id: "44444444-4444-4444-4444-444444444444",
      driver_id: "55555555-5555-5555-5555-555555555552",
      vehicle_id: "66666666-6666-6666-6666-666666666662",
      route_id: "77777777-7777-7777-7777-777777777772",
      rate_amount: 1035,
      distance_miles: 690,
      transit_days: 2,
      pickup_eta: plusHours(-120),
      delivery_eta: plusHours(-74),
      delivered_at: plusHours(-74)
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb9",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9",
      customer_id: "99999999-9999-9999-9999-999999999999",
      shipment_number: "SHP-HACK-2009",
      status: "in_transit",
      carrier_id: "33333333-3333-3333-3333-333333333333",
      driver_id: "55555555-5555-5555-5555-555555555551",
      vehicle_id: "66666666-6666-6666-6666-666666666661",
      route_id: "77777777-7777-7777-7777-777777777773",
      rate_amount: 2180,
      distance_miles: 980,
      transit_days: 2,
      pickup_eta: plusHours(-12),
      delivery_eta: plusHours(24),
      delivered_at: null
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbba",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      customer_id: "11111111-1111-1111-1111-111111111111",
      shipment_number: "SHP-HACK-2010",
      status: "planned",
      carrier_id: null,
      driver_id: null,
      vehicle_id: null,
      route_id: "77777777-7777-7777-7777-777777777771",
      rate_amount: 0,
      distance_miles: 1320,
      transit_days: 3,
      pickup_eta: plusHours(16),
      delivery_eta: plusHours(68),
      delivered_at: null
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab",
      customer_id: "22222222-2222-2222-2222-222222222222",
      shipment_number: "SHP-HACK-2011",
      status: "in_transit",
      carrier_id: "44444444-4444-4444-4444-444444444444",
      driver_id: "55555555-5555-5555-5555-555555555552",
      vehicle_id: "66666666-6666-6666-6666-666666666662",
      route_id: "77777777-7777-7777-7777-777777777772",
      rate_amount: 1210,
      distance_miles: 760,
      transit_days: 2,
      pickup_eta: plusHours(-15),
      delivery_eta: plusHours(28),
      delivered_at: null
    }
  ];

  const shipments = [...baseShipments, ...extraShipments];

  const baseTrackingEvents = [
    {
      id: "cccccccc-cccc-cccc-cccc-ccccccccccc1",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1",
      event_type: "picked_up",
      description: "Pickup confirmed at origin warehouse",
      location: "Los Angeles, CA",
      event_time: plusHours(-22)
    },
    {
      id: "cccccccc-cccc-cccc-cccc-ccccccccccc2",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1",
      event_type: "in_transit",
      description: "Shipment moving through regional hub",
      location: "Albuquerque, NM",
      event_time: plusHours(-8)
    },
    {
      id: "cccccccc-cccc-cccc-cccc-ccccccccccc3",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2",
      event_type: "delivered",
      description: "Proof of delivery received",
      location: "Atlanta, GA",
      event_time: plusHours(-24)
    }
  ];

  const extraTrackingEvents = [
    {
      id: "cccccccc-cccc-cccc-cccc-ccccccccccc4",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4",
      event_type: "delivered",
      description: "Delivered with signed POD",
      location: "Austin, TX",
      event_time: plusHours(-48)
    },
    {
      id: "cccccccc-cccc-cccc-cccc-ccccccccccc5",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5",
      event_type: "in_transit",
      description: "Linehaul in progress",
      location: "Louisville, KY",
      event_time: plusHours(-6)
    },
    {
      id: "cccccccc-cccc-cccc-cccc-ccccccccccc6",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb7",
      event_type: "delayed",
      description: "Weather delay on route",
      location: "El Paso, TX",
      event_time: plusHours(-3)
    },
    {
      id: "cccccccc-cccc-cccc-cccc-ccccccccccc7",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8",
      event_type: "delivered",
      description: "Delivery confirmed by receiver",
      location: "Charlotte, NC",
      event_time: plusHours(-74)
    },
    {
      id: "cccccccc-cccc-cccc-cccc-ccccccccccc8",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb9",
      event_type: "picked_up",
      description: "Pickup complete",
      location: "Portland, OR",
      event_time: plusHours(-12)
    },
    {
      id: "cccccccc-cccc-cccc-cccc-ccccccccccc9",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb9",
      event_type: "in_transit",
      description: "Passing through regional checkpoint",
      location: "Sacramento, CA",
      event_time: plusHours(-2)
    },
    {
      id: "cccccccc-cccc-cccc-cccc-ccccccccccca",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      event_type: "in_transit",
      description: "Shipment progressing on schedule",
      location: "Atlanta, GA",
      event_time: plusHours(-1)
    }
  ];

  const trackingEvents = [...baseTrackingEvents, ...extraTrackingEvents];

  const baseDocuments = [
    {
      id: "dddddddd-dddd-dddd-dddd-ddddddddddd1",
      customer_id: "11111111-1111-1111-1111-111111111111",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
      file_name: "BOL-SHP-HACK-2001.pdf",
      file_path: "11111111-1111-1111-1111-111111111111/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1/bol-hack-2001.pdf",
      file_type: "application/pdf",
      uploaded_by: opsProfile?.id || null
    },
    {
      id: "dddddddd-dddd-dddd-dddd-ddddddddddd2",
      customer_id: "22222222-2222-2222-2222-222222222222",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
      file_name: "POD-SHP-HACK-2002.pdf",
      file_path: "22222222-2222-2222-2222-222222222222/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2/pod-hack-2002.pdf",
      file_type: "application/pdf",
      uploaded_by: opsProfile?.id || null
    }
  ];

  const extraDocuments = [
    {
      id: "dddddddd-dddd-dddd-dddd-ddddddddddd3",
      customer_id: "11111111-1111-1111-1111-111111111111",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4",
      file_name: "POD-SHP-HACK-2004.pdf",
      file_path: "11111111-1111-1111-1111-111111111111/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4/pod-hack-2004.pdf",
      file_type: "application/pdf",
      uploaded_by: opsProfile?.id || null
    },
    {
      id: "dddddddd-dddd-dddd-dddd-ddddddddddd4",
      customer_id: "22222222-2222-2222-2222-222222222222",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5",
      order_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5",
      file_name: "BOL-SHP-HACK-2005.pdf",
      file_path: "22222222-2222-2222-2222-222222222222/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5/bol-hack-2005.pdf",
      file_type: "application/pdf",
      uploaded_by: opsProfile?.id || null
    }
  ];

  const documents = [...baseDocuments, ...extraDocuments];

  const baseInvoices = [
    {
      id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1",
      customer_id: "11111111-1111-1111-1111-111111111111",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1",
      invoice_number: "INV-HACK-3001",
      amount: 3825,
      status: "sent",
      due_date: plusDays(10)
    },
    {
      id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2",
      customer_id: "22222222-2222-2222-2222-222222222222",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2",
      invoice_number: "INV-HACK-3002",
      amount: 1172,
      status: "paid",
      due_date: plusDays(-2)
    }
  ];

  const extraInvoices = [
    {
      id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3",
      customer_id: "11111111-1111-1111-1111-111111111111",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4",
      invoice_number: "INV-HACK-3003",
      amount: 3520,
      status: "paid",
      due_date: plusDays(-1)
    },
    {
      id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee4",
      customer_id: "22222222-2222-2222-2222-222222222222",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5",
      invoice_number: "INV-HACK-3004",
      amount: 1180,
      status: "sent",
      due_date: plusDays(12)
    },
    {
      id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee5",
      customer_id: "99999999-9999-9999-9999-999999999999",
      shipment_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb9",
      invoice_number: "INV-HACK-3005",
      amount: 2180,
      status: "draft",
      due_date: plusDays(15)
    }
  ];

  const invoices = [...baseInvoices, ...extraInvoices];

  await upsert("customers", customers);
  await upsert("carriers", carriers);
  await upsert("drivers", drivers);
  await upsert("vehicles", vehicles);
  await upsert("routes", routes);
  await upsert("rates", rates);
  await upsert("orders", orders);
  await upsert("shipments", shipments);
  await upsert("tracking_events", trackingEvents);
  await upsert("documents", documents);
  await upsert("invoices", invoices);

  if (customerProfile?.id) {
    await api(`/rest/v1/profiles?id=eq.${encodeURIComponent(customerProfile.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: { role: "customer", customer_id: "99999999-9999-9999-9999-999999999999" }
    });
  }

  const [summaryCustomers, summaryOrders, summaryShipments, summaryTracking] = await Promise.all([
    api("/rest/v1/customers?select=id"),
    api("/rest/v1/orders?select=id"),
    api("/rest/v1/shipments?select=id,status"),
    api("/rest/v1/tracking_events?select=id")
  ]);

  console.log(
    JSON.stringify(
      {
        status: "ok",
        seeded: {
          customers: summaryCustomers.length,
          orders: summaryOrders.length,
          shipments: summaryShipments.length,
          tracking_events: summaryTracking.length
        }
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error.message);
  if (error.details) {
    console.error(JSON.stringify(error.details, null, 2));
  }
  process.exit(1);
});
