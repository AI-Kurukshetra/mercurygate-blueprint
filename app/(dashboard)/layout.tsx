import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/primitives";
import { ROLE_LABELS } from "@/lib/constants";
import { getSessionProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

async function signOut() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getSessionProfile();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[290px_1fr] lg:px-6">
      <Sidebar />

      <div className="relative overflow-hidden rounded-[32px] border border-border/80 bg-white/70 p-4 shadow-panel backdrop-blur-xl md:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-300/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-44 w-44 rounded-full bg-cyan-200/25 blur-3xl" />

        <header className="relative mb-6 flex flex-col gap-4 rounded-[28px] border border-border/80 bg-white/80 px-5 py-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Session</p>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              {profile?.full_name || user.email}
            </h2>
            <p className="text-sm text-muted">
              {profile ? ROLE_LABELS[profile.role] : "No profile"} access
            </p>
          </div>

          <form action={signOut}>
            <Button className="gap-2 bg-slate-900 bg-none shadow-none hover:bg-slate-800" type="submit">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </header>

        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
