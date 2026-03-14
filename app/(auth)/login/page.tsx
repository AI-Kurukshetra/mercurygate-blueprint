import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, ShieldCheck, Truck } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Login | NextGen Transportation Management System (TMS)",
  description: "Sign in to the Transportation Management System MVP."
};

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="relative overflow-hidden rounded-[40px] border border-slate-900/10 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-panel lg:p-12">
        <div className="pointer-events-none absolute -right-10 -top-8 h-40 w-40 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-0 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />

        <p className="text-xs uppercase tracking-[0.35em] text-accent">Transportation Management</p>
        <h1 className="mt-4 max-w-xl font-display text-5xl font-semibold leading-tight">
          Run the order-to-delivery workflow from one cloud console.
        </h1>
        <p className="mt-6 max-w-2xl text-sm text-slate-300">
          NextGen Transportation Management System (TMS) covers customer orders, shipment creation, carrier assignment, tracking,
          documents, and a customer-facing portal without adding unnecessary complexity.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card className="border-white/10 bg-white/5 p-5 text-white">
            <Truck className="h-8 w-8 text-accent" />
            <p className="mt-4 font-semibold">Shipment Control</p>
            <p className="mt-2 text-sm text-slate-300">Create loads, assign carriers, and track milestones.</p>
          </Card>
          <Card className="border-white/10 bg-white/5 p-5 text-white">
            <Boxes className="h-8 w-8 text-accent" />
            <p className="mt-4 font-semibold">Operational Visibility</p>
            <p className="mt-2 text-sm text-slate-300">View orders, shipment statuses, and supporting documents.</p>
          </Card>
          <Card className="border-white/10 bg-white/5 p-5 text-white">
            <ShieldCheck className="h-8 w-8 text-accent" />
            <p className="mt-4 font-semibold">Secure by Role</p>
            <p className="mt-2 text-sm text-slate-300">RLS-backed access for admins, operators, and customers.</p>
          </Card>
        </div>
      </section>

      <section className="flex items-center">
        <Card className="w-full border-white/50 p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">Login</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900">Access your control tower</h2>
          <p className="mt-3 text-sm text-muted">
            Use a Supabase Auth user. The default seeded demo role should be `ops`.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            New user?{" "}
            <Link className="font-medium text-primary" href="/signup">
              Create an account
            </Link>
          </p>
        </Card>
      </section>
    </main>
  );
}
