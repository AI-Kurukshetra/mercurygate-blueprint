"use client";

import { useState } from "react";

import { assignCarrier } from "@/app/actions/tms";
import { Button, Select } from "@/components/ui/primitives";
import type { Carrier, Shipment } from "@/lib/supabase/types";

type AssignCarrierFormProps = {
  shipments: Shipment[];
  carriers: Carrier[];
};

export function AssignCarrierForm({ shipments, carriers }: AssignCarrierFormProps) {
  const [shipmentId, setShipmentId] = useState("");
  const [carrierId, setCarrierId] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    const shipmentValue = formData.get("shipmentId");
    const carrierValue = formData.get("carrierId");

    if (typeof shipmentValue !== "string" || typeof carrierValue !== "string") {
      setMessage("Select both shipment and carrier.");
      return;
    }

    void assignCarrier({ shipmentId: shipmentValue, carrierId: carrierValue }).then((result) => {
      setMessage(result.message);
    });
  }

  return (
    <form action={onSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
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
        <label className="mb-2 block text-sm font-medium">Carrier</label>
        <Select name="carrierId" value={carrierId} onChange={(event) => setCarrierId(event.target.value)}>
          <option value="">Select carrier</option>
          {carriers.map((carrier) => (
            <option key={carrier.id} value={carrier.id}>
              {carrier.name}
            </option>
          ))}
        </Select>
      </div>

      <Button className="h-12" type="submit">
        Assign Carrier
      </Button>

      {message ? <p className="md:col-span-3 text-sm text-muted">{message}</p> : null}
    </form>
  );
}
