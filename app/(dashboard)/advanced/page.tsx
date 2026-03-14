import type { Metadata } from "next";

import { PageHeader } from "@/components/tms/page-header";
import { Card } from "@/components/ui/primitives";
import { requireRole } from "@/lib/auth";
import { buildAdvancedInsights } from "@/lib/advanced/insights";
import { getDashboardData, getTrackingEvents } from "@/lib/data/tms";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Advanced Features | NextGen Transportation Management System (TMS)",
  description: "Advanced differentiating capabilities layered on top of core TMS workflows."
};

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
    </div>
  );
}

export default async function AdvancedPage() {
  await requireRole(["admin", "ops"]);
  const [{ shipments, orders, carriers }, trackingEvents] = await Promise.all([
    getDashboardData(),
    getTrackingEvents()
  ]);
  const insights = buildAdvancedInsights({ shipments, orders, carriers, trackingEvents });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Advanced Suite"
        title="Differentiating capabilities layer"
        description="These advanced engines run on live TMS data without breaking existing workflows. They provide decision support, optimization, and execution insights."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Active Advanced Features</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">14</p>
          <p className="mt-2 text-sm text-muted">All differentiators are enabled in simulated-operational mode.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Shipments Evaluated</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{shipments.length}</p>
          <p className="mt-2 text-sm text-muted">Every advanced module is computed from live shipment data.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Optimization Potential</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {Math.round(
              insights.networkOptimization.reduce((sum, lane) => sum + lane.savingsPotential, 0) /
                Math.max(insights.networkOptimization.length, 1)
            )}
            %
          </p>
          <p className="mt-2 text-sm text-muted">Average lane-level savings opportunity from network engine.</p>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <SectionTitle
            title="1) AI-Powered Predictive Analytics"
            description="Predicted ETA, delay risk, and confidence generated from status + lane metrics."
          />
          <div className="space-y-3">
            {insights.predictiveAnalytics.slice(0, 6).map((item) => (
              <div key={item.shipmentNumber} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{item.shipmentNumber}</p>
                <p className="mt-1 text-sm text-muted">Predicted ETA: {new Date(item.predictedEta).toLocaleString()}</p>
                <p className="mt-1 text-sm text-muted">
                  Risk {item.delayRisk}% | Confidence {item.confidence}%
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            title="2) Dynamic Pricing Engine"
            description="Real-time quote optimization using demand, capacity, and volatility multipliers."
          />
          <div className="space-y-3">
            {insights.dynamicPricing.slice(0, 6).map((item) => (
              <div key={item.shipmentNumber} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{item.shipmentNumber}</p>
                <p className="mt-1 text-sm text-muted">
                  Base {formatCurrency(item.baseRate)} {"->"} Optimized {formatCurrency(item.optimizedRate)}
                </p>
                <p className="mt-1 text-sm text-muted">Delta {formatCurrency(item.delta)}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <SectionTitle
            title="3) IoT Device Integration"
            description="Telematics stream model for temperature, battery, and ping freshness."
          />
          <div className="space-y-3">
            {insights.iotDeviceIntegration.slice(0, 6).map((device) => (
              <div key={device.deviceId} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{device.deviceId}</p>
                <p className="mt-1 text-sm text-muted">
                  {device.shipmentNumber} | {device.telemetryStatus}
                </p>
                <p className="mt-1 text-sm text-muted">
                  Battery {device.battery}% | Temp {device.temperatureC}C | Ping age {device.pingAgeMinutes} min
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            title="4) Blockchain Supply Chain"
            description="Immutable event chain with shipment-specific rolling hashes."
          />
          <div className="space-y-3">
            {insights.blockchainLedger.slice(0, 6).map((entry) => (
              <div key={entry.shipmentNumber} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{entry.shipmentNumber}</p>
                <p className="mt-1 text-sm text-muted">
                  Blocks: {entry.blocks} | Last hash: {entry.lastHash}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <SectionTitle
            title="5) Advanced Optimization Algorithms"
            description="Multi-objective scoring across service, cost, and carbon dimensions."
          />
          <div className="space-y-3">
            {insights.advancedOptimization.slice(0, 6).map((item) => (
              <div key={item.shipmentNumber} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{item.shipmentNumber}</p>
                <p className="mt-1 text-sm text-muted">
                  Service {item.serviceScore} | Cost {item.costScore} | Carbon {item.carbonScore}
                </p>
                <p className="mt-1 text-sm text-muted">Weighted score {item.weighted}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            title="6) Digital Twin Simulation"
            description="Virtual network scenario comparing baseline and optimized outcomes."
          />
          <div className="space-y-2 rounded-2xl border border-border p-4">
            <p className="text-sm text-muted">
              Baseline Cost: <span className="font-semibold text-slate-900">{formatCurrency(insights.digitalTwinSimulation.baselineCost)}</span>
            </p>
            <p className="text-sm text-muted">
              Optimized Cost: <span className="font-semibold text-slate-900">{formatCurrency(insights.digitalTwinSimulation.optimizedCost)}</span>
            </p>
            <p className="text-sm text-muted">
              Baseline Transit Days:{" "}
              <span className="font-semibold text-slate-900">{insights.digitalTwinSimulation.baselineTransitDays}</span>
            </p>
            <p className="text-sm text-muted">
              Optimized Transit Days:{" "}
              <span className="font-semibold text-slate-900">{insights.digitalTwinSimulation.optimizedTransitDays}</span>
            </p>
            <p className="text-sm text-muted">
              Confidence: <span className="font-semibold text-slate-900">{insights.digitalTwinSimulation.confidence}%</span>
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <SectionTitle
            title="7) Autonomous Vehicle Integration"
            description="Autonomy readiness scoring with corridor-level eligibility."
          />
          <div className="space-y-3">
            {insights.autonomousIntegration.slice(0, 6).map((item) => (
              <div key={item.shipmentNumber} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{item.shipmentNumber}</p>
                <p className="mt-1 text-sm text-muted">
                  {item.autonomyLevel} | Readiness {item.readiness}%
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            title="8) Carbon Footprint Tracking"
            description="Per-shipment emissions accounting with offsets and net carbon output."
          />
          <div className="space-y-3">
            {insights.carbonTracking.slice(0, 6).map((item) => (
              <div key={item.shipmentNumber} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{item.shipmentNumber}</p>
                <p className="mt-1 text-sm text-muted">
                  {item.mode} | {item.kgCo2} kg CO2 | Net {item.netKgCo2} kg after offsets
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <SectionTitle
            title="9) Collaborative Planning Platform"
            description="Multi-party planning workload by shipment, participants, and open actions."
          />
          <div className="space-y-3">
            {insights.collaborativePlanning.slice(0, 6).map((item) => (
              <div key={item.shipmentNumber} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{item.shipmentNumber}</p>
                <p className="mt-1 text-sm text-muted">
                  Participants {item.participants} | Actions {item.openActions} | {item.workflowState}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            title="10) Network Optimization Engine"
            description="Lane-level recommendation model for savings and routing quality."
          />
          <div className="space-y-3">
            {insights.networkOptimization.map((lane) => (
              <div key={lane.lane} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{lane.lane}</p>
                <p className="mt-1 text-sm text-muted">
                  Loads {lane.loadCount} | Avg rate {formatCurrency(lane.averageRate)} | Savings potential{" "}
                  {lane.savingsPotential}%
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <SectionTitle
            title="11) Advanced Risk Management"
            description="Composite risk scoring from weather, delay probability, and theft exposure."
          />
          <div className="space-y-3">
            {insights.advancedRiskManagement.slice(0, 6).map((item) => (
              <div key={item.shipmentNumber} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{item.shipmentNumber}</p>
                <p className="mt-1 text-sm text-muted">
                  Weather {item.weatherRisk} | Delay {item.delayRisk} | Theft {item.theftRisk}
                </p>
                <p className="mt-1 text-sm text-muted">Overall risk {item.combined}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            title="12) Voice Interface"
            description="Hands-free command interpretation with logistics-specific intent responses."
          />
          <div className="space-y-3">
            {insights.voiceInterface.map((voice) => (
              <div key={voice.command} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">&quot;{voice.command}&quot;</p>
                <p className="mt-1 text-sm text-muted">{voice.response}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <SectionTitle
            title="13) Augmented Reality Tools"
            description="Load-plan guidance readiness for AR overlays in yard/warehouse operations."
          />
          <div className="space-y-3">
            {insights.augmentedRealityTools.slice(0, 6).map((item) => (
              <div key={item.shipmentNumber} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{item.shipmentNumber}</p>
                <p className="mt-1 text-sm text-muted">
                  Utilization {item.utilization}% | Safety {item.safetyScore}% | {item.arGuide}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            title="14) Marketplace Integration"
            description="Spot quote comparison across marketplace providers with best-rate recommendations."
          />
          <div className="space-y-3">
            {insights.marketplaceIntegration.slice(0, 6).map((item) => (
              <div key={item.shipmentNumber} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-slate-900">{item.shipmentNumber}</p>
                <p className="mt-1 text-sm text-muted">
                  Best quote: {item.bestProvider} at {formatCurrency(item.bestRate)}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {item.quotes.map((quote) => `${quote.provider} ${formatCurrency(quote.amount)}`).join(" | ")}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
