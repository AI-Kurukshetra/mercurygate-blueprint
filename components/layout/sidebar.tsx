"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Compass,
  ClipboardList,
  LayoutDashboard,
  Route,
  Sparkles,
  ShieldCheck,
  Truck,
  Users
} from "lucide-react";

import { APP_SHORT_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/shipments", label: "Shipments", icon: Route },
  { href: "/carriers", label: "Carriers", icon: Truck },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/tracking", label: "Tracking", icon: Compass },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/advanced", label: "Advanced", icon: Sparkles },
  { href: "/customer-portal", label: "Customer Portal", icon: Users },
  { href: "/users", label: "Users", icon: ShieldCheck }
];

export function Sidebar() {
  const currentPath = usePathname();

  return (
    <aside className="rounded-[32px] border border-slate-900/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-5 py-6 text-slate-100 shadow-panel">
      <div className="relative mb-10 overflow-hidden rounded-2xl border border-amber-300/25 bg-gradient-to-br from-white/10 via-sky-500/10 to-amber-400/10 px-4 py-4">
        <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-300/20 blur-2xl" />
        <div className="pointer-events-none absolute -left-5 bottom-0 h-16 w-16 rounded-full bg-cyan-300/20 blur-xl" />
        <p className="relative text-[10px] uppercase tracking-[0.3em] text-amber-100/90">Control Tower</p>
        <h2 className="relative mt-1 bg-gradient-to-r from-amber-200 via-cyan-100 to-sky-200 bg-clip-text font-display text-2xl font-semibold text-transparent">
          {APP_SHORT_NAME}
        </h2>
        <p className="relative mt-2 text-xs font-medium text-slate-100/95">
          Cloud Transportation Command Center
        </p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = currentPath === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                active
                  ? "bg-gradient-to-r from-blue-400 to-cyan-300 text-slate-950 shadow-lg shadow-blue-500/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4 transition", active ? "text-slate-950" : "text-slate-400 group-hover:text-white")} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
