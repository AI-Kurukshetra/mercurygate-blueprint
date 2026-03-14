"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createRate } from "@/app/actions/tms";
import { Button, Input, Select } from "@/components/ui/primitives";
import type { Carrier } from "@/lib/supabase/types";
import { type RateInput, rateSchema } from "@/lib/validations/tms";

export function RateForm({ carriers }: { carriers: Carrier[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<RateInput>({
    resolver: zodResolver(rateSchema)
  });

  async function onSubmit(values: RateInput) {
    const result = await createRate(values);
    setMessage(result.message);
    if (result.success) {
      reset();
    }
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium">Carrier</label>
        <Select {...register("carrierId")}>
          <option value="">Select carrier</option>
          {carriers.map((carrier) => (
            <option key={carrier.id} value={carrier.id}>
              {carrier.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Mode</label>
        <Select {...register("mode")}>
          <option value="FTL">FTL</option>
          <option value="LTL">LTL</option>
          <option value="Parcel">Parcel</option>
          <option value="Intermodal">Intermodal</option>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Base Rate</label>
        <Input type="number" step="0.01" {...register("baseRate")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Origin Region</label>
        <Input {...register("originRegion")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Destination Region</label>
        <Input {...register("destinationRegion")} />
      </div>
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium">Rate per Mile</label>
        <Input type="number" step="0.01" {...register("ratePerMile")} />
      </div>
      <div className="md:col-span-2 flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add Rate Card"}
        </Button>
        {message ? <p className="text-sm text-muted">{message}</p> : null}
      </div>
    </form>
  );
}

