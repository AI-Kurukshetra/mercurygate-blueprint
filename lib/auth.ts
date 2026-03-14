import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/lib/supabase/types";

export async function getSessionProfile() {
  const supabase = await createClient();
  const admin = createAdminClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null as Profile | null };
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: (profile as Profile | null) ?? null };
}

export async function requireAuth() {
  const session = await getSessionProfile();

  if (!session.user) {
    redirect("/login");
  }

  return session;
}

export async function requireRole(roles: UserRole[]) {
  const session = await requireAuth();

  if (!session.profile || !roles.includes(session.profile.role)) {
    redirect("/dashboard");
  }

  return session;
}
