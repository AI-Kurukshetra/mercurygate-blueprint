import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  draft: "border border-slate-200 bg-slate-100/80 text-slate-700",
  planned: "border border-amber-200 bg-amber-100/80 text-amber-800",
  shipped: "border border-sky-200 bg-sky-100/80 text-sky-800",
  in_transit: "border border-sky-200 bg-sky-100/80 text-sky-800",
  delivered: "border border-emerald-200 bg-emerald-100/80 text-emerald-800",
  delayed: "border border-rose-200 bg-rose-100/80 text-rose-700",
  cancelled: "border border-slate-300 bg-slate-200/80 text-slate-700",
  active: "border border-emerald-200 bg-emerald-100/80 text-emerald-800"
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        statusStyles[status] ?? "border border-slate-200 bg-slate-100/80 text-slate-700"
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
