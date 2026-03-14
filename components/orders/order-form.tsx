"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createOrder } from "@/app/actions/tms";
import { Button, Input, Select, Textarea } from "@/components/ui/primitives";
import type { Customer } from "@/lib/supabase/types";
import { type OrderInput, orderSchema } from "@/lib/validations/tms";

export function OrderForm({ customers }: { customers: Customer[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<OrderInput>({
    resolver: zodResolver(orderSchema)
  });

  async function onSubmit(values: OrderInput) {
    const result = await createOrder(values);
    setMessage(result.message);
    if (result.success) {
      reset();
    }
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium">Customer</label>
        <Select {...register("customerId")}>
          <option value="">Select customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </Select>
        {errors.customerId ? <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p> : null}
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
        <label className="mb-2 block text-sm font-medium">Weight (lb)</label>
        <Input type="number" {...register("weightLb")} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Origin City</label>
        <Input {...register("originCity")} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Origin State</label>
        <Input maxLength={2} {...register("originState")} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Destination City</label>
        <Input {...register("destinationCity")} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Destination State</label>
        <Input maxLength={2} {...register("destinationState")} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Pickup Date</label>
        <Input type="date" {...register("pickupDate")} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Delivery Date</label>
        <Input type="date" {...register("deliveryDate")} />
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium">Commodity</label>
        <Input {...register("commodity")} />
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium">Notes</label>
        <Textarea {...register("notes")} />
      </div>

      <div className="md:col-span-2 flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Create Order"}
        </Button>
        {message ? <p className="text-sm text-muted">{message}</p> : null}
      </div>
    </form>
  );
}
