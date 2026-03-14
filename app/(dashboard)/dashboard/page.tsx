import type { Metadata } from "next";

import { PageHeader } from "@/components/tms/page-header";
import { StatCard } from "@/components/tms/stat-card";
import { StatusBadge } from "@/components/tms/status-badge";
import { Card } from "@/components/ui/primitives";
import { getDashboardData } from "@/lib/data/tms";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard | NextGen Transportation Management System (TMS)",
  description: "Operational reporting dashboard for the Transportation Management System."
};

export default async function DashboardPage() {
  const { shipments, carriers, metrics } = await getDashboardData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reporting Dashboard"
        title="Control tower visibility"
        description="Monitor active loads, delayed shipments, carrier capacity, and shipment revenue from one place."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Shipments"
          value={String(metrics.activeShipments)}
          detail="Loads not yet delivered."
        />
        <StatCard
          label="Delivered"
          value={String(metrics.deliveredShipments)}
          detail="Completed shipments."
        />
        <StatCard
          label="Delayed"
          value={String(metrics.delayedShipments)}
          detail="Exception shipments requiring action."
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          detail="Estimated shipment revenue from rate assignments."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Recent shipments</h3>
            <p className="text-sm text-muted">Latest operational activity</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="pb-3">Shipment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Distance</th>
                  <th className="pb-3">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td className="py-3 font-medium text-slate-900">{shipment.shipment_number}</td>
                    <td className="py-3">
                      <StatusBadge status={shipment.status} />
                    </td>
                    <td className="py-3 text-muted">{shipment.distance_miles ?? 0} mi</td>
                    <td className="py-3 text-muted">{formatDate(shipment.delivery_eta)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Carrier roster</h3>
            <p className="text-sm text-muted">{carriers.length} active carriers</p>
          </div>

          <div className="space-y-3">
            {carriers.map((carrier) => (
              <div key={carrier.id} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{carrier.name}</p>
                  <StatusBadge status={carrier.status} />
                </div>
                <p className="mt-1 text-sm text-muted">{carrier.service_area || "No service area set"}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
