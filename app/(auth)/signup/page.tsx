import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Building2, UserRoundPlus } from "lucide-react";

import { SignupForm } from "@/components/auth/signup-form";
import { Card } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Sign Up | NextGen Transportation Management System (TMS)",
  description: "Create an account for the Transportation Management System MVP."
};

export default function SignupPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative overflow-hidden rounded-[40px] border border-slate-900/10 bg-white/80 p-8 shadow-panel backdrop-blur lg:p-12">
        <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-0 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
        <p className="text-xs uppercase tracking-[0.35em] text-accent">Self-Service Signup</p>
        <h1 className="mt-4 max-w-xl font-display text-5xl font-semibold leading-tight text-slate-900">
          Create your TMS workspace login in under a minute.
        </h1>
        <p className="mt-6 max-w-2xl text-sm text-muted">
          New accounts are created in Supabase Auth. The database trigger provisions a matching
          profile automatically, and new users start with the default `customer` role until an admin
          promotes them.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <UserRoundPlus className="h-8 w-8 text-primary" />
            <p className="mt-4 font-semibold text-slate-900">Create Account</p>
            <p className="mt-2 text-sm text-muted">Register with email, password, and full name.</p>
          </Card>
          <Card className="p-5">
            <Building2 className="h-8 w-8 text-primary" />
            <p className="mt-4 font-semibold text-slate-900">Get Assigned</p>
            <p className="mt-2 text-sm text-muted">Admins can later attach your user to a customer account.</p>
          </Card>
          <Card className="p-5">
            <BadgeCheck className="h-8 w-8 text-primary" />
            <p className="mt-4 font-semibold text-slate-900">Start Using</p>
            <p className="mt-2 text-sm text-muted">Sign in after confirmation and access the right portal.</p>
          </Card>
        </div>

        <p className="mt-8 text-sm text-muted">
          Returning user?{" "}
          <Link className="font-medium text-primary" href="/login">
            Go to login
          </Link>
        </p>
      </section>

      <section className="flex items-center">
        <Card className="w-full border-white/50 p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">Create Account</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900">
            Sign up for NextGen Transportation Management System (TMS)
          </h2>
          <p className="mt-3 text-sm text-muted">
            Use a valid email. If email confirmation is enabled in Supabase Auth, verify the inbox
            before signing in.
          </p>
          <div className="mt-8">
            <SignupForm />
          </div>
        </Card>
      </section>
    </main>
  );
}
