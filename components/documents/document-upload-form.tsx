"use client";

import { useState } from "react";

import { uploadDocument } from "@/app/actions/tms";
import { Button, Input, Select } from "@/components/ui/primitives";
import type { Shipment } from "@/lib/supabase/types";

export function DocumentUploadForm({ shipments }: { shipments: Shipment[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const [shipmentId, setShipmentId] = useState("");

  const selectedShipment = shipments.find((shipment) => shipment.id === shipmentId) ?? null;

  function onSubmit(formData: FormData) {
    void uploadDocument(formData).then((result) => {
      setMessage(result.message);
    });
  }

  return (
    <form action={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium">Shipment</label>
        <Select name="shipmentId" value={shipmentId} onChange={(event) => setShipmentId(event.target.value)}>
          <option value="">Select shipment</option>
          {shipments.map((shipment) => (
            <option key={shipment.id} value={shipment.id}>
              {shipment.shipment_number}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Document</label>
        <Input name="file" type="file" />
      </div>

      <input name="customerId" type="hidden" value={selectedShipment?.customer_id ?? ""} />
      <input name="orderId" type="hidden" value={selectedShipment?.order_id ?? ""} />

      <div className="md:col-span-2 flex items-center gap-3">
        <Button type="submit">Upload Document</Button>
        {message ? <p className="text-sm text-muted">{message}</p> : null}
      </div>
    </form>
  );
}
