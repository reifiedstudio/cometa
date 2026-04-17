"use client";

import { useOrganization } from "@clerk/clerk-react";

const SERVICES = [
  { name: "Intake", domain: "intake.daniellourie.me", status: "connected" },
  { name: "Tasks", domain: "tasks.daniellourie.me", status: "connected" },
  { name: "MCP Gateway", domain: "mcp.daniellourie.me", status: "connected" },
  { name: "Notes", domain: "notes.daniellourie.me", status: "connected" },
];

export default function SettingsPage() {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">Organization settings and connected services</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-5">
            <h2 className="font-semibold mb-1">Organization</h2>
            <p className="text-sm text-muted-foreground mb-4">Your organization details.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{organization?.name ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Members</span>
                <span className="text-sm font-medium">{organization?.membersCount ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-5">
            <h2 className="font-semibold mb-1">Connected Services</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Services that check permissions from this organization.
            </p>
            <div className="space-y-3">
              {SERVICES.map((svc) => (
                <div key={svc.name} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{svc.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{svc.domain}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-xs text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {svc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
