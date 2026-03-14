import type { Metadata } from "next";

import { CustomerForm } from "@/components/customers/customer-form";
import { PageHeader } from "@/components/tms/page-header";
import { StatusBadge } from "@/components/tms/status-badge";
import { Card } from "@/components/ui/primitives";
import { getCustomers } from "@/lib/data/tms";

export const metadata: Metadata = {
  title: "Customers | NextGen Transportation Management System (TMS)",
  description: "Manage shipper accounts and customer contact records."
};

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer Management"
        title="Maintain shipper accounts"
        description="Create customer records, assign contact details, and set billing terms used across orders and shipments."
      />

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Add Customer</h3>
          <CustomerForm />
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Customer Directory</h3>
          <div className="space-y-3">
            {customers.map((customer) => (
              <div key={customer.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{customer.name}</p>
                  <StatusBadge status={customer.status} />
                </div>
                <p className="mt-2 text-sm text-muted">
                  {customer.account_code} | {customer.contact_email || "No email"}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
