import type { Metadata } from "next";

import { OrderForm } from "@/components/orders/order-form";
import { PageHeader } from "@/components/tms/page-header";
import { StatusBadge } from "@/components/tms/status-badge";
import { Card } from "@/components/ui/primitives";
import { getCustomers, getOrders } from "@/lib/data/tms";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Orders | NextGen Transportation Management System (TMS)",
  description: "Create and manage customer orders."
};

export default async function OrdersPage() {
  const [customers, orders] = await Promise.all([getCustomers(), getOrders()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Order Management"
        title="Capture transportation demand"
        description="Create shipper orders with lane, dates, mode, and cargo details before converting them into shipments."
      />

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Create Order</h3>
          <OrderForm customers={customers} />
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Order Queue</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Mode</th>
                  <th className="pb-3">Lane</th>
                  <th className="pb-3">Pickup</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 font-medium text-slate-900">{order.order_number}</td>
                    <td className="py-3 text-muted">{order.mode}</td>
                    <td className="py-3 text-muted">
                      {order.origin_city}, {order.origin_state} {"->"} {order.destination_city},{" "}
                      {order.destination_state}
                    </td>
                    <td className="py-3 text-muted">{formatDate(order.pickup_date)}</td>
                    <td className="py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
