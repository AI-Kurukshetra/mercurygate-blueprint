import { Card } from "@/components/ui/primitives";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-blue-200/35 blur-2xl" />
      <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="relative mt-3 font-display text-3xl font-semibold text-slate-900">{value}</p>
      <p className="relative mt-2 text-sm text-muted">{detail}</p>
    </Card>
  );
}
