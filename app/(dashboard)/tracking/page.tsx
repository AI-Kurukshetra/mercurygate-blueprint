import type { Metadata } from "next";

import { TrackingEventForm } from "@/components/tracking/tracking-event-form";
import { TrackingFeed } from "@/components/tracking/tracking-feed";
import { PageHeader } from "@/components/tms/page-header";
import { Card } from "@/components/ui/primitives";
import { getShipments, getTrackingEvents } from "@/lib/data/tms";

export const metadata: Metadata = {
  title: "Tracking | NextGen Transportation Management System (TMS)",
  description: "Record and monitor shipment milestones."
};

export default async function TrackingPage() {
  const [shipments, trackingEvents] = await Promise.all([getShipments(), getTrackingEvents()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Shipment Tracking"
        title="Update milestones in realtime"
        description="Capture pickup, transit, delay, and delivery events while exposing a clean tracking timeline."
      />

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Add Tracking Event</h3>
          <TrackingEventForm shipments={shipments} />
        </Card>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Realtime Timeline</h3>
          <TrackingFeed initialEvents={trackingEvents} />
        </div>
      </section>
    </div>
  );
}
