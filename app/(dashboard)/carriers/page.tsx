import type { Metadata } from "next";

import { CarrierForm } from "@/components/carriers/carrier-form";
import { RateForm } from "@/components/carriers/rate-form";
import { PageHeader } from "@/components/tms/page-header";
import { StatusBadge } from "@/components/tms/status-badge";
import { Card } from "@/components/ui/primitives";
import { getCarriers, getRates } from "@/lib/data/tms";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Carriers | NextGen Transportation Management System (TMS)",
  description: "Manage carrier records and lane coverage."
};

export default async function CarriersPage() {
  const [carriers, rates] = await Promise.all([getCarriers(), getRates()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Carrier Management"
        title="Maintain approved carrier partners"
        description="Manage carrier contacts, service areas, and operational status."
      />

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Add Carrier</h3>
          <CarrierForm />
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Carrier Directory</h3>
          <div className="space-y-3">
            {carriers.map((carrier) => (
              <div key={carrier.id} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{carrier.name}</p>
                  <StatusBadge status={carrier.status} />
                </div>
                <p className="mt-2 text-sm text-muted">
                  {carrier.service_area || "No service area"} | {carrier.contact_email || "No email"}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Rate Management</h3>
          <RateForm carriers={carriers} />
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Active Rate Cards</h3>
          <div className="space-y-3">
            {rates.map((rate) => (
              <div key={rate.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">
                    {rate.origin_region} {"->"} {rate.destination_region}
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {formatCurrency(Number(rate.base_rate ?? 0))} + {Number(rate.rate_per_mile ?? 0)}/mi
                  </p>
                </div>
                <p className="mt-2 text-sm text-muted">{rate.mode}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
