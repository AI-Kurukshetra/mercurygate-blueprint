"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createCustomer } from "@/app/actions/tms";
import { Button, Input } from "@/components/ui/primitives";
import { type CustomerInput, customerSchema } from "@/lib/validations/tms";

export function CustomerForm() {
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema)
  });

  async function onSubmit(values: CustomerInput) {
    const result = await createCustomer(values);
    setMessage(result.message);
    if (result.success) {
      reset();
    }
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-2 block text-sm font-medium">Customer Name</label>
        <Input {...register("name")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Account Code</label>
        <Input {...register("accountCode")} />
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
      <div>
        <label className="mb-2 block text-sm font-medium">Billing Terms</label>
        <Input {...register("billingTerms")} />
      </div>
      <div className="md:col-span-2 flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add Customer"}
        </Button>
        {message ? <p className="text-sm text-muted">{message}</p> : null}
      </div>
    </form>
  );
}

