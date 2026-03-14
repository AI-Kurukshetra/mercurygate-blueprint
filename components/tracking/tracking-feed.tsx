"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/client";
import type { TrackingEvent } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";

export function TrackingFeed({ initialEvents }: { initialEvents: TrackingEvent[] }) {
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("tracking-events")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tracking_events" },
        (payload) => {
          setEvents((current) => [payload.new as TrackingEvent, ...current]);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card key={event.id} className="p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold capitalize text-slate-900">
                {event.event_type.replaceAll("_", " ")}
              </p>
              <p className="text-sm text-muted">{event.description || "No additional notes."}</p>
            </div>
            <div className="text-sm text-muted">
              <p>{event.location || "No location"}</p>
              <p>{formatDate(event.event_time)}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

