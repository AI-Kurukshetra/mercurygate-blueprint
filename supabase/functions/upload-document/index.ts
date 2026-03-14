import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import { createServiceClient, jsonResponse } from "../_shared/client.ts";

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return jsonResponse({}, 200);
  }

  const formData = await request.formData();
  const customerId = formData.get("customerId");
  const shipmentId = formData.get("shipmentId");
  const orderId = formData.get("orderId");
  const file = formData.get("file");

  if (
    typeof customerId !== "string" ||
    typeof shipmentId !== "string" ||
    !(file instanceof File)
  ) {
    return jsonResponse({ error: "Invalid document payload." }, 400);
  }

  const supabase = createServiceClient();
  const fileExt = file.name.split(".").pop() ?? "bin";
  const path = `${customerId}/${shipmentId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("shipment-documents")
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError) {
    return jsonResponse({ error: uploadError.message }, 400);
  }

  const { error } = await supabase.from("documents").insert({
    customer_id: customerId,
    shipment_id: shipmentId,
    order_id: typeof orderId === "string" && orderId ? orderId : null,
    file_name: file.name,
    file_path: path,
    file_type: file.type || null
  });

  if (error) {
    return jsonResponse({ error: error.message }, 400);
  }

  return jsonResponse({ success: true, path });
});

