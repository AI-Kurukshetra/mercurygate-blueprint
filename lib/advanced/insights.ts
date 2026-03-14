import { createHash } from "node:crypto";

import type { Carrier, Order, Shipment, TrackingEvent } from "@/lib/supabase/types";

type AdvancedInput = {
  shipments: Shipment[];
  orders: Order[];
  carriers: Carrier[];
  trackingEvents: TrackingEvent[];
};

type Quote = {
  provider: string;
  amount: number;
  transitDays: number;
};

const EMISSION_FACTOR_BY_MODE: Record<string, number> = {
  FTL: 1.65,
  LTL: 2.15,
  Parcel: 0.95,
  Intermodal: 1.1
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function percent(part: number, total: number) {
  if (!total) {
    return 0;
  }

  return Number(((part / total) * 100).toFixed(1));
}

export function buildAdvancedInsights(input: AdvancedInput) {
  const orderById = new Map(input.orders.map((order) => [order.id, order]));
  const trackingByShipment = new Map<string, TrackingEvent[]>();

  for (const event of input.trackingEvents) {
    const current = trackingByShipment.get(event.shipment_id) ?? [];
    current.push(event);
    trackingByShipment.set(event.shipment_id, current);
  }

  for (const [shipmentId, events] of trackingByShipment.entries()) {
    trackingByShipment.set(
      shipmentId,
      events.sort((a, b) => new Date(a.event_time).getTime() - new Date(b.event_time).getTime())
    );
  }

  const predictiveAnalytics = input.shipments.map((shipment) => {
    const now = Date.now();
    const baseEta = shipment.delivery_eta ? new Date(shipment.delivery_eta).getTime() : now + 36 * 3600000;
    const statusPenalty =
      shipment.status === "delayed" ? 16 : shipment.status === "planned" ? 9 : shipment.status === "delivered" ? -6 : 0;
    const distancePenalty = Number(shipment.distance_miles ?? 0) > 1200 ? 6 : 0;
    const predictedEta = new Date(baseEta + (statusPenalty + distancePenalty) * 3600000).toISOString();
    const delayRisk = clamp(
      25 +
        (shipment.status === "delayed" ? 45 : 0) +
        (shipment.status === "planned" ? 20 : 0) +
        Math.floor(Number(shipment.distance_miles ?? 0) / 110)
    );
    const confidence = clamp(92 - Math.floor(delayRisk * 0.55), 35, 95);

    return {
      shipmentNumber: shipment.shipment_number,
      predictedEta,
      delayRisk,
      confidence
    };
  });

  const dynamicPricing = input.shipments.map((shipment) => {
    const base = Number(shipment.rate_amount ?? 600);
    const distance = Number(shipment.distance_miles ?? 600);
    const demandMultiplier = shipment.status === "planned" ? 1.07 : 1.02;
    const capacityMultiplier = input.carriers.length < 3 ? 1.08 : 1.03;
    const volatilityMultiplier = distance > 1000 ? 1.06 : 1.02;
    const optimizedRate = Math.round(base * demandMultiplier * capacityMultiplier * volatilityMultiplier);

    return {
      shipmentNumber: shipment.shipment_number,
      baseRate: Math.round(base),
      optimizedRate,
      delta: optimizedRate - Math.round(base)
    };
  });

  const iotDeviceIntegration = input.shipments.map((shipment, index) => ({
    shipmentNumber: shipment.shipment_number,
    deviceId: `IOT-${shipment.shipment_number}`,
    telemetryStatus: shipment.status === "planned" ? "scheduled" : "live",
    battery: clamp(92 - index * 8, 41, 96),
    temperatureC: shipment.status === "delivered" ? 7 : 4 + (index % 4),
    pingAgeMinutes: shipment.status === "planned" ? 45 : 2 + index * 3
  }));

  const blockchainLedger = input.shipments.map((shipment) => {
    const events = trackingByShipment.get(shipment.id) ?? [];
    let previousHash = "GENESIS";

    const chain = events.map((event) => {
      const payload = `${shipment.shipment_number}|${event.event_type}|${event.event_time}|${previousHash}`;
      const hash = createHash("sha256").update(payload).digest("hex").slice(0, 16);
      previousHash = hash;
      return { event: event.event_type, hash };
    });

    return {
      shipmentNumber: shipment.shipment_number,
      blocks: chain.length,
      lastHash: chain.length ? chain[chain.length - 1].hash : "pending"
    };
  });

  const advancedOptimization = input.shipments.map((shipment) => {
    const distance = Number(shipment.distance_miles ?? 600);
    const serviceScore = clamp(88 - Math.floor(distance / 70) - (shipment.status === "delayed" ? 18 : 0));
    const costScore = clamp(83 - Math.floor((Number(shipment.rate_amount ?? 0) || 1200) / 220));
    const carbonScore = clamp(76 - Math.floor(distance / 95));
    const weighted = Math.round(serviceScore * 0.45 + costScore * 0.35 + carbonScore * 0.2);

    return {
      shipmentNumber: shipment.shipment_number,
      serviceScore,
      costScore,
      carbonScore,
      weighted
    };
  });

  const networkSimulationBaseline = input.shipments.reduce(
    (accumulator, shipment) => {
      accumulator.cost += Number(shipment.rate_amount ?? 1000);
      accumulator.transitDays += Number(shipment.transit_days ?? 2);
      return accumulator;
    },
    { cost: 0, transitDays: 0 }
  );
  const digitalTwinSimulation = {
    baselineCost: Math.round(networkSimulationBaseline.cost),
    optimizedCost: Math.round(networkSimulationBaseline.cost * 0.89),
    baselineTransitDays: Number(networkSimulationBaseline.transitDays.toFixed(1)),
    optimizedTransitDays: Number((networkSimulationBaseline.transitDays * 0.91).toFixed(1)),
    confidence: 84
  };

  const autonomousIntegration = input.shipments.map((shipment) => {
    const distance = Number(shipment.distance_miles ?? 0);
    const autonomyLevel = distance < 500 ? "L4 Corridor-Ready" : distance < 1000 ? "L3 Assist" : "L2 Pilot";
    const readiness = clamp(
      58 + (shipment.status === "planned" ? 14 : 8) + (shipment.status === "delayed" ? -16 : 0),
      35,
      92
    );

    return {
      shipmentNumber: shipment.shipment_number,
      autonomyLevel,
      readiness
    };
  });

  const carbonTracking = input.shipments.map((shipment) => {
    const order = orderById.get(shipment.order_id);
    const mode = order?.mode ?? "FTL";
    const distance = Number(shipment.distance_miles ?? 0);
    const factor = EMISSION_FACTOR_BY_MODE[mode] ?? 1.55;
    const kgCo2 = Number((distance * factor).toFixed(2));
    const offset = Number((kgCo2 * 0.18).toFixed(2));

    return {
      shipmentNumber: shipment.shipment_number,
      mode,
      kgCo2,
      offset,
      netKgCo2: Number((kgCo2 - offset).toFixed(2))
    };
  });

  const collaborativePlanning = input.shipments.map((shipment) => ({
    shipmentNumber: shipment.shipment_number,
    participants: shipment.status === "planned" ? 2 : 4,
    openActions: shipment.status === "delayed" ? 3 : shipment.status === "in_transit" ? 2 : 1,
    workflowState: shipment.status === "delivered" ? "closed" : "active"
  }));

  const laneStats = new Map<string, { count: number; avgRate: number }>();
  for (const shipment of input.shipments) {
    const order = orderById.get(shipment.order_id);
    if (!order) {
      continue;
    }

    const lane = `${order.origin_state}->${order.destination_state}`;
    const current = laneStats.get(lane) ?? { count: 0, avgRate: 0 };
    const rate = Number(shipment.rate_amount ?? 0);
    const nextCount = current.count + 1;
    const nextAvg = (current.avgRate * current.count + rate) / nextCount;
    laneStats.set(lane, { count: nextCount, avgRate: nextAvg });
  }

  const networkOptimization = Array.from(laneStats.entries()).map(([lane, data]) => ({
    lane,
    loadCount: data.count,
    averageRate: Math.round(data.avgRate),
    savingsPotential: clamp(12 + data.count * 2, 8, 24)
  }));

  const advancedRiskManagement = input.shipments.map((shipment) => {
    const distance = Number(shipment.distance_miles ?? 0);
    const weatherRisk = clamp(22 + Math.floor(distance / 90));
    const delayRisk = clamp(
      shipment.status === "delayed" ? 82 : shipment.status === "in_transit" ? 48 : shipment.status === "planned" ? 56 : 24
    );
    const theftRisk = clamp(18 + Math.floor(Number(shipment.rate_amount ?? 0) / 320));
    const combined = Math.round(weatherRisk * 0.35 + delayRisk * 0.45 + theftRisk * 0.2);

    return {
      shipmentNumber: shipment.shipment_number,
      weatherRisk,
      delayRisk,
      theftRisk,
      combined
    };
  });

  const delayedCount = input.shipments.filter((shipment) => shipment.status === "delayed").length;
  const voiceInterface = [
    {
      command: "Show delayed shipments",
      response: `${delayedCount} delayed shipments found with priority alerts.`
    },
    {
      command: "What is today revenue",
      response: `Estimated revenue ${dynamicPricing
        .reduce((sum, quote) => sum + quote.optimizedRate, 0)
        .toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}.`
    },
    {
      command: "Run optimization summary",
      response: `Network savings potential ${percent(
        networkOptimization.reduce((sum, item) => sum + item.savingsPotential, 0),
        Math.max(networkOptimization.length * 25, 1)
      )}% across active lanes.`
    }
  ];

  const augmentedRealityTools = input.shipments.map((shipment) => {
    const order = orderById.get(shipment.order_id);
    const weight = Number(order?.weight_lb ?? 0);
    const capacity = shipment.vehicle_id ? 44000 : 30000;
    const utilization = clamp(Math.round((weight / Math.max(capacity, 1)) * 100), 12, 98);
    const safetyScore = clamp(97 - Math.max(utilization - 70, 0), 61, 98);

    return {
      shipmentNumber: shipment.shipment_number,
      utilization,
      safetyScore,
      arGuide: utilization > 80 ? "Rebalance aisle spacing" : "Standard load pattern"
    };
  });

  const marketplaceIntegration = input.shipments.map((shipment) => {
    const baseRate = Math.max(Number(shipment.rate_amount ?? 900), 500);
    const quotes: Quote[] = [
      { provider: "FreightBoardX", amount: Math.round(baseRate * 0.98), transitDays: 2 },
      { provider: "SpotLaneHub", amount: Math.round(baseRate * 1.03), transitDays: 1 },
      { provider: "CarrierMesh", amount: Math.round(baseRate * 1.01), transitDays: 2 }
    ];
    quotes.sort((a, b) => a.amount - b.amount);

    return {
      shipmentNumber: shipment.shipment_number,
      bestProvider: quotes[0].provider,
      bestRate: quotes[0].amount,
      quotes
    };
  });

  return {
    predictiveAnalytics,
    dynamicPricing,
    iotDeviceIntegration,
    blockchainLedger,
    advancedOptimization,
    digitalTwinSimulation,
    autonomousIntegration,
    carbonTracking,
    collaborativePlanning,
    networkOptimization,
    advancedRiskManagement,
    voiceInterface,
    augmentedRealityTools,
    marketplaceIntegration
  };
}
