"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createShipment } from "@/app/actions/tms";
import { Button, Input, Select } from "@/components/ui/primitives";
import type { Customer, Order } from "@/lib/supabase/types";
import { type ShipmentInput, shipmentSchema } from "@/lib/validations/tms";

type ShipmentFormProps = {
  orders: Order[];
  customers: Customer[];
};

export function ShipmentForm({ orders, customers }: ShipmentFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<ShipmentInput>({
    resolver: zodResolver(shipmentSchema)
  });

  async function onSubmit(values: ShipmentInput) {
    const result = await createShipment(values);
    setMessage(result.message);
    if (result.success) {
      reset();
    }
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-2 block text-sm font-medium">Order</label>
        <Select {...register("orderId")}>
          <option value="">Select order</option>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.order_number} | {order.origin_city} to {order.destination_city}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Customer</label>
        <Select {...register("customerId")}>
          <option value="">Select customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Pickup ETA</label>
        <Input type="datetime-local" {...register("pickupEta")} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Delivery ETA</label>
        <Input type="datetime-local" {...register("deliveryEta")} />
      </div>

      <div className="md:col-span-2 flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Shipment"}
        </Button>
        {message ? <p className="text-sm text-muted">{message}</p> : null}
      </div>
    </form>
  );
}
