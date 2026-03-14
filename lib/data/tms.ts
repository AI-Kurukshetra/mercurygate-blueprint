import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Carrier,
  Customer,
  DocumentRecord,
  Order,
  Profile,
  Rate,
  Shipment,
  TrackingEvent
} from "@/lib/supabase/types";

export async function getDashboardData() {
  const supabase = createAdminClient();

  const [{ data: shipments }, { data: carriers }, { data: orders }] = await Promise.all([
    supabase.from("shipments").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("carriers").select("*").order("name"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(20)
  ]);

  const safeShipments = (shipments ?? []) as Shipment[];
  const safeCarriers = (carriers ?? []) as Carrier[];
  const safeOrders = (orders ?? []) as Order[];

  const delayed = safeShipments.filter((shipment) => shipment.status === "delayed").length;
  const delivered = safeShipments.filter((shipment) => shipment.status === "delivered").length;
  const revenue = safeShipments.reduce(
    (total, shipment) => total + Number(shipment.rate_amount ?? 0),
    0
  );

  return {
    shipments: safeShipments,
    carriers: safeCarriers,
    orders: safeOrders,
    metrics: {
      activeShipments: safeShipments.filter((shipment) => shipment.status !== "delivered").length,
      deliveredShipments: delivered,
      delayedShipments: delayed,
      totalRevenue: revenue
    }
  };
}

export async function getCustomers() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("customers").select("*").order("name");

  return (data ?? []) as Customer[];
}

export async function getOrders() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });

  return (data ?? []) as Order[];
}

export async function getShipments() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as Shipment[];
}

export async function getCarriers() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("carriers").select("*").order("name");

  return (data ?? []) as Carrier[];
}

export async function getRates() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("rates").select("*").order("created_at", { ascending: false });

  return (data ?? []) as Rate[];
}

export async function getTrackingEvents() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("tracking_events")
    .select("*")
    .order("event_time", { ascending: false })
    .limit(100);

  return (data ?? []) as TrackingEvent[];
}

export async function getDocuments() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("documents")
    .select("*")
    .order("uploaded_at", { ascending: false })
    .limit(50);

  return (data ?? []) as DocumentRecord[];
}

export async function getCustomerPortalData(profile: Profile | null) {
  if (!profile?.customer_id) {
    return {
      orders: [] as Order[],
      shipments: [] as Shipment[],
      documents: [] as DocumentRecord[]
    };
  }

  const supabase = createAdminClient();
  const customerId = profile.customer_id;

  const [{ data: orders }, { data: shipments }, { data: documents }] = await Promise.all([
    supabase.from("orders").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }),
    supabase
      .from("shipments")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false }),
    supabase
      .from("documents")
      .select("*")
      .eq("customer_id", customerId)
      .order("uploaded_at", { ascending: false })
  ]);

  return {
    orders: (orders ?? []) as Order[],
    shipments: (shipments ?? []) as Shipment[],
    documents: (documents ?? []) as DocumentRecord[]
  };
}

export async function getProfiles() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  return (data ?? []) as Profile[];
}
