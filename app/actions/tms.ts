"use server";

import { revalidatePath } from "next/cache";

import { getRouteSuggestion } from "@/lib/route-optimizer";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  assignCarrierSchema,
  carrierSchema,
  customerSchema,
  orderSchema,
  rateSchema,
  shipmentSchema,
  trackingSchema,
  userAccessSchema
} from "@/lib/validations/tms";

type ActionResult = {
  success: boolean;
  message: string;
};

function makeOrderNumber() {
  return `ORD-${Date.now()}`;
}

function makeShipmentNumber() {
  return `SHP-${Date.now()}`;
}

export async function createCustomer(input: unknown): Promise<ActionResult> {
  const payload = customerSchema.safeParse(input);

  if (!payload.success) {
    return { success: false, message: "Invalid customer payload." };
  }

  const db = createAdminClient();
  const { error } = await db.from("customers").insert({
    name: payload.data.name,
    account_code: payload.data.accountCode,
    contact_name: payload.data.contactName,
    contact_email: payload.data.contactEmail,
    contact_phone: payload.data.contactPhone,
    billing_terms: payload.data.billingTerms,
    status: "active"
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/orders");

  return { success: true, message: "Customer created." };
}

export async function createOrder(input: unknown): Promise<ActionResult> {
  const payload = orderSchema.safeParse(input);

  if (!payload.success) {
    return { success: false, message: "Invalid order payload." };
  }

  const authClient = await createClient();
  const db = createAdminClient();
  const {
    data: { user }
  } = await authClient.auth.getUser();

  const { error } = await db.from("orders").insert({
    customer_id: payload.data.customerId,
    order_number: makeOrderNumber(),
    mode: payload.data.mode,
    commodity: payload.data.commodity,
    weight_lb: payload.data.weightLb,
    origin_city: payload.data.originCity,
    origin_state: payload.data.originState,
    destination_city: payload.data.destinationCity,
    destination_state: payload.data.destinationState,
    pickup_date: payload.data.pickupDate,
    delivery_date: payload.data.deliveryDate || null,
    notes: payload.data.notes || null,
    status: "planned",
    created_by: user?.id ?? null
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/orders");
  revalidatePath("/dashboard");

  return { success: true, message: "Order created." };
}

export async function createShipment(input: unknown): Promise<ActionResult> {
  const payload = shipmentSchema.safeParse(input);

  if (!payload.success) {
    return { success: false, message: "Invalid shipment payload." };
  }

  const db = createAdminClient();
  const { data: order, error: orderError } = await db
    .from("orders")
    .select("*")
    .eq("id", payload.data.orderId)
    .single();

  if (orderError || !order) {
    return { success: false, message: "Order not found." };
  }

  const route = getRouteSuggestion({
    originCity: order.origin_city,
    originState: order.origin_state,
    destinationCity: order.destination_city,
    destinationState: order.destination_state
  });

  const { data: routeData, error: routeError } = await db
    .from("routes")
    .insert({
      customer_id: payload.data.customerId,
      lane: route.lane,
      origin_city: order.origin_city,
      origin_state: order.origin_state,
      destination_city: order.destination_city,
      destination_state: order.destination_state,
      estimated_miles: route.estimatedMiles,
      estimated_transit_days: route.estimatedTransitDays
    })
    .select("id")
    .single();

  if (routeError || !routeData) {
    return { success: false, message: routeError?.message ?? "Unable to create route." };
  }

  const { error } = await db.from("shipments").insert({
    order_id: payload.data.orderId,
    customer_id: payload.data.customerId,
    shipment_number: makeShipmentNumber(),
    status: "planned",
    route_id: routeData.id,
    distance_miles: route.estimatedMiles,
    transit_days: route.estimatedTransitDays,
    pickup_eta: payload.data.pickupEta || null,
    delivery_eta: payload.data.deliveryEta || null
  });

  if (error) {
    return { success: false, message: error.message };
  }

  await db.from("orders").update({ status: "shipped" }).eq("id", payload.data.orderId);

  revalidatePath("/shipments");
  revalidatePath("/dashboard");
  revalidatePath("/tracking");

  return { success: true, message: "Shipment created." };
}

export async function calculateRate(input: { shipmentId: string; carrierId: string }) {
  const db = createAdminClient();
  const { data: shipment } = await db
    .from("shipments")
    .select("distance_miles, order:orders(mode)")
    .eq("id", input.shipmentId)
    .single();

  const shipmentRecord = shipment as
    | {
        distance_miles: number | null;
        order?: { mode: string } | Array<{ mode: string }> | null;
      }
    | null;
  const orderData = shipmentRecord?.order;
  const mode = Array.isArray(orderData) ? orderData[0]?.mode : orderData?.mode;
  const distanceMiles = Number(shipmentRecord?.distance_miles ?? 0);

  const { data: rate } = await db
    .from("rates")
    .select("*")
    .eq("carrier_id", input.carrierId)
    .eq("mode", mode)
    .eq("is_active", true)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  if (!rate) {
    return {
      success: false,
      message: "No active rate found for that carrier and mode.",
      amount: 0
    };
  }

  const amount = Number(rate.base_rate ?? 0) + distanceMiles * Number(rate.rate_per_mile ?? 0);

  await db.from("shipments").update({ rate_amount: amount }).eq("id", input.shipmentId);

  return {
    success: true,
    message: "Rate calculated.",
    amount
  };
}

export async function assignCarrier(input: unknown): Promise<ActionResult> {
  const payload = assignCarrierSchema.safeParse(input);

  if (!payload.success) {
    return { success: false, message: "Invalid carrier assignment payload." };
  }

  const db = createAdminClient();
  const rateResult = await calculateRate(payload.data);

  const { error } = await db
    .from("shipments")
    .update({
      carrier_id: payload.data.carrierId,
      status: "in_transit"
    })
    .eq("id", payload.data.shipmentId);

  if (error) {
    return { success: false, message: error.message };
  }

  await db.from("tracking_events").insert({
    shipment_id: payload.data.shipmentId,
    event_type: "picked_up",
    description: "Carrier assigned and pickup confirmed.",
    event_time: new Date().toISOString()
  });

  revalidatePath("/shipments");
  revalidatePath("/tracking");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: rateResult.success
      ? `Carrier assigned. ${rateResult.message}`
      : "Carrier assigned, but no rate was calculated."
  };
}

export async function createCarrier(input: unknown): Promise<ActionResult> {
  const payload = carrierSchema.safeParse(input);

  if (!payload.success) {
    return { success: false, message: "Invalid carrier payload." };
  }

  const db = createAdminClient();
  const { error } = await db.from("carriers").insert({
    name: payload.data.name,
    scac_code: payload.data.scacCode || null,
    service_area: payload.data.serviceArea,
    contact_name: payload.data.contactName,
    contact_email: payload.data.contactEmail,
    contact_phone: payload.data.contactPhone,
    status: "active"
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/carriers");
  revalidatePath("/dashboard");

  return { success: true, message: "Carrier added." };
}

export async function createRate(input: unknown): Promise<ActionResult> {
  const payload = rateSchema.safeParse(input);

  if (!payload.success) {
    return { success: false, message: "Invalid rate payload." };
  }

  const db = createAdminClient();
  const { error } = await db.from("rates").insert({
    carrier_id: payload.data.carrierId,
    mode: payload.data.mode,
    origin_region: payload.data.originRegion,
    destination_region: payload.data.destinationRegion,
    base_rate: payload.data.baseRate,
    rate_per_mile: payload.data.ratePerMile,
    is_active: true
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/carriers");
  revalidatePath("/shipments");

  return { success: true, message: "Rate card added." };
}

export async function trackShipment(input: unknown): Promise<ActionResult> {
  const payload = trackingSchema.safeParse(input);

  if (!payload.success) {
    return { success: false, message: "Invalid tracking payload." };
  }

  const db = createAdminClient();
  const { error } = await db.from("tracking_events").insert({
    shipment_id: payload.data.shipmentId,
    event_type: payload.data.eventType,
    description: payload.data.description || null,
    location: payload.data.location || null,
    event_time: new Date().toISOString()
  });

  if (error) {
    return { success: false, message: error.message };
  }

  const shipmentStatus =
    payload.data.eventType === "delivered"
      ? "delivered"
      : payload.data.eventType === "delayed"
        ? "delayed"
        : "in_transit";

  await db
    .from("shipments")
    .update({
      status: shipmentStatus,
      delivered_at: payload.data.eventType === "delivered" ? new Date().toISOString() : null
    })
    .eq("id", payload.data.shipmentId);

  revalidatePath("/tracking");
  revalidatePath("/shipments");
  revalidatePath("/dashboard");
  revalidatePath("/customer-portal");

  return { success: true, message: "Tracking event recorded." };
}

export async function uploadDocument(formData: FormData): Promise<ActionResult> {
  const shipmentIdValue = formData.get("shipmentId");
  const customerIdValue = formData.get("customerId");
  const orderIdValue = formData.get("orderId");
  const fileEntry = formData.get("file");

  if (
    typeof shipmentIdValue !== "string" ||
    typeof customerIdValue !== "string" ||
    !(fileEntry instanceof File)
  ) {
    return { success: false, message: "Invalid document upload payload." };
  }

  const fileExt = fileEntry.name.split(".").pop() ?? "bin";
  const filePath = `${customerIdValue}/${shipmentIdValue}/${Date.now()}.${fileExt}`;
  const adminClient = createAdminClient();

  const { error: uploadError } = await adminClient.storage
    .from("shipment-documents")
    .upload(filePath, fileEntry, {
      contentType: fileEntry.type,
      upsert: true
    });

  if (uploadError) {
    return { success: false, message: uploadError.message };
  }

  const { error } = await adminClient.from("documents").insert({
    customer_id: customerIdValue,
    shipment_id: shipmentIdValue,
    order_id: typeof orderIdValue === "string" && orderIdValue ? orderIdValue : null,
    file_name: fileEntry.name,
    file_path: filePath,
    file_type: fileEntry.type || null
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/shipments");
  revalidatePath("/customer-portal");

  return { success: true, message: "Document uploaded." };
}

export async function updateUserAccess(input: unknown): Promise<ActionResult> {
  const payload = userAccessSchema.safeParse(input);

  if (!payload.success) {
    return { success: false, message: "Invalid user access payload." };
  }

  const authClient = await createClient();
  const db = createAdminClient();
  const {
    data: { user }
  } = await authClient.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized." };
  }

  const { data: actorProfile } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<{ role: "admin" | "ops" | "customer" }>();

  if (actorProfile?.role !== "admin") {
    return { success: false, message: "Only admins can manage user access." };
  }

  const { error } = await db
    .from("profiles")
    .update({
      role: payload.data.role,
      customer_id: payload.data.role === "customer" ? payload.data.customerId : null
    })
    .eq("id", payload.data.profileId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/users");
  revalidatePath("/dashboard");
  revalidatePath("/customer-portal");

  return { success: true, message: "User access updated." };
}
