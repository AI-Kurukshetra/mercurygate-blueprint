import type { Metadata } from "next";

import { UserAccessManager } from "@/components/users/user-access-manager";
import { PageHeader } from "@/components/tms/page-header";
import { Card } from "@/components/ui/primitives";
import { requireRole } from "@/lib/auth";
import { getCustomers, getProfiles } from "@/lib/data/tms";

export const metadata: Metadata = {
  title: "Users | NextGen Transportation Management System (TMS)",
  description: "Admin-only user role and customer access management."
};

export default async function UsersPage() {
  await requireRole(["admin"]);
  const [profiles, customers] = await Promise.all([getProfiles(), getCustomers()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="User Access"
        title="Assign roles and customer visibility"
        description="Admins can promote new signups to operations users or map customer users to their shipper account."
      />

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">User Directory</h3>
        <UserAccessManager profiles={profiles} customers={customers} />
      </Card>
    </div>
  );
}
