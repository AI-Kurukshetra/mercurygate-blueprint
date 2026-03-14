import type { Metadata } from "next";

import { AssignCarrierForm } from "@/components/shipments/assign-carrier-form";
import { ShipmentForm } from "@/components/shipments/shipment-form";
import { DocumentUploadForm } from "@/components/documents/document-upload-form";
import { PageHeader } from "@/components/tms/page-header";
import { StatusBadge } from "@/components/tms/status-badge";
import { Card } from "@/components/ui/primitives";
import { getCarriers, getCustomers, getOrders, getShipments } from "@/lib/data/tms";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shipments | NextGen Transportation Management System (TMS)",
  description: "Build shipments, assign carriers, and manage supporting documents."
};

export default async function ShipmentsPage() {
  const [shipments, orders, customers, carriers] = await Promise.all([
    getShipments(),
    getOrders(),
    getCustomers(),
    getCarriers()
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Shipment Creation"
        title="Plan loads and execute carrier assignments"
        description="Create shipments from orders, calculate carrier rates, and upload shipping paperwork."
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Create Shipment</h3>
          <ShipmentForm customers={customers} orders={orders} />
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Assign Carrier + Rate</h3>
          <AssignCarrierForm carriers={carriers} shipments={shipments} />
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Shipment Board</h3>
            <p className="text-sm text-muted">Core shipment lifecycle state</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="pb-3">Shipment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Miles</th>
                  <th className="pb-3">Rate</th>
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
                    <td className="py-3 text-muted">{formatCurrency(Number(shipment.rate_amount ?? 0))}</td>
                    <td className="py-3 text-muted">{formatDate(shipment.delivery_eta)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Upload Documents</h3>
          <DocumentUploadForm shipments={shipments} />
        </Card>
      </section>
    </div>
  );
}
