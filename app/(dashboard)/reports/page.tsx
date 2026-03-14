import type { Metadata } from "next";

import { PageHeader } from "@/components/tms/page-header";
import { StatusBadge } from "@/components/tms/status-badge";
import { Card } from "@/components/ui/primitives";
import { getDashboardData, getOrders } from "@/lib/data/tms";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reports | NextGen Transportation Management System (TMS)",
  description: "Basic shipment and customer reporting dashboard."
};

export default async function ReportsPage() {
  const [{ shipments }, orders] = await Promise.all([getDashboardData(), getOrders()]);

  const shipmentSummary = shipments.reduce<Record<string, number>>((summary, shipment) => {
    summary[shipment.status] = (summary[shipment.status] ?? 0) + 1;
    return summary;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Operational and commercial summaries"
        description="Use the MVP dashboard to review shipment status distribution, order volume, and estimated revenue."
      />

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Shipment Status Summary</h3>
          <div className="space-y-3">
            {Object.entries(shipmentSummary).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between rounded-2xl border border-border p-4">
                <StatusBadge status={status} />
                <span className="text-lg font-semibold text-slate-900">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Commercial Snapshot</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Orders</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{orders.length}</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Shipments</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{shipments.length}</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Revenue</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {formatCurrency(
                  shipments.reduce((total, shipment) => total + Number(shipment.rate_amount ?? 0), 0)
                )}
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
