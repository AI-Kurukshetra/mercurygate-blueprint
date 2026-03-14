"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { trackShipment } from "@/app/actions/tms";
import { Button, Input, Select } from "@/components/ui/primitives";
import { TRACKING_STATUSES } from "@/lib/constants";
import type { Shipment } from "@/lib/supabase/types";
import { type TrackingInput, trackingSchema } from "@/lib/validations/tms";

export function TrackingEventForm({ shipments }: { shipments: Shipment[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<TrackingInput>({
    resolver: zodResolver(trackingSchema)
  });

  async function onSubmit(values: TrackingInput) {
    const result = await trackShipment(values);
    setMessage(result.message);
    if (result.success) {
      reset();
    }
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-2 block text-sm font-medium">Shipment</label>
        <Select {...register("shipmentId")}>
          <option value="">Select shipment</option>
          {shipments.map((shipment) => (
            <option key={shipment.id} value={shipment.id}>
              {shipment.shipment_number}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Event Type</label>
        <Select {...register("eventType")}>
          {TRACKING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Location</label>
        <Input {...register("location")} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>
        <Input {...register("description")} />
      </div>

      <div className="md:col-span-2 flex items-center gap-3">
        <Button type="submit">Add Tracking Event</Button>
        {message ? <p className="text-sm text-muted">{message}</p> : null}
      </div>
    </form>
  );
}
