"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createCarrier } from "@/app/actions/tms";
import { Button, Input } from "@/components/ui/primitives";
import { type CarrierInput, carrierSchema } from "@/lib/validations/tms";

export function CarrierForm() {
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<CarrierInput>({
    resolver: zodResolver(carrierSchema)
  });

  async function onSubmit(values: CarrierInput) {
    const result = await createCarrier(values);
    setMessage(result.message);
    if (result.success) {
      reset();
    }
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-2 block text-sm font-medium">Carrier Name</label>
        <Input {...register("name")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">SCAC Code</label>
        <Input {...register("scacCode")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Service Area</label>
        <Input {...register("serviceArea")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Contact Name</label>
        <Input {...register("contactName")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Contact Email</label>
        <Input type="email" {...register("contactEmail")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Contact Phone</label>
        <Input {...register("contactPhone")} />
      </div>
      <div className="md:col-span-2 flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add Carrier"}
        </Button>
        {message ? <p className="text-sm text-muted">{message}</p> : null}
      </div>
    </form>
  );
}
