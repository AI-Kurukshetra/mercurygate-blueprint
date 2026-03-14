import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import { createServiceClient, jsonResponse } from "../_shared/client.ts";

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return jsonResponse({}, 200);
  }

  const payload = await request.json();
  const supabase = createServiceClient();

  const { data: shipment } = await supabase
    .from("shipments")
    .select("distance_miles, order:orders(mode)")
    .eq("id", payload.shipmentId)
    .single();

  const { data: rate } = await supabase
    .from("rates")
    .select("*")
    .eq("carrier_id", payload.carrierId)
    .eq("mode", shipment?.order?.mode)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (!rate) {
    return jsonResponse({ error: "No active rate found." }, 404);
  }

  const amount = Number(rate.base_rate ?? 0) + Number(shipment?.distance_miles ?? 0) * Number(rate.rate_per_mile ?? 0);

  await supabase.from("shipments").update({ rate_amount: amount }).eq("id", payload.shipmentId);

  return jsonResponse({ amount });
});

