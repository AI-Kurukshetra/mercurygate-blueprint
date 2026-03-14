"use client";

import { useState } from "react";

import { updateUserAccess } from "@/app/actions/tms";
import { Button, Select } from "@/components/ui/primitives";
import type { Customer, Profile } from "@/lib/supabase/types";

type UserAccessManagerProps = {
  profiles: Profile[];
  customers: Customer[];
};

type AccessDraft = {
  role: Profile["role"];
  customerId: string;
};

export function UserAccessManager({ profiles, customers }: UserAccessManagerProps) {
  const [drafts, setDrafts] = useState<Record<string, AccessDraft>>(
    Object.fromEntries(
      profiles.map((profile) => [
        profile.id,
        {
          role: profile.role,
          customerId: profile.customer_id ?? ""
        }
      ])
    )
  );
  const [messages, setMessages] = useState<Record<string, string>>({});

  function updateDraft(profileId: string, next: Partial<AccessDraft>) {
    setDrafts((current) => ({
      ...current,
      [profileId]: {
        ...current[profileId],
        ...next
      }
    }));
  }

  async function onSave(profileId: string) {
    const draft = drafts[profileId];
    const result = await updateUserAccess({
      profileId,
      role: draft.role,
      customerId: draft.role === "customer" && draft.customerId ? draft.customerId : null
    });

    setMessages((current) => ({
      ...current,
      [profileId]: result.message
    }));
  }

  return (
    <div className="space-y-4">
      {profiles.map((profile) => {
        const draft = drafts[profile.id];

        return (
          <div
            key={profile.id}
            className="grid gap-4 rounded-3xl border border-border bg-white p-5 md:grid-cols-[1.3fr_0.8fr_1fr_auto]"
          >
            <div>
              <p className="font-semibold text-slate-900">{profile.full_name || profile.email}</p>
              <p className="text-sm text-muted">{profile.email}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
              <Select
                value={draft.role}
                onChange={(event) =>
                  updateDraft(profile.id, {
                    role: event.target.value as Profile["role"]
                  })
                }
              >
                <option value="admin">Admin</option>
                <option value="ops">Operations</option>
                <option value="customer">Customer</option>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Customer Account</label>
              <Select
                disabled={draft.role !== "customer"}
                value={draft.customerId}
                onChange={(event) =>
                  updateDraft(profile.id, {
                    customerId: event.target.value
                  })
                }
              >
                <option value="">No customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full" onClick={() => void onSave(profile.id)}>
                Save
              </Button>
            </div>

            {messages[profile.id] ? (
              <p className="md:col-span-4 text-sm text-muted">{messages[profile.id]}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
