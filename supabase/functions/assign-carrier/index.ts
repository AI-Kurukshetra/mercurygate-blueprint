import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import { createServiceClient, jsonResponse } from "../_shared/client.ts";

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return jsonResponse({}, 200);
  }

  const payload = await request.json();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("shipments")
    .update({ carrier_id: payload.carrierId, status: "in_transit" })
    .eq("id", payload.shipmentId);

  if (error) {
    return jsonResponse({ error: error.message }, 400);
  }

  return jsonResponse({ success: true });
});

