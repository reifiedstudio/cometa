"use client";

import { useClerk, useOrganization, useUser } from "@clerk/clerk-react";
import {
  ALL_CAPABILITY_KEYS,
  type CapabilityKey,
  ROLES,
  type RoleKey,
  getEffectiveCapabilities,
  getCapabilitiesByDomain,
} from "@cometa/auth";
import { AppLayout } from "@cometa/ui/app-layout";
import { AppPage } from "@cometa/ui/app-page";
import { Button } from "@cometa/ui/ui/button";
import { Badge } from "@cometa/ui/ui/badge";
import { Users, Check, Pencil } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ROLE_LIST = Object.values(ROLES);

const ROLE_STYLES: Record<string, string> = {
  "org:admin": "bg-violet-50 text-violet-700 border-violet-200/60",
  "org:accounting_member": "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  "org:legal_member": "bg-blue-50 text-blue-700 border-blue-200/60",
  "org:operations_member": "bg-amber-50 text-amber-700 border-amber-200/60",
  "org:hr_member": "bg-rose-50 text-rose-700 border-rose-200/60",
  "org:member": "bg-muted text-muted-foreground border-border",
};

const navItems = [
  { title: "Members", url: "/", icon: Users },
];

function roleName(key: string) {
  return ROLES[key as RoleKey]?.name ?? "Member";
}

function memberName(m: any): string {
  return (
    [m.publicUserData?.firstName, m.publicUserData?.lastName]
      .filter(Boolean)
      .join(" ") || m.publicUserData?.identifier || "—"
  );
}

export default function MemberDetailClient() {
  const pathname = usePathname();
  const userId = pathname?.split("/members/")[1]?.replace(/\/$/, "") ?? "";
  const { signOut } = useClerk();
  const { user } = useUser();
  const { organization, memberships, isLoaded } = useOrganization({
    memberships: { pageSize: 50 },
  });
  const [editing, setEditing] = useState(false);

  const members = memberships?.data ?? [];
  const member = members.find(
    (m: any) => m.publicUserData?.userId === userId || m.id === userId,
  );

  const handleChangeRole = async (newRole: string) => {
    if (!member) return;
    try {
      await member.update({ role: newRole });
      memberships?.revalidate?.();
    } catch (err) {
      console.error("Role change failed:", err);
    }
  };

  const handleToggleCapability = async (capKey: string) => {
    if (!member) return;
    const extras = (member.publicMetadata?.extraCapabilities as string[]) ?? [];
    const roleCaps = getEffectiveCapabilities(member.role as RoleKey, []);
    if (roleCaps.includes(capKey as CapabilityKey)) return;
    const has = extras.includes(capKey);
    const updated = has ? extras.filter((c: string) => c !== capKey) : [...extras, capKey];
    try {
      await member.update({
        publicMetadata: { ...member.publicMetadata, extraCapabilities: updated },
      });
      memberships?.revalidate?.();
    } catch (err) {
      console.error("Capability toggle failed:", err);
    }
  };

  const name = member ? memberName(member) : "Member";
  const role = (member?.role as RoleKey) ?? "org:member";
  const roleDef = ROLES[role];
  const extraCapabilities = (member?.publicMetadata?.extraCapabilities as string[]) ?? [];
  const roleCaps = getEffectiveCapabilities(role, []);
  const capsByDomain = getCapabilitiesByDomain();

  return (
    <AppLayout
      navItems={navItems}
      user={{
        name: user?.fullName || "User",
        email: user?.primaryEmailAddress?.emailAddress || "",
        avatar: user?.imageUrl || "",
      }}
      onSignOut={() => signOut()}
    >
      <AppPage
        breadcrumbs={[{ label: "Admin" }, { label: "Members", href: "/" }, { label: name }]}
        title={name}
        description={member?.publicUserData?.identifier}
        actions={
          <>
            {member && (
              <Badge className={`border text-[11px] ${ROLE_STYLES[member.role] ?? ROLE_STYLES["org:member"]}`}>
                {roleName(member.role)}
              </Badge>
            )}
            <Button
              variant={editing ? "default" : "outline"}
              size="sm"
              onClick={() => setEditing(!editing)}
            >
              {editing ? <><Check className="size-4" /> Done</> : <><Pencil className="size-4" /> Edit</>}
            </Button>
          </>
        }
      >
        {!isLoaded || !member ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            {!isLoaded ? null : "Member not found"}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Role */}
            <div>
              <h2 className="text-sm font-medium mb-3">Role</h2>
              {editing ? (
                <div className="space-y-1.5">
                  {ROLE_LIST.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => handleChangeRole(r.key)}
                      className={`w-full text-left flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        member.role === r.key ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.description}</p>
                      </div>
                      {member.role === r.key && <Check className="size-4 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium">{roleDef?.name ?? "Member"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{roleDef?.description}</p>
                </div>
              )}
            </div>

            {/* Capabilities */}
            <div>
              <h2 className="text-sm font-medium mb-3">
                Capabilities
                {roleDef?.isAdmin && (
                  <span className="ml-2 text-xs text-muted-foreground font-normal">(admin — all granted)</span>
                )}
              </h2>
              <div className="rounded-lg border divide-y">
                {Object.entries(capsByDomain).map(([domain, caps]) => (
                  <div key={domain} className="p-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{domain}</p>
                    <div className="space-y-1">
                      {caps.map((cap) => {
                        const fromRole = roleCaps.includes(cap.key as CapabilityKey);
                        const isExtra = extraCapabilities.includes(cap.key);
                        const hasIt = roleDef?.isAdmin || fromRole || isExtra;

                        return (
                          <div key={cap.key} className="flex items-center justify-between py-1 text-sm">
                            <div className="flex items-center gap-2">
                              <div className={`size-2 rounded-full ${hasIt ? "bg-emerald-500" : "bg-muted-foreground/20"}`} />
                              <span className={hasIt ? "" : "text-muted-foreground"}>{cap.name}</span>
                              {isExtra && !fromRole && (
                                <span className="text-[10px] px-1 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">custom</span>
                              )}
                            </div>
                            {roleDef?.isAdmin ? (
                              <span className="text-xs text-muted-foreground">admin</span>
                            ) : editing ? (
                              <button
                                type="button"
                                onClick={() => handleToggleCapability(cap.key)}
                                className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${hasIt ? "bg-primary" : "bg-muted"}`}
                              >
                                <span className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform mt-[3px] ${hasIt ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
                              </button>
                            ) : (
                              <span className="text-xs text-muted-foreground">{fromRole ? "role" : isExtra ? "custom" : "—"}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AppPage>
    </AppLayout>
  );
}
