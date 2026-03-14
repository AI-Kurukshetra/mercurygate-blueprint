import type { Metadata } from "next";

import { PageHeader } from "@/components/tms/page-header";
import { StatusBadge } from "@/components/tms/status-badge";
import { Card } from "@/components/ui/primitives";
import { getSessionProfile } from "@/lib/auth";
import { getCustomerPortalData } from "@/lib/data/tms";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Customer Portal | NextGen Transportation Management System (TMS)",
  description: "Customer-facing order, shipment, and document visibility."
};

export default async function CustomerPortalPage() {
  const { profile } = await getSessionProfile();
  const { orders, shipments, documents } = await getCustomerPortalData(profile);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer Portal"
        title="Shipment visibility for shipper accounts"
        description="Customers see only their own orders, shipment updates, and uploaded documents through RLS."
      />

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Orders</h3>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{order.order_number}</p>
                <p className="mt-1 text-sm text-muted">
                  {order.origin_city}, {order.origin_state} {"->"} {order.destination_city},{" "}
                  {order.destination_state}
                </p>
                <div className="mt-3">
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Shipments</h3>
          <div className="space-y-3">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{shipment.shipment_number}</p>
                <p className="mt-1 text-sm text-muted">ETA: {formatDate(shipment.delivery_eta)}</p>
                <div className="mt-3">
                  <StatusBadge status={shipment.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Documents</h3>
          <div className="space-y-3">
            {documents.map((document) => (
              <div key={document.id} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{document.file_name}</p>
                <p className="mt-1 text-sm text-muted">{document.file_type || "Unknown type"}</p>
                <p className="mt-1 text-sm text-muted">Uploaded {formatDate(document.uploaded_at)}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
